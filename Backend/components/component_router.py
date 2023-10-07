from fastapi import APIRouter

from . import driving_stats
from . import foo

router = APIRouter()
router.include_router(foo.router)
router.include_router(driving_stats.router)
