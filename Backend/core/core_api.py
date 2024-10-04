from fastapi import APIRouter, WebSocket
from . import comms
router = APIRouter()

@router.websocket("/single-values")
async def single_values(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            # wait for client to request more data to be send
            message_from_client = await websocket.receive_text()
            
            if comms.solar_car_connection['udp'] or comms.solar_car_connection['lte']:
                latest_data = comms.frontend_data
                latest_data['solar_car_connection'] = True
                latest_data['udp_status'] = comms.solar_car_connection['udp']
                latest_data['lte_status'] = comms.solar_car_connection['lte']
                latest_data['timestamps'] = f'{latest_data["tstamp_hr"]:02d}:{latest_data["tstamp_mn"]:02d}:' \
                                            f'{latest_data["tstamp_sc"]:02d}.{latest_data["tstamp_ms"]}'
                format_data = {}
                for key in latest_data.keys():
                    format_data[key] = [latest_data[key]]
                json_data = {'response': format_data}
                await websocket.send_json(json_data)
            else:
                await websocket.send_json({'response': None})
    except Exception as e:
        await websocket.send_json({'error': 'Error fetching data'})
    finally:
        await websocket.close()