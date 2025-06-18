from fastapi import FastAPI
from core import core_api
from components import component_router
def register_route(app : FastAPI):
    app.include_router(core_api.router, tags=['Core'])
    app.include_router(component_router.router, prefix='/components', tags=['components'])