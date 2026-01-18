import os

# ==================== DEPLOYMENT MODE ====================
# Determines how the application runs:
# - "local": Full features (Redis Stack, Serial, DataGenerator/Replayer)
# - "cloud": Cloud-compatible mode (Convex, Upstash Redis, no serial)
DEPLOYMENT_MODE = os.getenv("DEPLOYMENT_MODE", "local")

# ==================== PATHS ====================
DATAFORMAT_PATH = os.getenv(
    "DATAFORMAT_PATH", 
    f'{os.getcwd()}/Data/sc1-data-format/format.json'
)

# ==================== SERVER SETTINGS ====================
HOST_PORT = int(os.getenv("PORT", 4001))  # Render uses PORT env var
HOST = os.getenv("HOST", "0.0.0.0")

# ==================== REDIS SETTINGS ====================
# Local mode: Redis Stack with TimeSeries module
# Cloud mode: Upstash Redis (standard Redis, no TimeSeries)
if DEPLOYMENT_MODE == "cloud":
    # Upstash Redis URL format: redis://default:password@host:port
    REDIS_URL = os.getenv("UPSTASH_REDIS_URL", "")
    REDIS_PORT = None  # URL contains port
    REDIS_DB = 0
    USE_TIMESERIES = False
else:
    REDIS_URL = os.getenv("REDIS_URL", "127.0.0.1")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    REDIS_DB = int(os.getenv("REDIS_DB", 0))
    USE_TIMESERIES = True

# ==================== CONVEX SETTINGS ====================
# Convex is used as the primary cloud database for real-time data
CONVEX_URL = os.getenv("CONVEX_URL", "")
CONVEX_DEPLOY_KEY = os.getenv("CONVEX_DEPLOY_KEY", "")

# ==================== DATA SOURCE SETTINGS ====================
# Which data sources are enabled
ENABLE_SERIAL = DEPLOYMENT_MODE == "local"  # Serial only works locally
ENABLE_UDP = DEPLOYMENT_MODE == "local"      # UDP only works locally
ENABLE_CONVEX = bool(CONVEX_URL)             # Convex works in both modes

# ==================== NETWORK SETTINGS (Local Mode) ====================
CAR_IP = os.getenv("CAR_IP", "192.168.1.15")
LOCAL_IP = os.getenv("LOCAL_IP", "127.0.0.1")
DATA_PORT = int(os.getenv("DATA_PORT", 4003))
UDP_PORT = int(os.getenv("UDP_PORT", 4003))

# ==================== LEGACY VPS SETTINGS ====================
VPS_URL = os.getenv("VPS_URL", "http://live.bsr-dev.org")

# ==================== RUNTIME DATA ====================
# Filled by the program at startup
FORMAT = dict()

# ==================== HELPER FUNCTIONS ====================
def is_cloud_mode():
    return DEPLOYMENT_MODE == "cloud"

def is_local_mode():
    return DEPLOYMENT_MODE == "local"

def print_config():
    """Print current configuration for debugging"""
    print(f"=== Chase Car Dashboard Configuration ===")
    print(f"Deployment Mode: {DEPLOYMENT_MODE}")
    print(f"Host: {HOST}:{HOST_PORT}")
    print(f"Redis TimeSeries: {'Enabled' if USE_TIMESERIES else 'Disabled'}")
    print(f"Serial Enabled: {ENABLE_SERIAL}")
    print(f"UDP Enabled: {ENABLE_UDP}")
    print(f"Convex Enabled: {ENABLE_CONVEX}")
    print(f"=========================================")
