"""
Data Sources Module

This module provides a unified interface for receiving telemetry data from multiple sources:
- Serial (radio connection - local mode only)
- UDP (local network - local mode only)  
- Convex (cloud database - both modes)

The DataSourceManager handles:
- Receiving data from all enabled sources
- Timestamp-based deduplication (latest wins)
- Forwarding data to the cache layer
"""

from .manager import DataSourceManager
from .base import DataSource

__all__ = ['DataSourceManager', 'DataSource']
