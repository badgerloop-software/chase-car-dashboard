import json, select, socket, struct
import sys

import config
from . import db

format_string = '<' # little-endian
byte_length = 0
properties = []
frontend_data = {}
solar_car_connection = False
# Convert dataformat to format string for struct conversion
# Docs: https://docs.python.org/3/library/struct.html
types = {'bool': '?', 'float': 'f', 'char': 'c', 'uint8': 'B', 'uint16': 'H'}

def gen_format_str(file_path: str):
    global format_string, byte_length, properties
    with open(file_path, 'r') as f:
        data_format = json.load(f)

    for key in data_format.keys():
        format_string += types[data_format[key][1]]
        byte_length += data_format[key][0]
        properties.append(key)
    print(byte_length)

def unpack_data(data):
    #print(solar_car_connection)
    fields = {}
    unpacked_data = struct.unpack(format_string, data)
    for i in range(len(properties)):
        fields[properties[i]] = unpacked_data[i]
    return fields


class Telemetry:
    __tmp_data = b''

    def listen_tcp(self, server_addr: str, port: int):
        print(f'connecting to {server_addr}:{port}')
        global solar_car_connection, frontend_data
        while True:
            # create a client socket
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            try:
                client.connect((server_addr, port))
                solar_car_connection = True
                print('connected')
            except ConnectionRefusedError:
                print(f'Connection to car server {server_addr} is refused')
                continue

            # Set the socket to non-blocking mode
            client.setblocking(False)

            # Create a list of sockets to monitor for incoming data
            sockets = [client]

            while True:
                # Wait for data to be received or timeout after 5 seconds
                readable, _, _ = select.select(sockets, [], [], 5)

                if client in readable:
                    data = client.recv(1000)
                    if not data:
                        # No data received, close the connection and break the loop
                        client.close()
                        break

                    packets = self.parse_packets(data)
                    for packet in packets:
                        d = unpack_data(packet)
                        frontend_data = d.copy()
                        db.insert_data(d)
                else:
                    # Timeout occurred, close the connection and break the loop
                    client.close()
                    solar_car_connection = False
                    break

    def listen_udp(self, server_addr: str, port: int):
        print(f'listening on {server_addr}:{port}')
        global solar_car_connection, frontend_data
        # Create a client socket for UDP
        client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

        # Bind the client to the local address and port to receive incoming UDP datagrams
        client.bind(('', port))

        while True:
            # Wait for data to be received or timeout after 5 seconds
            readable, _, _ = select.select([client], [], [], 5)

            if client in readable:
                data, addr = client.recvfrom(1000)
                print(data)
                if not data:
                    # No data received, continue listening
                    continue

                packets = self.parse_packets(data)
                for packet in packets:
                    d = unpack_data(packet)
                    frontend_data = d.copy()
                    db.insert_data(d)
                    solar_car_connection = True
            else:
                # Timeout occurred, handle as needed
                solar_car_connection = False

    def parse_packets(self, new_data: bytes):
        """Parse and check the length of each packet"""
        self.__tmp_data += new_data
        packets = []

        while True:
            # Search for the next complete data packet
            try:
                start_index = self.__tmp_data.index(b'<bl>')
                end_index = self.__tmp_data.index(b'</bl>')
            except ValueError:
                break

            #print("start index:", start_index, "end index:", end_index)
            #print(solar_car_connection)

            # Extract a complete data packet
            packets.append(self.__tmp_data[start_index + 4:end_index])
            # Update the remaining data to exclude the processed packet
            self.__tmp_data = self.__tmp_data[end_index + 5:]

        # If the remaining data is longer than the expected packet length,
        # there might be an incomplete packet, so log a warning.
        if len(self.__tmp_data) >= byte_length:
            print("ERROR: Incomplete or malformed packet ------------------------------------")
            self.__tmp_data = b''

        return packets


def start_comms():
    gen_format_str(config.DATAFORMAT_PATH)
    tel = Telemetry()
    tel.listen_udp(config.LOCAL_IP if len(sys.argv) > 1 and sys.argv[1]=='dev' else config.CAR_IP, config.DATA_PORT)