from core import db
from fastapi import APIRouter
import time
import numpy as np
import config
import asyncio
import pandas as pd

router = APIRouter()


def hsv_to_rgb(hsv):
    h, s, v = hsv
    i = int(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    switch = {
        0: (v, t, p),
        1: (q, v, p),
        2: (p, v, t),
        3: (p, q, v),
        4: (t, p, v),
        5: (v, p, q)
    }
    r, g, b = switch[i % 6]
    return "#{:02x}{:02x}{:02x}".format(int(r * 255), int(g * 255), int(b * 255))

async def calculate_color(data_name, value):
    # Calculate the color value for each segment of the polyline using the value range from dataformat
    min_val = config.FORMAT[data_name]["min"]
    max_val = config.FORMAT[data_name]["max"]
    
    if max_val - min_val == 0:
        if config.FORMAT[data_name]["type"] == bool:
            return [hsv_to_rgb((val * 0.375, 1, 1)) for val in value]
        else:
            return ["#aaaaaa"] * (len(value)-1)
    colors = []
    for i in range(len(value) - 1):
        mean = (value[i] + value[i + 1]) / 2
        # Calculate percentage within the value range
        percentage = max(min((mean - min_val) / (max_val - min_val), 1), 0)
        # Map to HSV from 0 to 120 for transition from green to red
        colors.append(hsv_to_rgb((percentage * 0.375, 1, 1)))
    return colors

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

    all_data.index = pd.to_datetime(all_data.index, unit='ms')
    sample_freq = duration * 5 # get 100 samples max
    all_data = all_data.resample(f"{sample_freq}ms").mean().dropna()
    color = await calculate_color(data, list(all_data[data]))

    return {
        "coords": [{"lat": d["lat"], "lng": d["lon"]} for _, d in all_data.iterrows()],
        "color": color
    }
