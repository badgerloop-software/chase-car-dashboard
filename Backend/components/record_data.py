from core import db
from fastapi import APIRouter, Response
import io
import config
router = APIRouter()

@router.get("/get-processed-data")
async def get_processed_data(start_time, end_time):
    all_keys = list(config.FORMAT.keys())
    all_keys.remove('tstamp_ms')
    all_keys.remove('tstamp_sc')
    all_keys.remove('tstamp_mn')
    all_keys.remove('tstamp_hr')
    all_keys.remove('tstamp_unix')

    result = await db.query_without_aggregation(all_keys, start_time, end_time)

    # see https://stackoverflow.com/a/63989481
    output = io.BytesIO()
    result.to_csv(output)

    csv_data = output.getvalue()

    return Response(
        content=csv_data,
        media_type="application/csv",
        headers={"Content-Disposition": f"attachment; filename=\"dashboard-data-{start_time}-{end_time}.csv\""}
    )
