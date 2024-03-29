from fastapi import APIRouter
from . import graph_api, record_data

router = APIRouter()

router.include_router(graph_api.router)
router.include_router(record_data.router)