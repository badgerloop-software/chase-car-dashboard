# DataReplayer

The DataReplayer reads recorded CSV data and replays it by sending UDP packets to simulate live car data, similar to the DataGenerator.

## Features

- **Interactive CSV file selection** with file size and drive duration information
- **Command-line support** for quick file selection
- **Drive duration analysis** - automatically calculates drive time from timestamps
- Parses CSV headers and maps them to the solar car data format
- **Generates current timestamps** for live graphing compatibility
- Sends data packets via UDP at 31Hz (32ms intervals) to match real-time telemetry
- Automatically loops through the dataset when it reaches the end
- Uses the same binary format as the DataGenerator (`<bsr>` header/footer)

## Usage

### Interactive Mode (with menu)
Navigate to the DataReplayer directory and run:
```bash
cd DataReplayer
npm start
```

This will show an interactive menu with:
- All available CSV files in the `raw_data` directory
- File sizes (in MB)
- Drive durations (calculated from timestamps)
- Arrow key navigation for selection

Example menu:
```
Data Replayer
=====================================
Select a CSV file to replay:

? Choose CSV file: (Use arrow keys)
❯ 2024-4-7rawdata.csv (71.28 MB, 4h 15m) 
  coasts2024-04-141530.csv (21.54 MB, 23m)
```

### Command-line Mode (skip menu)
For quick access when you know the filename:
```bash
npm start filename.csv
npm start coasts2024-04-141530.csv
```

This will:
- Skip the interactive menu
- Show file information (size and duration)
- Start replaying immediately

### Getting Help
```bash
npm run help
```

## Installation

Install dependencies:
```bash
npm install
```

Required dependencies:
- `inquirer` - Interactive CLI menus
- Node.js built-in modules: `fs`, `readline`, `dgram`, `buffer`

## Data Flow

```
CSV File → Parse → Binary Buffer → UDP Packet → Backend (port 4003)
```

The replayer:
- **Analyzes CSV files** to determine drive duration and file size
- Reads the CSV headers and maps them to the solar car data format
- **Replaces old timestamps with current time** to enable live graphing
- Converts each row to a binary buffer using the same format as DataGenerator
- Sends packets at the same rate as live telemetry (31Hz)
- Loops through the dataset continuously

## Drive Duration Analysis

The DataReplayer automatically calculates drive duration by:
1. Reading the first timestamp from the `Var1` column (first data row)
2. Reading the last timestamp from the `Var1` column (last data row)
3. Computing the difference and converting to hours and minutes
4. Displaying in format: `4h 15m` or `23m` (if less than 1 hour)

This helps you understand the scope of each dataset before selecting it for replay.

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