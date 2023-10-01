from fastapi import APIRouter
from . import power_status
router = APIRouter()

router.include_router(power_status.router)