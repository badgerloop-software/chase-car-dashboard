import redis, config
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

async def query(key, start_time, end_time, aggregate = 1, aggregate_method = 'AVG'):
    return r.execute_command('TS.RANGE', key, start_time, end_time, 'AGGREGATION', aggregate_method, aggregate)