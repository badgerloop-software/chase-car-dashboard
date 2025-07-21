import uvicorn, config
import sys
import os
# Add workspace root and race-profile to sys.path
workspace_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
race_profile_dir = os.path.join(workspace_root, 'race-profile')
sys.path.insert(0, workspace_root)
sys.path.insert(0, race_profile_dir)
from fastapi import FastAPI
from framework import router, process
import importlib.util

# Load race-profile main.py directly
race_profile_path = os.path.join(race_profile_dir, 'main.py')
spec = importlib.util.spec_from_file_location("race_profile_main", race_profile_path)
race_profile_main = importlib.util.module_from_spec(spec)
spec.loader.exec_module(race_profile_main)

app = FastAPI()

@app.on_event("startup")
async def startup():
    router.register_route(app)
    process.start_processes()
    race_profile_main.startup_event()

@app.on_event("shutdown")
async def shutdown():
    race_profile_main.shutdown_event()

@app.get("/strategy")
async def strategy_results():
    """Expose race-profile simulation results via Backend."""
    return {
        "results": race_profile_main.api_results,
        "matlab_ready": race_profile_main.plugin.eng is not None
    }

if __name__ == '__main__':
    uvicorn.run(app='main:app', host="0.0.0.0", port=config.HOST_PORT)


