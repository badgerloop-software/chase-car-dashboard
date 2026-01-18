"""
UDP Data Source

Receives telemetry data over UDP from:
- DataGenerator (for testing)
- DataReplayer (for replaying recorded data)
- Actual car over local network
"""

import socket
import select
import struct
import json
import threading
from typing import Dict, Any
from .base import DataSource
import config


class UDPDataSource(DataSource):
    """
    Receives telemetry data over UDP protocol.
    Used in local mode for DataGenerator, DataReplayer, or direct car connection.
    """
    
    def __init__(self, port: int = None):
        super().__init__("udp")
        self.port = port or config.UDP_PORT
        self.socket = None
        self._format_string = '<'  # little-endian
        self._byte_length = 0
        self._properties = []
        self._header = '<bsr>'
        self._footer = '</bsr>'
        self._tmp_buffer = b''
        
        # Load data format
        self._load_format()
    
    def _load_format(self):
        """Load the data format from the format.json file."""
        types = {'bool': '?', 'float': 'f', 'char': 'c', 'uint8': 'B', 'uint16': 'H', 'uint64': 'Q'}
        
        try:
            with open(config.DATAFORMAT_PATH, 'r') as f:
                data_format = json.load(f)
            
            for key in data_format.keys():
                self._format_string += types[data_format[key][1]]
                self._byte_length += data_format[key][0]
                self._properties.append(key)
        except Exception as e:
            print(f"[UDP] Error loading data format: {e}")
    
    def connect(self) -> bool:
        """Create and bind the UDP socket."""
        try:
            self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            self.socket.bind(('', self.port))
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 1024)
            self.is_connected = True
            print(f"[UDP] Listening on port {self.port}")
            return True
        except Exception as e:
            print(f"[UDP] Failed to bind: {e}")
            self.is_connected = False
            return False
    
    def disconnect(self):
        """Close the UDP socket."""
        if self.socket:
            self.socket.close()
            self.socket = None
        self.is_connected = False
        print("[UDP] Disconnected")
    
    def start_listening(self):
        """Start the UDP listening thread."""
        if not self.is_connected:
            if not self.connect():
                return
        
        self._running = True
        self._thread = threading.Thread(target=self._listen_loop, daemon=True)
        self._thread.start()
    
    def _listen_loop(self):
        """Main listening loop for UDP data."""
        while self._running:
            try:
                readable, _, _ = select.select([self.socket], [], [], 5)
                if self.socket in readable:
                    data, addr = self.socket.recvfrom(1024)
                    if data:
                        packets = self._parse_packets(data)
                        for packet in packets:
                            if len(packet) == self._byte_length:
                                parsed_data = self._unpack_data(packet)
                                timestamp = parsed_data.get('tstamp_unix', 0)
                                self.is_connected = True
                                self._emit_data(parsed_data, timestamp)
                else:
                    # Timeout - no data received
                    self.is_connected = False
            except Exception as e:
                print(f"[UDP] Error in listen loop: {e}")
                self.is_connected = False
    
    def _parse_packets(self, data: bytes) -> list:
        """Parse incoming data into packets based on header/footer."""
        self._tmp_buffer += data
        packets = []
        
        while True:
            start_idx = self._tmp_buffer.find(self._header.encode())
            if start_idx == -1:
                break
                
            end_idx = self._tmp_buffer.find(self._footer.encode(), start_idx)
            if end_idx == -1:
                break
            
            packet_start = start_idx + len(self._header)
            packet = self._tmp_buffer[packet_start:end_idx]
            packets.append(packet)
            
            self._tmp_buffer = self._tmp_buffer[end_idx + len(self._footer):]
        
        return packets
    
    def _unpack_data(self, data: bytes) -> Dict[str, Any]:
        """Unpack binary data into a dictionary."""
        fields = {}
        try:
            unpacked_data = struct.unpack(self._format_string, data)
            for i, prop in enumerate(self._properties):
                value = unpacked_data[i]
                # Handle inf/-inf values
                if isinstance(value, float) and (value == float('inf') or value == float('-inf')):
                    value = -10000
                fields[prop] = value
        except Exception as e:
            print(f"[UDP] Error unpacking data: {e}")
        
        return fields
