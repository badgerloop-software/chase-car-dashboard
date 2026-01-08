import uvicorn, config
import sys
from fastapi import FastAPI
from framework import router, process

app = FastAPI()

@app.on_event("startup")
async def startup():
    router.register_route(app)
    process.start_processes()

if __name__ == '__main__':
    uvicorn.run(app='main:app', host="0.0.0.0", port=config.HOST_PORT, log_level='critical')

    
