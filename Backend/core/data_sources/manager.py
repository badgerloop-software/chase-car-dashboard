"""
Data Source Manager

Coordinates multiple data sources and handles:
- Starting/stopping data sources based on configuration
- Timestamp-based deduplication (latest data wins)
- Forwarding data to the cache/database layer
"""

import threading
import time
from typing import Dict, Any, Optional, Callable
import config

from .udp_source import UDPDataSource
from .serial_source import SerialDataSource
from .convex_source import ConvexDataSource


class DataSourceManager:
    """
    Manages all data sources and coordinates data flow.
    
    Responsibilities:
    - Initialize enabled data sources based on config
    - Handle incoming data from multiple sources
    - Deduplicate based on timestamp (latest wins)
    - Forward data to database/cache layer
    - Provide unified status and control interface
    """
    
    _instance = None
    
    def __new__(cls):
        """Singleton pattern - only one manager instance."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        self._initialized = True
        self._lock = threading.Lock()
        
        # Latest data from any source
        self.latest_data: Dict[str, Any] = {}
        self.latest_timestamp: int = 0
        self.latest_source: str = ""
        
        # Connection status for each source
        self.connection_status = {
            'udp': False,
            'serial': False,
            'convex': False,
            'lte': False,  # Legacy - alias for convex
        }
        
        # Data sources
        self._sources: Dict[str, Any] = {}
        
        # Callback for when new data arrives
        self._on_data_callback: Optional[Callable] = None
        
        # Initialize sources based on config
        self._init_sources()
    
    def _init_sources(self):
        """Initialize data sources based on configuration."""
        print(f"[DataSourceManager] Initializing in {config.DEPLOYMENT_MODE} mode")
        
        # UDP source (local mode only)
        if config.ENABLE_UDP:
            self._sources['udp'] = UDPDataSource()
            self._sources['udp'].set_data_callback(self._on_data_received)
            print("[DataSourceManager] UDP source enabled")
        
        # Serial source (local mode only)
        if config.ENABLE_SERIAL:
            self._sources['serial'] = SerialDataSource()
            self._sources['serial'].set_data_callback(self._on_data_received)
            print("[DataSourceManager] Serial source enabled")
        
        # Convex source (both modes)
        if config.ENABLE_CONVEX:
            self._sources['convex'] = ConvexDataSource()
            self._sources['convex'].set_data_callback(self._on_data_received)
            print("[DataSourceManager] Convex source enabled")
    
    def start(self):
        """Start all enabled data sources."""
        print("[DataSourceManager] Starting data sources...")
        
        for name, source in self._sources.items():
            try:
                source.start_listening()
                print(f"[DataSourceManager] Started {name} source")
            except Exception as e:
                print(f"[DataSourceManager] Failed to start {name}: {e}")
    
    def stop(self):
        """Stop all data sources."""
        print("[DataSourceManager] Stopping data sources...")
        
        for name, source in self._sources.items():
            try:
                source.stop_listening()
                source.disconnect()
            except Exception as e:
                print(f"[DataSourceManager] Error stopping {name}: {e}")
    
    def _on_data_received(self, data: Dict[str, Any], timestamp: int, source_name: str):
        """
        Handle incoming data from any source.
        
        Uses timestamp-based deduplication - only processes data
        if it's newer than what we already have.
        """
        with self._lock:
            # Only update if this data is newer
            if timestamp > self.latest_timestamp:
                self.latest_data = data.copy()
                self.latest_timestamp = timestamp
                self.latest_source = source_name
                
                # Update connection status
                self.connection_status[source_name] = True
                
                # Call the data callback if set
                if self._on_data_callback:
                    self._on_data_callback(data, timestamp, source_name)
            
            # Update connection status even if data isn't newer
            if source_name in self._sources:
                self.connection_status[source_name] = self._sources[source_name].is_connected
    
    def set_data_callback(self, callback: Callable):
        """Set callback for when new data arrives."""
        self._on_data_callback = callback
    
    def get_latest_data(self) -> Dict[str, Any]:
        """Get the latest data from any source."""
        with self._lock:
            if not self.latest_data:
                return {}
            
            # Add metadata
            data = self.latest_data.copy()
            data['solar_car_connection'] = any(self.connection_status.values())
            data['udp_status'] = self.connection_status.get('udp', False)
            data['serial_status'] = self.connection_status.get('serial', False)
            data['convex_status'] = self.connection_status.get('convex', False)
            data['lte_status'] = self.connection_status.get('convex', False)  # Legacy alias
            data['data_source'] = self.latest_source
            
            return data
    
    def is_connected(self) -> bool:
        """Check if any data source is connected."""
        return any(self.connection_status.values())
    
    def get_status(self) -> Dict[str, Any]:
        """Get status of all data sources."""
        status = {
            'deployment_mode': config.DEPLOYMENT_MODE,
            'connected': self.is_connected(),
            'latest_timestamp': self.latest_timestamp,
            'latest_source': self.latest_source,
            'sources': {}
        }
        
        for name, source in self._sources.items():
            status['sources'][name] = source.status
        
        return status
    
    # ==================== Serial Control ====================
    
    def connect_serial(self, device: str, baud_rate: int = 115200) -> bool:
        """Connect to a serial device."""
        if 'serial' not in self._sources:
            return False
        
        serial_source = self._sources['serial']
        serial_source.set_device(device, baud_rate)
        return serial_source.connect()
    
    def disconnect_serial(self):
        """Disconnect from serial device."""
        if 'serial' in self._sources:
            self._sources['serial'].disconnect()
    
    def list_serial_ports(self) -> list:
        """List available serial ports."""
        if 'serial' in self._sources:
            return SerialDataSource.list_available_ports()
        return []
    
    def get_serial_info(self) -> Dict[str, Any]:
        """Get current serial connection info."""
        if 'serial' not in self._sources:
            return {'enabled': False}
        
        serial_source = self._sources['serial']
        return {
            'enabled': True,
            'connected': serial_source.is_connected,
            'device': serial_source.device,
            'baud_rate': serial_source.baud_rate,
            'available_ports': self.list_serial_ports()
        }


# Global instance
data_source_manager = DataSourceManager()
