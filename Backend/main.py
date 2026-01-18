import uvicorn, config
import sys
import threading
from contextlib import asynccontextmanager
from fastapi import FastAPI
from framework import router
from core.data_sources.manager import DataSourceManager

# Global reference to data source manager for shutdown
_data_source_manager: DataSourceManager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _data_source_manager
    
    # Startup
    print("Starting up backend...")
    print(f"Deployment mode: {config.DEPLOYMENT_MODE}")
    print(f"Redis TimeSeries: {'enabled' if config.USE_TIMESERIES else 'disabled (using sorted sets)'}")
    
    router.register_route(app)
    
    # Start data sources using the new manager
    _data_source_manager = DataSourceManager()
    
    # Start data sources in a background thread (since they use blocking I/O)
    def start_sources():
        _data_source_manager.start()
    
    t = threading.Thread(target=start_sources, daemon=True)
    t.start()
    
    print("Backend ready!")
    yield
    
    # Shutdown
    print("Shutting down backend...")
    if _data_source_manager:
        _data_source_manager.stop()
    print("Backend stopped.")

app = FastAPI(lifespan=lifespan)

if __name__ == '__main__':
    print(f"Starting server on port {config.HOST_PORT}...")
    uvicorn.run(app='main:app', host="0.0.0.0", port=config.HOST_PORT, log_level='info')
