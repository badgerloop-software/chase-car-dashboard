import threading
import asyncio
from core import comms
from core.data_sources.manager import DataSourceManager

def start_processes():
    """Legacy startup - starts data sources via the new manager"""
    manager = DataSourceManager()
    
    # Run the async start in a new event loop in a separate thread
    def run_async_manager():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(manager.start_all())
            # Keep the loop running for any async data sources
            loop.run_forever()
        except Exception as e:
            print(f"Data source manager error: {e}")
        finally:
            loop.close()
    
    t = threading.Thread(target=run_async_manager)
    t.daemon = True
    t.start()

async def start_processes_async():
    """Async startup for use with FastAPI lifespan"""
    manager = DataSourceManager()
    await manager.start_all()
    return manager

async def stop_processes_async(manager: DataSourceManager):
    """Async shutdown for use with FastAPI lifespan"""
    await manager.stop_all()