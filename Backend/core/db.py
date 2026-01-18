"""
Database Module

Provides caching and time-series storage for telemetry data.

In local mode: Uses Redis Stack with TimeSeries module for efficient time-based queries.
In cloud mode: Uses standard Redis (Upstash) with sorted sets for compatibility.
"""

import time
import redis
import config
import pandas as pd
from datetime import datetime
from typing import Dict, Any, List, Optional

# Initialize Redis connection based on deployment mode
if config.is_cloud_mode() and config.REDIS_URL:
    # Cloud mode: Connect via URL (Upstash format)
    r = redis.from_url(config.REDIS_URL, decode_responses=False)
    print(f"[DB] Connected to cloud Redis")
elif config.REDIS_URL:
    # Local mode: Connect via host/port
    r = redis.StrictRedis(host=config.REDIS_URL, port=config.REDIS_PORT, db=config.REDIS_DB)
    print(f"[DB] Connected to local Redis at {config.REDIS_URL}:{config.REDIS_PORT}")
else:
    r = None
    print("[DB] Warning: No Redis connection configured")


def insert_data(data_dict: Dict[str, Any]):
    """
    Insert telemetry data into Redis.
    
    Local mode: Uses TimeSeries for efficient time-based storage
    Cloud mode: Uses sorted sets with timestamp as score
    """
    if not r:
        return
    
    # Get the timestamp from the dictionary
    timestamp = data_dict.get('tstamp_unix', int(time.time() * 1000))
    
    # Create a copy to avoid modifying original
    data = data_dict.copy()
    
    # Remove timestamp-related keys from the data dictionary
    for key in ['tstamp_hr', 'tstamp_mn', 'tstamp_sc', 'tstamp_ms', 'tstamp_unix']:
        data.pop(key, None)
    
    if config.USE_TIMESERIES:
        # Local mode: Use TimeSeries commands
        _insert_timeseries(data, timestamp)
    else:
        # Cloud mode: Use sorted sets
        _insert_sorted_set(data, timestamp)


def _insert_timeseries(data: Dict[str, Any], timestamp: int):
    """Insert data using Redis TimeSeries (local mode)."""
    for key, value in data.items():
        try:
            if isinstance(value, bool):
                value = 1 if value else 0
            elif isinstance(value, bytes):
                value = ord(value)
            
            r.execute_command('TS.ADD', key, timestamp, value, 'ON_DUPLICATE', 'LAST')
        except Exception as e:
            # TimeSeries key might not exist, try to create it
            try:
                r.execute_command('TS.CREATE', key, 'RETENTION', 86400000)  # 24 hour retention
                r.execute_command('TS.ADD', key, timestamp, value, 'ON_DUPLICATE', 'LAST')
            except Exception:
                pass


def _insert_sorted_set(data: Dict[str, Any], timestamp: int):
    """Insert data using sorted sets (cloud mode)."""
    import json
    
    # Store each value with timestamp as score
    pipe = r.pipeline()
    for key, value in data.items():
        if isinstance(value, bool):
            value = 1 if value else 0
        elif isinstance(value, bytes):
            value = ord(value)
        
        # Use sorted set: key -> (score=timestamp, member=json(timestamp:value))
        member = f"{timestamp}:{value}"
        pipe.zadd(f"ts:{key}", {member: timestamp})
        
        # Trim to keep only last 24 hours of data
        cutoff = timestamp - 86400000
        pipe.zremrangebyscore(f"ts:{key}", '-inf', cutoff)
    
    pipe.execute()
    
    # Also store latest value in a hash for quick access
    r.hset("latest", mapping={k: str(v) for k, v in data.items()})
    r.hset("latest", "timestamp", str(timestamp))


async def query(keys: list, start_time, end_time, aggregate_methods: list, aggregate=1) -> pd.DataFrame:
    """Return requested historical data in a pandas dataframe."""
    if not r:
        return pd.DataFrame()
    
    assert len(keys) == len(aggregate_methods), "Length of keys and aggregate_methods should be the same"

    if end_time == '+':
        end_time = round(time.time() * 1000)

    if not keys:
        return pd.DataFrame()
    
    if config.USE_TIMESERIES:
        return await _query_timeseries(keys, start_time, end_time, aggregate_methods, aggregate)
    else:
        return await _query_sorted_set(keys, start_time, end_time)


