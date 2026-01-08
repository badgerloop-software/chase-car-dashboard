# DataGenerator

The DataGenerator simulates live solar car telemetry data by generating realistic sensor readings and GPS coordinates, then transmitting them via UDP packets to the backend dashboard system.

## Features

- **Realistic Data Simulation**: Generates mathematically varied sensor readings using sine wave functions
- **GPS Route Simulation**: Cycles through real GPS coordinates from `gps_dataset/dataset1.csv`
- **Real-time Timestamps**: Automatically generates current timestamps for live dashboard compatibility
- **UDP Transmission**: Sends data packets at 31Hz (32ms intervals) to match real telemetry rates
- **Binary Protocol**: Uses the same binary format as live car data (`<bsr>` header/footer)
- **Comprehensive Sensors**: Simulates all solar car systems (battery, motor, GPS, temperatures, etc.)

## Data Sources

### GPS Dataset
- **File**: `gps_dataset/dataset1.csv` (21,435 coordinate points)
- **Format**: CSV with columns: `time`, `latitude`, `longitude`, `elevation`
- **Coverage**: Real GPS route data for realistic car movement simulation
- **Cycling**: Automatically loops through coordinates when reaching the end

### Sensor Simulation
- **Algorithm**: Mathematical sine wave generation for realistic sensor variation
- **Scope**: All fields defined in `../../Backend/Data/sc1-data-format/format.json`
- **Timestamps**: Live system time (hour, minute, second, millisecond, Unix timestamp)

## Usage

1. Ensure GPS dataset is available in `gps_dataset/dataset1.csv`
2. Navigate to the DataGenerator directory and run:
   ```bash
   cd DataGenerator
   npm install
   npm start
   ```
3. The generator will:
   - Build the project using Babel
   - Start generating and sending UDP packets to `localhost:4003`
   - Cycle through GPS coordinates continuously
   - Generate varied sensor readings in real-time

## Installation

Install the required dependencies:
```bash
npm install
```

### Dependencies
- **luxon**: Date/time manipulation for accurate timestamps
- **express**: Web framework (used for potential future HTTP endpoints)

### Development Dependencies
- **@babel/cli**: Command-line interface for Babel transpilation
- **@babel/core**: Core Babel functionality
- **@babel/preset-env**: Smart preset for modern JavaScript features

## Data Flow

```
GPS Dataset + Sensor Simulation → Binary Buffer → UDP Packet → Backend (port 4003)
```

The generator:
1. Loads GPS coordinates from the CSV dataset
2. Generates sensor readings using mathematical functions
3. Applies current timestamps to all time-related fields
4. Packs data into binary format matching the solar car protocol
5. Transmits UDP packets at 31Hz to simulate real telemetry

## Binary Protocol

The DataGenerator follows the exact binary format used by the actual solar car:

- **Header**: `<bsr>` (5 bytes)
- **Data**: Binary encoded according to field types defined in the format specification
- **Footer**: `</bsr>` (6 bytes)

### Supported Data Types
- `float`: 32-bit floating point (Little Endian)
- `uint8`: 8-bit unsigned integer
- `uint16`: 16-bit unsigned integer (Little Endian)
- `uint64`: 64-bit unsigned integer (Little Endian)
- `char`: 8-bit character
- `bool`: Boolean (0 or 1)

## Special Field Handling

### GPS Coordinates
- `lat`: Latitude from GPS dataset
- `lon`: Longitude from GPS dataset  
- `elev`: Elevation from GPS dataset

### Timestamps
- `tstamp_hr`: Current hour (0-23)
- `tstamp_mn`: Current minute (0-59)
- `tstamp_sc`: Current second (0-59)
- `tstamp_ms`: Current millisecond (0-999)
- `tstamp_unix`: Current Unix timestamp

### Sensor Values
All other fields are generated using `Math.abs(Math.sin(nextValue)) * 100` to create realistic, continuously varying sensor readings.

## Build Process

The project uses Babel to transpile modern JavaScript:
1. Source code in `src/` is transpiled to `dist/`
2. Node.js executes the transpiled code from `dist/server.js`
3. Babel configuration in `.babelrc` targets current Node.js version

## Architecture

### Core Components
- **server.js**: Main UDP server and data generation logic
- **car.js**: Car simulation class (future expansion capability)
- **constants.json**: Configuration constants (port numbers, etc.)

### Data Format Integration
- Reads format specification from `../../Backend/Data/sc1-data-format/format.json`
- Dynamically calculates buffer sizes based on data types
- Ensures perfect compatibility with backend data parsing

## Development

### Adding New Sensors
1. Update the format specification in the backend
2. Add special handling in `server.js` if needed
3. The generator will automatically include new fields

### Modifying GPS Routes
1. Replace `gps_dataset/dataset1.csv` with new GPS data
2. Ensure CSV format: `time,latitude,longitude,elevation`
3. Update `dataset1.json` if using JSON format instead

## Stopping

Press `Ctrl+C` to gracefully stop the data generator.