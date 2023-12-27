import os

DATAFORMAT_PATH = f'{os.getcwd()}/Data/sc1-data-format/format.json'
HOST_PORT = 4001

# Check if system is running in a docker container
DOCKER = os.environ.get('DOCKER', False)

REDIS_URL = 'redis-stack-server' if DOCKER else '127.0.0.1'
REDIS_PORT = 6379
REDIS_DB = 0

CAR_IP = '127.0.0.1'
LOCAL_IP = 'localhost'
DATA_PORT = 4003

VPS_URL = 'http://150.136.104.125:3000'

#Filled by the program
FORMAT = dict()
