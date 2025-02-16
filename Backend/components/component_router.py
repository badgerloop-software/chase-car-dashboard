from fastapi import APIRouter
from . import graph_api, record_data, maps_api

router = APIRouter()

router.include_router(graph_api.router)
router.include_router(record_data.router)
router.include_router(maps_api.router)