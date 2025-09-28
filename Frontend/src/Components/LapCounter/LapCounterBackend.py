import asyncio
import websockets
import json
import time
# import serial  # For real GPS reading from a serial port
# import pynmea2  # For parsing NMEA sentences from GPS
from math import floor, isfinite
import os

# --- Configuration ---
# load file from a file (location.json) if available, otherwise fall back
#DEFAULT_START_FINISH_LINE = {
#    "p1": {"lat": 38.95660, "lon": -95.73810},
#    "p2": {"lat": 38.95660, "lon": -95.73770}
#}

CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'location.json')


try:
    with open(CONFIG_PATH, 'r') as f:
        START_FINISH_LINE = json.load(f)
        # basic validation
        if not isinstance(START_FINISH_LINE, dict) or 'p1' not in START_FINISH_LINE or 'p2' not in START_FINISH_LINE:
            print('location.json is malformed, using default start/finish line')
#            START_FINISH_LINE = DEFAULT_START_FINISH_LINE
except FileNotFoundError:
    print('location.json not found, using default start/finish line')
#    START_FINISH_LINE = DEFAULT_START_FINISH_LINE
#except Exception as e:
#    print('Failed to read location.json, using default. Error:', e)
#    START_FINISH_LINE = DEFAULT_START_FINISH_LINE

# --- Core Lap Counting Logic ---
class LapCounter:
    """
    Handles the logic for detecting when the start/finish line is crossed.
    """
    def __init__(self, line_coords):
        self.line = line_coords
        self.last_pos = None
        self.lap_count = 0
        self.lap_start_time = time.time()
        self.last_lap_time = None
        self.best_lap_time = float('inf')
        # timestamp of last confirmed crossing used for non-blocking debounce
        self.last_cross_time = 0

    def check_for_lap(self, current_pos):
        """
        Checks if the line segment from the last position to the current position
        intersects with the start/finish line.

        Returns lap data if a new lap is detected, otherwise None.
        """
        if self.last_pos is None:
            self.last_pos = current_pos
            return None

        # Basic line segment intersection algorithm
        p0 = self.last_pos
        p1 = current_pos
        p2 = self.line["p1"]
        p3 = self.line["p2"]

        s1_x = p1['lon'] - p0['lon']
        s1_y = p1['lat'] - p0['lat']
        s2_x = p3['lon'] - p2['lon']
        s2_y = p3['lat'] - p2['lat']

        s = (-s1_y * (p0['lon'] - p2['lon']) + s1_x * (p0['lat'] - p2['lat'])) / (-s2_x * s1_y + s1_x * s2_y)
        t = ( s2_x * (p0['lat'] - p2['lat']) - s2_y * (p0['lon'] - p2['lon'])) / (-s2_x * s1_y + s1_x * s2_y)

        self.last_pos = current_pos

        # Check if the intersection point is within both line segments
        if 0 < s < 1 and 0 < t < 1:
            # --- LAP DETECTED! ---
            current_time = time.time()
            debounce_seconds = 15
            # ignore if within debounce interval
            if current_time - self.last_cross_time < debounce_seconds:
                # update last_pos and ignore
                self.last_pos = current_pos
                return None

            # commit lap
            self.last_cross_time = current_time
            self.last_lap_time = current_time - self.lap_start_time
            self.lap_start_time = current_time
            self.lap_count += 1

            if self.last_lap_time is not None and self.last_lap_time < self.best_lap_time:
                self.best_lap_time = self.last_lap_time

            return {
                "lap_count": self.lap_count,
                "last_lap_time": self.last_lap_time,
                "best_lap_time": self.best_lap_time
            }

        return None

# --- GPS Data Simulation ---
async def simulate_gps_stream(lap_counter, websocket):
    """
    Simulates a car driving around the track.
    In a real scenario, this function would read from a serial port (for a USB GPS)
    or a network socket.
    """
    print("Starting GPS simulation...")
    # These points simulate a car approaching and crossing the finish line
    mock_gps_points = [
        {"lat": 38.95600, "lon": -95.73790}, # Approaching from south
        {"lat": 38.95640, "lon": -95.73790}, # Getting closer
        {"lat": 38.95680, "lon": -95.73790}, # Crossing the line!
        {"lat": 38.95720, "lon": -95.73790}, # Moving past
        {"lat": 38.95760, "lon": -95.73790}, # Further away
        # ... car goes around the track ...
    ]

    while True:
        for point in mock_gps_points:
            print(f"Processing point: Lat={point['lat']}, Lon={point['lon']}")
            lap_data = lap_counter.check_for_lap(point)

            if lap_data:
                print("=" * 20)
                print(f"LAP {lap_data['lap_count']} DETECTED!")
                print("=" * 20)
                # Normalize non-finite values to None so json is valid (no Infinity)
                for k in ('last_lap_time', 'best_lap_time'):
                    v = lap_data.get(k)
                    if v is None or not isfinite(v):
                        lap_data[k] = None

                # Send the data to the connected dashboard
                try:
                    await websocket.send(json.dumps(lap_data))
                except Exception as e:
                    # Client disconnected or send failed — stop simulation for this websocket
                    print('send failed, stopping simulation for client:', e)
                    return

            await asyncio.sleep(5) # Simulate time between GPS pings

