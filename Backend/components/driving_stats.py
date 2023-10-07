import time

from fastapi import APIRouter

from core import db

router = APIRouter()

last_call_time = 0
current_call_time = time.time() * 1000


async def odometer():
    total_distance = 0
    data = await db.query(['speed'], '-', '+', ['avg'])
    data3 = data['speed'].array
    tstamp3 = data.index
    for i in range(0, (len(data3) - 1)):
        total_distance = total_distance + data3[i] * ((tstamp3[i + 1] - tstamp3[i])/1000)/3600
    return total_distance


async def total_energy_use():
    # TODO
    power_sum = 0
    power_sum2 = 0
    data = await db.query(['pack_power'], '-', '+', ['avg'])
    tstamp = data.index

    data1 = data['pack_power'].array
    # return data1
    for i in range(0, len(data1) - 1):
        power_sum = power_sum + data1[i] * ((tstamp[i + 1] - tstamp[i]) / 1000)
    return power_sum


async def avg_speed():
    data = await db.query(['speed'], '-', '+', ['avg'])
    total_speed = 0
    data1 = data['speed'].array
    tstamp = data.index
    time_spent = tstamp[len(tstamp) -1] - tstamp[0]
    total_distance = await odometer()
    avg_speed = total_distance/time_spent
    return avg_speed


async def avg_power_consumption():
    data = await db.query(['pack_power'], '-', '+', ['avg'])
    total_power = await total_energy_use()
    tstamp = data.index
    time_spent = tstamp[len(tstamp) -1] - tstamp[0]
    avg_power = total_power/time_spent
    return avg_power


@router.get("/driving_stats")
async def driving_stats():
    return {'odometer': await odometer(), 'total_energy': await total_energy_use(), 'avg_speed': await avg_speed(), 'avg_power': await avg_power_consumption()}
