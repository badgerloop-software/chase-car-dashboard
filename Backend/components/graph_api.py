from core import db
from fastapi import APIRouter, WebSocket
import numpy as np
import config
import json
import traceback

router = APIRouter()

@router.websocket("/graph")
async def get_graph(websocket: WebSocket):
    await websocket.accept()
    
    while True:
        # wait for client to request more data to be send
        message_from_client = await websocket.receive_text()
        message_from_client = json.loads(message_from_client)

        start_time = message_from_client['start_time']
        end_time = message_from_client['end_time']
        data = message_from_client.get("querylist")
        
        """pass in a comma separated list of data that the frontend requests. start_time and end_time must be in unix milliseconds"""
        if not data:
            # use a query to get timestamp
            query_result = await db.query(['speed'], start_time, end_time, ['avg'],
                                        (end_time - start_time) // 60 or 1)
            await websocket.send_json({'response': {"timestamps": query_result.index.to_list()}})
            continue
        data = [d.strip() for d in data.split(',')]
        # sort the data into smaller group by aggregation methods
        group = {'avg': [], 'first':[], 'last':[], 'max': [], 'min':[], 'no-aggr':[], 'sum': []}
        for d in data:
            if d in config.FORMAT:
                group['no-aggr'].append(d) if config.FORMAT[d]['type']=='bool' else group['avg'].append(d)
            # TODO change this to actual aggregation specified in data format
        result = dict()
        for key in group:
            if group[key]:
                #query the database for each aggregation method
                query_result = {}
                if key != 'no-aggr':
                    query_result = await db.query(group[key], start_time, end_time, [key]*len(group[key]), (end_time-start_time)//60 or 1)
                else:
                    query_result = await db.query_without_aggregation(group[key], start_time, end_time)
                time_stamp = query_result.index.to_list()
                # add the tuples to the json
                for name in group[key]:
                    result[name] = []
                    data_arr = query_result[name].to_list()
                    if key == 'no-aggr': # TODO Replace 'no-aggr' with min-max key
                        prev_y = -100
                        prev_y_count = 1
                        for i in range(len(data_arr)):
                            # only include the start and end time of a period of same data
                            if data_arr[i] != prev_y:
                                if prev_y_count > 1:
                                    result[name].append({'x': time_stamp[i-1], 'y': data_arr[i-1]})
                                result[name].append({'x': time_stamp[i], 'y': data_arr[i]})
                                prev_y = data_arr[i]
                                prev_y_count = 1
                            elif i == len(data_arr)-1:
                                result[name].append({'x': time_stamp[i], 'y': data_arr[i]})
                            else:
                                prev_y_count += 1
                    else:
                        result[name] = [{'x': time_stamp[i], 'y': data_arr[i]} for i in range(len(data_arr))]
        await websocket.send_json({'response': result})

