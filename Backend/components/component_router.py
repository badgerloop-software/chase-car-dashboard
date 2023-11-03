from fastapi import APIRouter
from . import graph_api

router = APIRouter()

router.include_router(graph_api.router)