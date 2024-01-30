from core import db, comms
from fastapi import APIRouter, Response
import pandas as pd
import io

router = APIRouter()

@router.get("/get-processed-data")
async def get_processed_data(start_time, end_time):
    all_keys = list(comms.frontend_data.keys())
    all_keys.remove('tstamp_ms')
    all_keys.remove('tstamp_sc')
    all_keys.remove('tstamp_mn')
    all_keys.remove('tstamp_hr')
    all_keys.remove('tstamp_unix')

    result = await db.query_without_aggregation(all_keys, start_time, end_time)

    result.index = pd.to_datetime(result.index, unit='ms')

    # see https://stackoverflow.com/a/63989481
    output = io.BytesIO()
    writer = pd.ExcelWriter(output, engine='xlsxwriter', datetime_format='MM-DD HH:MM:SS')
    result.to_excel(writer, sheet_name='Sheet1')

    writer.close()
    xlsx_data = output.getvalue()


    return Response(
        content=xlsx_data,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=\"download.xlsx\""})