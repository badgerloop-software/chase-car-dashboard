# DataReplayer

The DataReplayer reads recorded CSV data and replays it by sending UDP packets to simulate live car data, similar to the DataGenerator.

## Features

- Loads CSV data from `raw_data/2024-4-7rawdata.csv`
- Parses CSV headers and maps them to the solar car data format
- **Generates current timestamps** for live graphing compatibility
- Sends data packets via UDP at 31Hz (32ms intervals) to match real-time telemetry
- Automatically loops through the dataset when it reaches the end
- Uses the same binary format as the DataGenerator (`<bsr>` header/footer)

## Usage

1. Make sure you have the CSV file in `raw_data/2024-4-7rawdata.csv`
2. Navigate to the DataReplayer directory and run:
   ```bash
   cd DataReplayer
   npm start
   ```
3. The replayer will:
   - Load all CSV data into memory
   - Start sending UDP packets to `localhost:4003`
   - Display progress updates every 100 packets

## Installation

No additional dependencies are needed since the DataReplayer uses only Node.js built-in modules:
- `fs` - File system operations
- `readline` - CSV parsing
- `dgram` - UDP socket communication
- `buffer` - Binary data handling

## Data Flow

```
CSV File → Parse → Binary Buffer → UDP Packet → Backend (port 4003)
```

The replayer:
- Reads the CSV headers and maps them to the solar car data format
- **Replaces old timestamps with current time** to enable live graphing
- Converts each row to a binary buffer using the same format as DataGenerator
- Sends packets at the same rate as live telemetry (31Hz)
- Loops through the dataset continuously

## Timestamp Handling

The DataReplayer automatically replaces timestamp fields from the CSV with current timestamps:
- `tstamp_hr`, `tstamp_mn`, `tstamp_sc` → Current hour, minute, second
- `tstamp_ms` → Current milliseconds
- `tstamp_unix` → Current Unix timestamp

This ensures the frontend's live graphing feature works correctly, as it expects "now" timestamps rather than historical ones from 2024.

## Data Format

The binary packets follow the format defined in `../../Backend/Data/sc1-data-format/format.json`:
- Header: `<bsr>`
- Data: Binary encoded according to field types (float, uint8, etc.)
- Footer: `</bsr>`

## Stopping

Press `Ctrl+C` to gracefully stop the replayer.