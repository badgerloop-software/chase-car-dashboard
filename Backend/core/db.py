import redis, config
import pandas as pd
from datetime import datetime

r = redis.StrictRedis(host=config.REDIS_URL, port=config.REDIS_PORT, db=config.REDIS_DB)

def insert_data(data_dict):
    # Get the timestamp from the dictionary
    timestamp = datetime.utcnow().replace(
        hour=(data_dict['tstamp_hr'] + 6) % 24,
        minute=data_dict['tstamp_mn'],
        second=data_dict['tstamp_sc'],
        microsecond=data_dict['tstamp_ms']
    )
    # Remove timestamp-related keys from the data dictionary
    del data_dict['tstamp_hr']
    del data_dict['tstamp_mn']
    del data_dict['tstamp_sc']
    del data_dict['tstamp_ms']
    # Insert data into Redis time series database
    # print(timestamp.timestamp())
    for key in data_dict.keys():
        if not isinstance(data_dict[key], (bool, bytes)):
            r.execute_command('TS.ADD', key, int(timestamp.timestamp()*1000), data_dict[key], 'ON_DUPLICATE', 'LAST')
        elif isinstance(data_dict[key], bool):
            # convert bool to 1 for true 0 for false
            r.execute_command('TS.ADD', key, int(timestamp.timestamp()*1000), 1 if data_dict[key] else 0, 'ON_DUPLICATE', 'LAST')
        else:
            # convert char to its ascii number
            r.execute_command('TS.ADD', key, int(timestamp.timestamp()*1000), ord(data_dict[key]), 'ON_DUPLICATE','LAST')

async def query(keys: list, start_time, end_time, aggregate_methods: list, aggregate=1):
    """Return requested historical data in a pandas dataframe"""
    assert len(keys) == len(aggregate_methods), "Length of keys and aggregate_methods should be the same"

    if keys:
        # Initialize an empty DataFrame
        df = pd.DataFrame()

        min_length = float('inf')  # Initialize min_length to positive infinity

        for i in range(len(keys)):
            response = r.execute_command('TS.RANGE', keys[i], start_time, end_time, 'AGGREGATION', aggregate_methods[i], aggregate)
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

async def single_query(key: str, start_time, end_time, aggregate_method = 'AVG', aggregate = 1):
    return r.execute_command('TS.RANGE', key, start_time, end_time, 'AGGREGATION', aggregate_method, aggregate)