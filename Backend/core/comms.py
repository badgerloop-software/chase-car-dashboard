import json
import select
import socket
import struct

format_string = '<' # little-endian
byte_length = 0
properties = []
frontend_data = []
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


class TCP:
    __tmp_data = b''

    def listen_tcp(self, server_addr: str, port: int):
        global solar_car_connection
        while True:
            # create a client socket
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            try:
                client.connect((server_addr, port))
                solar_car_connection = True
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
                        frontend_data.append(d)
                else:
                    # Timeout occurred, close the connection and break the loop
                    client.close()
                    solar_car_connection = False
                    break



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
    gen_format_str("../Data/sc1-data-format/format.json")
    tcp = TCP()
    tcp.listen_tcp('127.0.0.1', 4003)