# TODO: Uncomment and use this function for real GPS data reading during testing and actual deployment
"""
# --- Real GPS Data Handling ---
async def read_real_gps_stream(lap_counter, websocket):
    
    # Reads from a serial port, parses NMEA sentences, and checks for laps.
    # This replaces the simulation function.
    
    
    # !!! IMPORTANT !!!
    # Change this to the correct serial port for your GPS receiver.
    # On Windows, it will be something like 'COM3', 'COM4', etc.
    # On Linux, it will be like '/dev/ttyUSB0', '/dev/ttyACM0', etc.
    # On macOS, it's often '/dev/cu.usbmodemXXXX'
    SERIAL_PORT = '/dev/ttyUSB0' 
    # 9600 is a very common baud rate for GPS modules.
    BAUD_RATE = 9600

    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        print(f"Successfully connected to GPS on {SERIAL_PORT}")
    except serial.SerialException as e:
        print(f"Error: Could not open serial port {SERIAL_PORT}. {e}")
        print("Please check the port name, permissions, and physical connection.")
        return

    while True:
        try:
            # Read one line of data from the GPS
            line = ser.readline().decode('ascii', errors='replace')
            
            # We only care about the GPGGA sentence for position
            if line.startswith('$GPGGA'):
                try:
                    # Parse the NMEA sentence
                    msg = pynmea2.parse(line)

                    # Check if we have a valid GPS fix (latitude will be non-zero)
                    if hasattr(msg, 'latitude') and msg.latitude != 0.0:
                        current_pos = {"lat": msg.latitude, "lon": msg.longitude}
                        
                        lap_data = lap_counter.check_for_lap(current_pos)

                        if lap_data:
                            print("=" * 20)
                            print(f"LAP {lap_data['lap_count']} DETECTED!")
                            print(f"Time: {format_time(lap_data['last_lap_time'])}")
                            print(f"Best: {format_time(lap_data['best_lap_time'])}")
                            print("=" * 20)

                            # Normalize for valid JSON
                            for k in ('last_lap_time', 'best_lap_time'):
                                if not isfinite(lap_data.get(k, 0)):
                                    lap_data[k] = None
                            
                            await websocket.send(json.dumps(lap_data))

                except pynmea2.ParseError as e:
                    # This can happen if the data is corrupted, just ignore it
                    # print(f"Could not parse NMEA sentence: {e}")
                    pass
        except serial.SerialException:
            print("GPS device disconnected. Stopping stream.")
            break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            break
        
        # Give other asyncio tasks a chance to run
        await asyncio.sleep(0.01)
"""

def format_time(seconds):
    """Formats seconds into M:SS.ms"""
    if seconds is None:
        return "0:00.000"
    if seconds == float('inf'):
        return "0:00.000"
    minutes = floor(seconds / 60)
    rem_seconds = seconds % 60
    return f"{minutes}:{rem_seconds:06.3f}"


# --- WebSocket Server ---
async def server_handler(websocket, path):
    """
    Handles the WebSocket connection from the dashboard.
    """
    print("Dashboard connected!")
    lap_counter = LapCounter(START_FINISH_LINE)
    # Send an initial ready/hello message with current stats so clients know server is up
    try:
        init_msg = {
            "type": "ready",
            "lap_count": lap_counter.lap_count
        }
        await websocket.send(json.dumps(init_msg))
    except Exception:
        # ignore send failures during connect
        pass

    # ONE-OFF TEST SEND (development only): send a single lap JSON
    # immediately after the ready message so the frontend shows
    # non-zero values while testing. Remove this block after verification.
    try:
        test_msg = {
            'lap_count': 1,
            'last_lap_time': 72.345,   # 1:12.345
            'best_lap_time': 72.345,
        }
        await websocket.send(json.dumps(test_msg))
    except Exception:
        # ignore failures for the one-off test send
        pass

    # Start the simulation/data processing task
    await simulate_gps_stream(lap_counter, websocket)


# --- Main Entry Point ---
if __name__ == "__main__":
    # Start the WebSocket server on localhost, port 8765
    start_server = websockets.serve(server_handler, "localhost", 8765)
    print("WebSocket server started at ws://localhost:8765")
    print("Waiting for dashboard to connect...")
    # Run the server forever
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
