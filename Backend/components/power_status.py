from core import db

# array of data you want to query, '+' for latest data, '-' for earliest
from fastapi import APIRouter

router = APIRouter()


@router.get("/power_status")
async def power_status():
    data = await db.query(["motor_current", "pack_current", "mppt_current_out"], '-', '+', ['avg', 'avg', 'avg'])
    if data['mppt_current_out'].array[-1] > data['pack_current'].array[-1]:  # solar and battery( -1 means pop front )
        return 1 #Solar wattage is is charging battery and powering other systems
    if data['mppt_current_out'].array[-1] <= data['pack_current'].array[-1]:
        return 0 #Solar wattage is charging battery
