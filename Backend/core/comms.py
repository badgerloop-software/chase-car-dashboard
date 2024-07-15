from os import getpid
import json, select, socket, struct, sys, time
import threading
import traceback
import aiohttp
import asyncio
import config
import serial

import signal
import sys

from multiprocessing import Process, Manager
from multiprocessing.managers import BaseManager
from . import db
from file_sync.file_sync_down.main import *

format_string = '<' # little-endian
byte_length = 0
properties = []
frontend_data = {}
solar_car_connection = {'lte': False, 'udp': False, 'serial': False}
# Convert dataformat to format string for struct conversion
# Docs: https://docs.python.org/3/library/struct.html
types = {'bool': '?', 'float': 'f', 'char': 'c', 'uint8': 'B', 'uint16': 'H', 'uint64': 'Q'}
serial_port = {"device": "", 'baud': 115200}    # shared object with core_api for setting serial device from frontend

def set_format(file_path: str):
    global format_string, byte_length, properties
    with open(file_path, 'r') as f:
        data_format = json.load(f)

    for key in data_format.keys():
        format_string += types[data_format[key][1]]
        byte_length += data_format[key][0]
        properties.append(key)
        config.FORMAT[key] = {'type': data_format[key][1], 'min': data_format[key][3], 'max': data_format[key][4]}

def unpack_data(data):
    fields = {}
    unpacked_data = struct.unpack(format_string, data)
    for i in range(len(properties)):
        fields[properties[i]] = unpacked_data[i]
        # if the data is -inf or inf, we set it to -10000
        if fields[properties[i]] == float('inf') or fields[properties[i]] == float('-inf'):
            fields[properties[i]] = -10000
    return fields


