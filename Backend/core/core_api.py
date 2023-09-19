from fastapi import APIRouter
from . import comms
router = APIRouter()

@router.get("/single-values")
async def single_values():
    print(comms.solar_car_connection)
    if comms.solar_car_connection:
        latest_data = comms.frontend_data
        latest_data['solar_car_connection'] = True
        latest_data['timestamps'] = f'{latest_data["tstamp_hr"]:02d}:{latest_data["tstamp_mn"]:02d}:' \
                                    f'{latest_data["tstamp_sc"]:02d}.{latest_data["tstamp_ms"]}'
        format_data = {}
        for key in latest_data.keys():
            format_data[key] = [latest_data[key]]
        json_data = {'response': format_data}
        return json_data
    return {'response': None}
