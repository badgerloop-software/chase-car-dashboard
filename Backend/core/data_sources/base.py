"""
Base class for all data sources.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Callable
import threading


class DataSource(ABC):
    """
    Abstract base class for data sources.
    
    All data sources (Serial, UDP, Convex) implement this interface
    to provide a consistent way of receiving telemetry data.
    """
    
    def __init__(self, name: str):
        self.name = name
        self.is_connected = False
        self.last_timestamp = 0
        self._on_data_callback: Optional[Callable[[Dict[str, Any], int], None]] = None
        self._thread: Optional[threading.Thread] = None
        self._running = False
    
    @abstractmethod
    def connect(self) -> bool:
        """
        Establish connection to the data source.
        Returns True if successful, False otherwise.
        """
        pass
    
    @abstractmethod
    def disconnect(self):
        """
        Disconnect from the data source.
        """
        pass
    
    @abstractmethod
    def start_listening(self):
        """
        Start listening for incoming data in a background thread.
        """
        pass
    
    def stop_listening(self):
        """
        Stop the listening thread.
        """
        self._running = False
        if self._thread and self._thread.is_alive():
            self._thread.join(timeout=2.0)
    
    def set_data_callback(self, callback: Callable[[Dict[str, Any], int], None]):
        """
        Set a callback function to be called when new data arrives.
        
        Args:
            callback: Function that takes (data_dict, timestamp) as arguments
        """
        self._on_data_callback = callback
    
    def _emit_data(self, data: Dict[str, Any], timestamp: int):
        """
        Emit data to the callback if set.
        
        Args:
            data: The telemetry data dictionary
            timestamp: Unix timestamp in milliseconds
        """
        self.last_timestamp = timestamp
        if self._on_data_callback:
            self._on_data_callback(data, timestamp, self.name)
    
    @property
    def status(self) -> Dict[str, Any]:
        """
        Get the current status of this data source.
        """
        return {
            "name": self.name,
            "connected": self.is_connected,
            "last_timestamp": self.last_timestamp,
            "running": self._running
        }
