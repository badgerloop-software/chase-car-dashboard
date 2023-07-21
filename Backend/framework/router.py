from fastapi import FastAPI
from core import core_api
def register_route(app : FastAPI):
    app.include_router(core_api.router, tags=['Core'])