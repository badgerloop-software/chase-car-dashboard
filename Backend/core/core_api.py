from fastapi import APIRouter, WebSocket
import serial.tools.list_ports
from . import comms
from pydantic import BaseModel
import asyncio

router = APIRouter()

@router.websocket("/single-values")
async def single_values_websocket(websocket: WebSocket):
    await websocket.accept()
    
    while True:
        try:
            # Wait for client request
            await websocket.receive_text()
            
            # Prepare data
            if comms.solar_car_connection['udp'] or comms.solar_car_connection['lte'] or comms.solar_car_connection['serial']:
                latest_data = comms.frontend_data.copy()
                latest_data['solar_car_connection'] = True
                latest_data['udp_status'] = comms.solar_car_connection['udp']
                latest_data['lte_status'] = comms.solar_car_connection['lte']
                latest_data['serial_status'] = comms.solar_car_connection['serial']
                latest_data['timestamps'] = f'{latest_data.get("tstamp_hr", 0):02d}:{latest_data.get("tstamp_mn", 0):02d}:' \
                                        f'{latest_data.get("tstamp_sc", 0):02d}.{latest_data.get("tstamp_ms", 0)}'
                format_data = {}
                for key in latest_data.keys():
                    format_data[key] = [latest_data[key]]
                json_data = {'response': format_data}
                await websocket.send_json(json_data)
            else:
                await websocket.send_json({'response': None})
        except Exception as e:
            print(f"WebSocket error: {e}")
            break

@router.get("/single-values")
async def single_values():
    if comms.solar_car_connection['udp'] or comms.solar_car_connection['lte'] or comms.solar_car_connection['serial']:
        latest_data = comms.frontend_data
        latest_data['solar_car_connection'] = True
        latest_data['udp_status'] = comms.solar_car_connection['udp']
        latest_data['lte_status'] = comms.solar_car_connection['lte']
        latest_data['serial_status'] = comms.solar_car_connection['serial']
        latest_data['timestamps'] = f'{latest_data["tstamp_hr"]:02d}:{latest_data["tstamp_mn"]:02d}:' \
                                    f'{latest_data["tstamp_sc"]:02d}.{latest_data["tstamp_ms"]}'
        format_data = {}
        for key in latest_data.keys():
            format_data[key] = [latest_data[key]]
        json_data = {'response': format_data}
        return json_data
    return {'response': None}


@router.get("/serial-info")
async def list_serial_ports():
    """return currently connected device and all available serial device"""
    ports = serial.tools.list_ports.comports()
    # Extract the device name from each port object
    return {'connected_device': {'device': comms.serial_port['device'], 'baud': comms.serial_port['baud']},
            'all_devices': [port.device for port in sorted(ports, key=lambda port: port.device)]
            }

class SerialDevice(BaseModel):
    device: str
    baud: int

@router.post("/connect-device")
async def dev_conn(serial_device: SerialDevice):
    """Connect to serial port, pass in empty device name for disconnect"""
    comms.serial_port['device'] = serial_device.device
    comms.serial_port['baud'] = serial_device.baud
