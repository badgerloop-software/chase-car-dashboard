from fastapi import APIRouter
from . import graph_api, record_data, forcast

router = APIRouter()

router.include_router(graph_api.router)
router.include_router(record_data.router)
router.include_router(forcast.router)