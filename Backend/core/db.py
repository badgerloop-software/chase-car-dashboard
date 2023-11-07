import time

import redis, config
import pandas as pd
from datetime import datetime

r = redis.StrictRedis(host=config.REDIS_URL, port=config.REDIS_PORT, db=config.REDIS_DB)

def insert_data(data_dict):
    # Get the timestamp from the dictionary
    timestamp = data_dict['tstamp_unix']
    # Remove timestamp-related keys from the data dictionary
    del data_dict['tstamp_hr']
    del data_dict['tstamp_mn']
    del data_dict['tstamp_sc']
    del data_dict['tstamp_ms']
    del data_dict['tstamp_unix']
    # Insert data into Redis time series database
    # print(timestamp.timestamp())
    for key in data_dict.keys():
        if not isinstance(data_dict[key], (bool, bytes)):
            r.execute_command('TS.ADD', key, timestamp, data_dict[key], 'ON_DUPLICATE', 'LAST')
        elif isinstance(data_dict[key], bool):
            # convert bool to 1 for true 0 for false
            r.execute_command('TS.ADD', key, timestamp, 1 if data_dict[key] else 0, 'ON_DUPLICATE', 'LAST')
        else:
            # convert char to its ascii number
            r.execute_command('TS.ADD', key, timestamp, ord(data_dict[key]), 'ON_DUPLICATE','LAST')


async def query(keys: list, start_time, end_time, aggregate_methods: list, aggregate=1) -> pd.DataFrame:
    """Return requested historical data in a pandas dataframe"""
    assert len(keys) == len(aggregate_methods), "Length of keys and aggregate_methods should be the same"

    # if end time is '+' record current time
    if end_time == '+':
        end_time = round(time.time()*1000)

    if keys:
        # Initialize an empty DataFrame
        df = pd.DataFrame()

        min_length = float('inf')  # Initialize min_length to positive infinity

        for i in range(len(keys)):
            # query the data
            response = r.execute_command('TS.RANGE', keys[i], start_time, end_time, 'AGGREGATION', aggregate_methods[i], aggregate)
            # parse data into array
            data = [float(row[1]) for row in response]
            index = [row[0] for row in response]
            column_name = keys[i]

            # Create a new DataFrame for the current key and concat it to the existing DataFrame
            new_df = pd.DataFrame({column_name: data}, index=index)

            if len(data) < min_length:
                min_length = len(data)  # Update min_length if a shorter array is found

            if df.empty:
                df = new_df
            else:
                df = pd.concat([df, new_df], axis=1)

        # Truncate the longer arrays to match the length of the shortest array
        df = df.iloc[:min_length]

        return df

async def query_without_aggregation(keys: list, start_time, end_time):
    """Return requested historical data in a pandas dataframe"""

    # if end time is '+' record current time
    if end_time == '+':
        end_time = round(time.time()*1000)

    if keys:
        # Initialize an empty DataFrame
        df = pd.DataFrame()

        min_length = float('inf')  # Initialize min_length to positive infinity

        for i in range(len(keys)):
            # query the data
            response = r.execute_command('TS.RANGE', keys[i], start_time, end_time)
            # parse data into array
            data = [float(row[1]) for row in response]
            index = [row[0] for row in response]
            column_name = keys[i]

            # Create a new DataFrame for the current key and concat it to the existing DataFrame
            new_df = pd.DataFrame({column_name: data}, index=index)

            if len(data) < min_length:
                min_length = len(data)  # Update min_length if a shorter array is found

            if df.empty:
                df = new_df
            else:
                df = pd.concat([df, new_df], axis=1)

        # Truncate the longer arrays to match the length of the shortest array
        df = df.iloc[:min_length]

        return df

async def raw_query(key: str, start_time, end_time, aggregate_method = 'AVG', aggregate = 1):
    """Get raw data from redis wrapper"""
    return r.execute_command('TS.RANGE', key, start_time, end_time, 'AGGREGATION', aggregate_method, aggregate)

async def latest_data(keys: []):
    """Return a dictionary containing latest data of requested keys"""
    result = {}
    data = r.execute_command('TS.GET', keys[0])
    # set the time value
    result['timestamp'] = data[0]
    result[keys[0]] = float(data[1])
    # set the rest of the values
    for key in keys[1:]:
        result[key] = float(r.execute_command('TS.GET', key)[1])
    return result
