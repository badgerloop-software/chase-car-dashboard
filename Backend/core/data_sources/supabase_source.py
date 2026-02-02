"""
Supabase Data Source

Receives telemetry data from Supabase Realtime database.
This is the primary data source for cloud deployments.
"""

import threading
import time
import json
from typing import Dict, Any, Optional
from .base import DataSource
import config


class SupabaseDataSource(DataSource):
    """
    Receives telemetry data from Supabase.
    
    Supabase provides real-time subscriptions via PostgreSQL's
    built-in replication, making it ideal for receiving live
    telemetry data from the solar car via LTE.
    """
    
    def __init__(self):
        super().__init__("supabase")
        self.supabase_url = config.SUPABASE_URL
        self.supabase_key = config.SUPABASE_KEY
        self._client = None
        self._subscription = None
        self._poll_interval = 0.5  # seconds
    
    def connect(self) -> bool:
        """
        Initialize Supabase client.
        """
        if not self.supabase_url or not self.supabase_key:
            print("[Supabase] No Supabase URL or key configured")
            return False
        
        try:
            from supabase import create_client, Client
            
            self._client: Client = create_client(self.supabase_url, self.supabase_key)
            print(f"[Supabase] Connected to: {self.supabase_url}")
            self.is_connected = True
            return True
            
        except ImportError:
            print("[Supabase] supabase-py package not installed. Install with: pip install supabase")
            self.is_connected = False
            return False
        except Exception as e:
            print(f"[Supabase] Failed to connect: {e}")
            self.is_connected = False
            return False
    
    def disconnect(self):
        """Disconnect from Supabase."""
        if self._subscription:
            try:
                self._subscription.unsubscribe()
            except Exception:
                pass
            self._subscription = None
        
        self._client = None
        self.is_connected = False
        print("[Supabase] Disconnected")
    
    def start_listening(self):
        """Start listening for Supabase updates."""
        if not self.supabase_url or not self.supabase_key:
            print("[Supabase] Cannot start - no URL or key configured")
            return
        
        self._running = True
        self._thread = threading.Thread(target=self._listen_loop, daemon=True)
        self._thread.start()
    
    def _listen_loop(self):
        """
        Main listening loop for Supabase data.
        
        This polls the telemetry table for the latest data.
        For true real-time, you can use Supabase Realtime subscriptions.
        """
        while self._running:
            try:
                if not self.is_connected:
                    self.connect()
                    if not self.is_connected:
                        time.sleep(5)
                        continue
                
                # Query the latest telemetry record
                # Assumes a table named 'telemetry' with columns matching your data format
                response = self._client.table('telemetry') \
                    .select('*') \
                    .order('timestamp', desc=True) \
                    .limit(1) \
                    .execute()
                
                if response.data and len(response.data) > 0:
                    record = response.data[0]
                    timestamp = record.get('timestamp', int(time.time() * 1000))
                    
                    # Remove metadata fields before passing to callback
                    data = {k: v for k, v in record.items() 
                            if k not in ('id', 'created_at', 'updated_at')}
                    
                    if self._on_data_callback:
                        self._on_data_callback(data, timestamp, self.name)
                
                time.sleep(self._poll_interval)
                
            except Exception as e:
                print(f"[Supabase] Error in listen loop: {e}")
                self.is_connected = False
                time.sleep(2)
    
    def start_realtime(self):
        """
        Start real-time subscription to telemetry changes.
        
        This is more efficient than polling for high-frequency updates.
        """
        if not self._client:
            print("[Supabase] Cannot start realtime - not connected")
            return
        
        try:
            # Subscribe to INSERT events on the telemetry table
            self._subscription = self._client.channel('telemetry-changes') \
                .on_postgres_changes(
                    event='INSERT',
                    schema='public',
                    table='telemetry',
                    callback=self._on_realtime_event
                ) \
                .subscribe()
            
            print("[Supabase] Realtime subscription started")
        except Exception as e:
            print(f"[Supabase] Failed to start realtime: {e}")
    
    def _on_realtime_event(self, payload):
        """Handle real-time events from Supabase."""
        try:
            record = payload.get('new', {})
            timestamp = record.get('timestamp', int(time.time() * 1000))
            
            # Remove metadata fields
            data = {k: v for k, v in record.items() 
                    if k not in ('id', 'created_at', 'updated_at')}
            
            if self._on_data_callback:
                self._on_data_callback(data, timestamp, self.name)
                
        except Exception as e:
            print(f"[Supabase] Error processing realtime event: {e}")
    
    @property
    def status(self) -> Dict[str, Any]:
        """Get current status of the Supabase connection."""
        return {
            'name': self.name,
            'connected': self.is_connected,
            'url': self.supabase_url[:30] + '...' if self.supabase_url else None,
            'last_timestamp': self.last_timestamp,
        }