async def _query_timeseries(keys: list, start_time, end_time, aggregate_methods: list, aggregate: int) -> pd.DataFrame:
    """Query using TimeSeries (local mode)."""
    df = pd.DataFrame()
    min_length = float('inf')

    for i in range(len(keys)):
        try:
            response = r.execute_command('TS.RANGE', keys[i], start_time, end_time, 
                                        'AGGREGATION', aggregate_methods[i], aggregate)
            data = [float(row[1]) for row in response]
            index = [row[0] for row in response]
            
            new_df = pd.DataFrame({keys[i]: data}, index=index)

            if len(data) < min_length:
                min_length = len(data)

            if df.empty:
                df = new_df
            else:
                df = pd.concat([df, new_df], axis=1)
        except Exception as e:
            print(f"[DB] Error querying {keys[i]}: {e}")

    if min_length != float('inf'):
        df = df.iloc[:min_length]

    return df


async def _query_sorted_set(keys: list, start_time, end_time) -> pd.DataFrame:
    """Query using sorted sets (cloud mode)."""
    df = pd.DataFrame()
    min_length = float('inf')

    for key in keys:
        try:
            # Get data from sorted set within time range
            results = r.zrangebyscore(f"ts:{key}", start_time, end_time)
            
            data = []
            index = []
            for item in results:
                if isinstance(item, bytes):
                    item = item.decode()
                ts, val = item.split(':')
                index.append(int(ts))
                data.append(float(val))
            
            new_df = pd.DataFrame({key: data}, index=index)

            if len(data) < min_length:
                min_length = len(data)

            if df.empty:
                df = new_df
            else:
                df = pd.concat([df, new_df], axis=1)
        except Exception as e:
            print(f"[DB] Error querying {key}: {e}")

    if min_length != float('inf'):
        df = df.iloc[:min_length]

    return df


async def query_without_aggregation(keys: list, start_time, end_time) -> pd.DataFrame:
    """Return requested historical data without aggregation."""
    if not r:
        return pd.DataFrame()

    if end_time == '+':
        end_time = round(time.time() * 1000)

    if not keys:
        return pd.DataFrame()
    
    if config.USE_TIMESERIES:
        return await _query_timeseries_raw(keys, start_time, end_time)
    else:
        return await _query_sorted_set(keys, start_time, end_time)


async def _query_timeseries_raw(keys: list, start_time, end_time) -> pd.DataFrame:
    """Query TimeSeries without aggregation."""
    df = pd.DataFrame()
    min_length = float('inf')

    for i in range(len(keys)):
        try:
            response = r.execute_command('TS.RANGE', keys[i], start_time, end_time)
            data = [float(row[1]) for row in response]
            index = [row[0] for row in response]
            
            new_df = pd.DataFrame({keys[i]: data}, index=index)

            if len(data) < min_length:
                min_length = len(data)

            if df.empty:
                df = new_df
            else:
                df = pd.concat([df, new_df], axis=1)
        except Exception as e:
            print(f"[DB] Error querying {keys[i]}: {e}")

    if min_length != float('inf'):
        df = df.iloc[:min_length]

    return df


async def raw_query(key: str, start_time, end_time, aggregate_method='AVG', aggregate=1):
    """Get raw data from redis."""
    if not r:
        return []
    
    if config.USE_TIMESERIES:
        return r.execute_command('TS.RANGE', key, start_time, end_time, 
                                'AGGREGATION', aggregate_method, aggregate)
    else:
        results = r.zrangebyscore(f"ts:{key}", start_time, end_time)
        return [[int(item.split(b':')[0]), float(item.split(b':')[1])] for item in results]


async def latest_data(keys: List[str]) -> Dict[str, Any]:
    """Return a dictionary containing latest data of requested keys."""
    if not r:
        return {}
    
    result = {}
    
    if config.USE_TIMESERIES:
        try:
            data = r.execute_command('TS.GET', keys[0])
            result['timestamp'] = data[0]
            result[keys[0]] = float(data[1])
            
            for key in keys[1:]:
                result[key] = float(r.execute_command('TS.GET', key)[1])
        except Exception as e:
            print(f"[DB] Error getting latest data: {e}")
    else:
        # Use the latest hash
        latest = r.hgetall("latest")
        if latest:
            result['timestamp'] = int(latest.get(b'timestamp', 0))
            for key in keys:
                val = latest.get(key.encode(), b'0')
                result[key] = float(val)
    
    return result


def get_connection_status() -> bool:
    """Check if Redis is connected."""
    if not r:
        return False
    try:
        r.ping()
        return True
    except Exception:
        return False

