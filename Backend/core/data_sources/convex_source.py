"""
Convex Data Source

Receives telemetry data from Convex.dev cloud database.
This is the primary data source for cloud deployments and
can also be used alongside serial in local mode.
"""

import asyncio
import threading
import time
from typing import Dict, Any, Optional
from .base import DataSource
import config


class ConvexDataSource(DataSource):
    """
    Receives telemetry data from Convex.dev.
    
    Convex provides real-time subscriptions, making it ideal for
    receiving live telemetry data from the solar car via LTE.
    """
    
    def __init__(self):
        super().__init__("convex")
        self.convex_url = config.CONVEX_URL
        self._client = None
        self._subscription = None
        self._poll_interval = 0.5  # seconds
    
    def connect(self) -> bool:
        """
        Initialize Convex client.
        
        Note: Full Convex integration requires the convex Python client.
        For now, this is a placeholder that can be implemented when
        you're ready to integrate with Convex.
        """
        if not self.convex_url:
            print("[Convex] No Convex URL configured")
            return False
        
        try:
            # TODO: Initialize actual Convex client
            # from convex import ConvexClient
            # self._client = ConvexClient(self.convex_url)
            
            print(f"[Convex] Would connect to: {self.convex_url}")
            print("[Convex] Note: Full Convex integration pending")
            
            # For now, mark as connected if URL is configured
            # Real implementation will verify connection
            self.is_connected = True
            return True
            
        except Exception as e:
            print(f"[Convex] Failed to connect: {e}")
            self.is_connected = False
            return False
    
    def disconnect(self):
        """Disconnect from Convex."""
        if self._subscription:
            # Cancel subscription
            self._subscription = None
        
        if self._client:
            self._client = None
        
        self.is_connected = False
        print("[Convex] Disconnected")
    
    def start_listening(self):
        """Start listening for Convex updates."""
        if not self.convex_url:
            print("[Convex] Cannot start - no URL configured")
            return
        
        self._running = True
        self._thread = threading.Thread(target=self._listen_loop, daemon=True)
        self._thread.start()
    
    def _listen_loop(self):
        """
        Main listening loop for Convex data.
        
        This uses polling for now. When fully integrated,
        this should use Convex's real-time subscriptions.
        """
        while self._running:
            try:
                if not self.is_connected:
                    self.connect()
                    if not self.is_connected:
                        time.sleep(5)
                        continue
                
                # TODO: Replace with actual Convex subscription
                # For now, this is a placeholder polling loop
                # 
                # Real implementation would look like:
                # data = await self._client.query("telemetry:getLatest")
                # if data:
                #     timestamp = data.get('tstamp_unix', 0)
                #     self._emit_data(data, timestamp)
                
                time.sleep(self._poll_interval)
                
            except Exception as e:
                print(f"[Convex] Error in listen loop: {e}")
                self.is_connected = False
                time.sleep(5)
    
    async def push_data(self, data: Dict[str, Any]):
        """
        Push data to Convex (for when we receive data from other sources).
        
        This allows the dashboard to sync data from serial/UDP to Convex
        for other clients to access.
        """
        if not self._client:
            return
        
        try:
            # TODO: Implement actual Convex mutation
            # await self._client.mutation("telemetry:insert", data)
            pass
        except Exception as e:
            print(f"[Convex] Failed to push data: {e}")