class Telemetry:
    __tmp_data = {'tcp': b'', 'lte': b'', 'udp': b'', 'file_sync': b'', 'serial': b''}
    latest_tstamp = 0

    def listen_udp(self, port: int):
        global solar_car_connection, frontend_data
        # Create a client socket for UDP
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        print(f'listening on {port}')

        # Bind the client to the local address and port to receive incoming UDP datagrams
        sock.bind(('', port))

        # set max buffer size to eliminate queueing
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 1024)
        while True:
            try:
                # Wait for data to be received or timeout after 5 seconds
                readable, _, _ = select.select([sock], [], [], 5)
                if sock in readable:
                    data, addr = sock.recvfrom(1024)
                    if not data:
                        # No data received, continue listening
                        continue

                    packets = self.parse_packets(data, 'udp')
                    for packet in packets:
                        if len(packet) == byte_length:
                            d = unpack_data(packet)
                            frontend_data = d.copy()
                            try:
                                db.insert_data(d)
                            except Exception as e:
                                print(traceback.format_exc())
                                continue
                            solar_car_connection['udp'] = True
                else:
                    # Timeout occurred, handle as needed
                    solar_car_connection['udp'] = False
            except Exception as e:
                solar_car_connection['udp'] = False
                print(f"Exception in UDP thread {e}")
                continue

    def listen_tcp(self, server_addr: str, port: int):
        print(f'connecting to {server_addr}:{port}')
        global solar_car_connection, frontend_data
        while True:
            # create a client socket
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client.settimeout(5)
            try:
                client.connect((server_addr, port))
                solar_car_connection['tcp'] = True
                print('connected')
            except Exception:
                time.sleep(3)   # macOS is the superior system, it teaches you an important lesson of having patience
                continue

            # Set the socket to non-blocking mode
            client.setblocking(False)

            # Create a list of sockets to monitor for incoming data
            sockets = [client]

            while True:
                # Wait for data to be received or timeout after 5 seconds
                readable, _, _ = select.select(sockets, [], [], 5)

                if client in readable:
                    try:
                        data = client.recv(1000)
                    except Exception:
                        print(traceback.format_exc())
                        solar_car_connection['tcp'] = False
                        break
                    if not data:
                        # No data received, close the connection and break the loop
                        client.close()
                        print("connection closed")
                        break

                    packets = self.parse_packets(data, 'tcp')
                    for packet in packets:
                        if len(packet) == byte_length:
                            d = unpack_data(packet)
                            if d['tstamp_unix'] > self.latest_tstamp:
                                frontend_data = d.copy()
                                self.latest_tstamp = d['tstamp_unix']
                            db.insert_data(d)
                else:
                    # Timeout occurred, close the connection and break the loop
                    client.close()
                    solar_car_connection['tcp'] = False
                    break

    def serial_read(self):
        global frontend_data, serial_port
        latest_tstamp = 0
        while True:
            curr_device = serial_port['device']
            curr_baud = serial_port['baud']
            print(f"serial, {curr_device}")
            if(curr_device):
                print("connected")
                # Establish a serial connection)
                ser = serial.Serial(curr_device, curr_baud)
                # if device has been updated then exit loop and connect to new device
                while curr_device == serial_port['device'] and curr_baud == serial_port['baud']:
                    if time.time() - latest_tstamp > 5:
                        solar_car_connection['serial'] = False
                    # Read data from serial port
                    try:
                        data = b''
                        if(ser.in_waiting > 0):
                            data = ser.read(ser.in_waiting)
                        if not data:
                            # No data received, continue listening
                            continue
                        packets = self.parse_packets(data, 'serial')
                        for packet in packets:
                            if len(packet) == byte_length:
                                d = unpack_data(packet)
                                latest_tstamp = time.time()
                                try:
                                    frontend_data = d.copy()
                                    db.insert_data(d)
                                except Exception as e:
                                    print(traceback.format_exc())
                                    continue
                                solar_car_connection['serial'] = True
                    except Exception:
                        print("Exception in serial", traceback.format_exc())
                        solar_car_connection['serial'] = False
                        serial_port['device'] = ""
                        break
            else:
                solar_car_connection['serial'] = False
                # wait before retry
                time.sleep(1)

    async def fetch(self, session, url):
        try:
            async with session.get(url, timeout=2) as response:
                data = await response.json()
                return data['response']
        except asyncio.TimeoutError:
            print("Connection to the VPS timed out")
            return []
        except Exception as e:
            print(f"Error fetching data: {e}")
            return []

    async def remote_db_fetch(self, server_url: str):
        global frontend_data, solar_car_connection

        async with aiohttp.ClientSession() as session:
            while True:
                print("db")
                try:
                    table_name = await self.fetch(session, f'{server_url}/newest-timestamp-table')
                    latest_tstamp = int(time.time() * 1000)

                    while True:
                        data = await self.fetch(session, f'{server_url}/get-new-rows/{table_name}/{latest_tstamp}')
                        for d in data:
                            # update the timestamp for next query
                            if d['timestamp'] > latest_tstamp:
                                latest_tstamp = d['timestamp']

                            parsed_data = self.parse_packets(bytes(d['payload']['data']), 'lte')
                            if len(parsed_data[0]) == byte_length:
                                unpacked_data = unpack_data(parsed_data[0])
                                # if the new data has a timestamp later than any other we show the data to frontend
                                if unpacked_data['tstamp_unix'] > self.latest_tstamp:
                                    frontend_data = unpacked_data.copy()
                                    self.latest_tstamp = unpacked_data['tstamp_unix']

                                try:
                                    db.insert_data(unpacked_data)
                                except Exception as e:
                                    print(f"Error with inserting data in LTE code {e}")
                                    continue
                                solar_car_connection['lte'] = True

                        if time.time() - latest_tstamp / 1000 > 5:
                            solar_car_connection['lte'] = False
                            break
                except Exception as e:
                    solar_car_connection['lte'] = False
                    print(f"Error in the LTE thread: {e}")
                    continue

    def parse_packets(self, new_data: bytes, tmp_source: str):
        """
        Parse and check the length of each packet
        :param new_data: Newly received bytes from the comm channel
        :param tmp_source: Name of tmp data source, put comm channel name here e.g. tcp, lte
        """
        header = b'<bsr>'
        footer = b'</bsr>'
        self.__tmp_data[tmp_source] += new_data
        packets = []
        while True:
            # Search for the next complete data packet
            try:
                start_index = self.__tmp_data[tmp_source].index(header)
                end_index = self.__tmp_data[tmp_source].index(footer)
            except ValueError:
                break

            # Extract a complete data packet
            packets.append(self.__tmp_data[tmp_source][start_index + len(header):end_index])
            # Update the remaining data to exclude the processed packet
            self.__tmp_data[tmp_source] = self.__tmp_data[tmp_source][end_index + len(footer):]

        # If the remaining data is longer than the expected packet length,
        # there might be an incomplete packet, so log a warning.
        if len(self.__tmp_data[tmp_source]) >= byte_length+len(header)+len(footer):
            print(f"Source: {tmp_source}: Warning: Incomplete or malformed packet ------------------------------------")
            print(f"Data: {self.__tmp_data[tmp_source]}")
            self.__tmp_data[tmp_source] = b''

        return packets

    def fs_down_callback(self, data):
        # copied from listen_upd()
        if not data:
            # No data received, we're done here
            return

        packets = self.parse_packets(data, 'file_sync')
        for packet in packets:
            if len(packet) == byte_length:
                d = unpack_data(packet)
                try:
                    db.insert_data(d)
                except Exception as e:
                    print(traceback.format_exc())
                    continue



telemetry = Telemetry()
set_format(config.DATAFORMAT_PATH)
p = Process(target=sync, args=[telemetry.fs_down_callback])

# kill child process when parent received SIGINT
def sigint_handler(signal, frame):
    # must send SIGKILL because child process ignores SIGTERM for unknown reasons
    # TODO fix this?????????
    # p.kill() 
    sys.exit(0)

signal.signal(signal.SIGINT, sigint_handler)

def start_comms():
    # start file sync
    p.start()
    
    # Start two live comm channels
    vps_thread = threading.Thread(target=lambda : asyncio.run(telemetry.remote_db_fetch(config.VPS_URL)))
    vps_thread.start()
    #socket_thread = threading.Thread(target=lambda: telemetry.listen_udp(config.UDP_PORT))
    #socket_thread.start()
    socket_thread = threading.Thread(target=lambda: telemetry.serial_read())
    socket_thread.start()

