from core import db
from fastapi import APIRouter

router = APIRouter()

@router.get("/graph")
async def get_graph(data: str, start_time: int, end_time: int):
    """pass in a comma separated list of data that the frontend requests start_time end_time must be in unix millisec"""
    data = [d.strip() for d in data.split(',')]
    query_result = await db.query(data, start_time, end_time, ['avg']*len(data), (end_time-start_time)//5000 or 1)
    result = {"timestamp": query_result.index.to_list()}
    for d in data:
        result[d] = query_result[d].to_list()
    return result
