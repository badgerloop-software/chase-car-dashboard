from fastapi import APIRouter
from core import db
import config
from statsmodels.tsa.arima.model import ARIMA
from pmdarima.arima import auto_arima
import pandas as pd
import time
import asyncio
from concurrent.futures import ProcessPoolExecutor

router = APIRouter()

def train_arima(df, forcast_time):
    # Train the model
    model = auto_arima(df, seasonal=False, m=12)
    # Forecast the future data
    forecast = model.predict(n_periods=forcast_time)
    return forecast

@router.get("/forecast")
async def get_forecast(data: str, start_time: int = 0, end_time: int = 0, forecast_time: int = 0):
    '''Using ARIMA to predict the future data on selected dataset
    :param data: str: dataset name
    :param start_time: int: start time of the training data
    :param end_time: int: end time of the training data
    :param forecast_time: int: the time to forecast
    '''
    # If time is not specified, use current time as end time and 5 min ago as start time for forecast 1 min
    if end_time == 0:
        end_time = round(time.time() * 1000)
    if start_time == 0:
        start_time = end_time - 300000
    if forecast_time == 0:
        forecast_time = 100

    # Query the data
    df = await db.query([data], start_time, end_time, ['avg'], (end_time - start_time) // 60)

    # Spawn a new async task to train ARIMA in a separate process
    loop = asyncio.get_event_loop()
    with ProcessPoolExecutor() as pool:
        future = loop.run_in_executor(pool, train_arima, df[data], forecast_time)
        forecast = await future

    # relabel the index to start from 1 to length
    forecast.reset_index(drop=True, inplace=True)
    forecast.index = (forecast.index * (end_time - start_time) // 60) + end_time
    print(forecast)
    return forecast
