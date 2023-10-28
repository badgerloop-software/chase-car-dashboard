import time
import io
from fastapi import APIRouter, Response
import pandas as pd
from . import comms
from . import db
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

@router.get("/get-processed-data")
async def get_processed_data(start_time, end_time):
    all_keys = list(comms.frontend_data.keys())
    all_keys.remove('tstamp_ms')
    all_keys.remove('tstamp_sc')
    all_keys.remove('tstamp_mn')
    all_keys.remove('tstamp_hr')

    result = await db.query_without_aggregation(all_keys, start_time, end_time)

    # see https://stackoverflow.com/a/63989481
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter')
    result.to_excel(writer, sheet_name='Sheet1')

    writer.close()
    xlsx_data = output.getvalue()


    return Response(
        content=xlsx_data, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        headers={"Content-Disposition": "attachment; filename=\"download.xlsx\""})