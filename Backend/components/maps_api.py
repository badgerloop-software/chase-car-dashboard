from core import db
from fastapi import APIRouter
import time
import numpy as np

router = APIRouter()

@router.get("/maps")
async def get_maps(data: str, duration: int = 60):
    """pass in a datafield to get and return the coordinates with the value of the data of each timestamp"""
    if not data:
        return {"coords": [], "data": []}
    
    end_time = int(time.time()*1000)
    start_time = end_time - duration*1000
    
    all_data = await db.query_without_aggregation(["lat", "lon", data], start_time, end_time)
    
    # Filter out rows with lat or lon equal to -1000, -1001, or 0
    all_data = all_data[~((all_data['lat'] == -1000) | 
                          (all_data['lat'] == -1001) | 
                          (all_data['lat'] == 0) | 
                          (all_data['lon'] == -1000) | 
                          (all_data['lon'] == -1001) | 
                          (all_data['lon'] == 0))]
    all_data = all_data.drop_duplicates()

    return {
        "coords": [{"lat": d["lat"], "lng": d["lon"]} for _, d in all_data.iterrows()],
        "data": [d[data] for _, d in all_data.iterrows()]
    }
