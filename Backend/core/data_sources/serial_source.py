"""
Serial Data Source

Receives telemetry data over serial connection from the radio.
Only available in local mode.
"""

import serial
import struct
import json
import time
import threading
from typing import Dict, Any, Optional
from .base import DataSource
import config


class SerialDataSource(DataSource):
    """
    Receives telemetry data over serial port from the radio.
    Only works in local mode when hardware is connected.
    """
    
    def __init__(self):
        super().__init__("serial")
        self.device = ""
        self.baud_rate = 115200
        self.serial_conn: Optional[serial.Serial] = None
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
            print(f"[Serial] Error loading data format: {e}")
    
    def set_device(self, device: str, baud_rate: int = 115200):
        """
        Set the serial device to connect to.
        
        Args:
            device: The serial port path (e.g., /dev/ttyUSB0)
            baud_rate: Baud rate for the connection
        """
        self.device = device
        self.baud_rate = baud_rate
    
    def connect(self) -> bool:
        """Establish serial connection."""
        if not self.device:
            print("[Serial] No device configured")
            return False
        
        try:
            self.serial_conn = serial.Serial(self.device, self.baud_rate)
            self.is_connected = True
            print(f"[Serial] Connected to {self.device} at {self.baud_rate} baud")
            return True
        except Exception as e:
            print(f"[Serial] Failed to connect: {e}")
            self.is_connected = False
            return False
    
    def disconnect(self):
        """Close the serial connection."""
        if self.serial_conn:
            self.serial_conn.close()
            self.serial_conn = None
        self.is_connected = False
        self.device = ""
        print("[Serial] Disconnected")
    
    def start_listening(self):
        """Start the serial listening thread."""
        self._running = True
        self._thread = threading.Thread(target=self._listen_loop, daemon=True)
        self._thread.start()
    
    def _listen_loop(self):
        """Main listening loop for serial data."""
        last_data_time = 0
        
        while self._running:
            # If no device configured, wait
            if not self.device:
                self.is_connected = False
                time.sleep(1)
                continue
            
            # If not connected, try to connect
            if not self.serial_conn or not self.serial_conn.is_open:
                if not self.connect():
                    time.sleep(1)
                    continue
            
            try:
                # Check for data
                if self.serial_conn.in_waiting > 0:
                    data = self.serial_conn.read(self.serial_conn.in_waiting)
                    packets = self._parse_packets(data)
                    
                    for packet in packets:
                        if len(packet) == self._byte_length:
                            parsed_data = self._unpack_data(packet)
                            timestamp = parsed_data.get('tstamp_unix', 0)
                            last_data_time = time.time()
                            self.is_connected = True
                            self._emit_data(parsed_data, timestamp)
                else:
                    time.sleep(0.1)
                
                # Check for timeout (5 seconds without data)
                if time.time() - last_data_time > 5:
                    self.is_connected = False
                    
            except Exception as e:
                print(f"[Serial] Error: {e}")
                self.is_connected = False
                self.disconnect()
                time.sleep(1)
    
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
            print(f"[Serial] Error unpacking data: {e}")
        
        return fields
    
    @staticmethod
    def list_available_ports() -> list:
        """List all available serial ports."""
        import serial.tools.list_ports
        ports = serial.tools.list_ports.comports()
        return [port.device for port in sorted(ports, key=lambda p: p.device)]
