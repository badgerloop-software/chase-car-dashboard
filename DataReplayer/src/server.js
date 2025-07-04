const fs = require('fs');
const readline = require('readline');
const dgram = require('dgram');
const { Buffer } = require('buffer');

// Load the data format and constants
const DATA_FORMAT = JSON.parse(fs.readFileSync('../Backend/Data/sc1-data-format/format.json', 'utf8'));
const PORT = 4003; // Same port as DataGenerator

// Calculate buffer size
let bytes = 0;
for (const property in DATA_FORMAT) {
    bytes += DATA_FORMAT[property][0];
}

const header = '<bsr>';
const footer = '</bsr>';
const bufferSize = bytes + header.length + footer.length;

// Create UDP socket
const client = dgram.createSocket('udp4');

let csvData = [];
let currentIndex = 0;

async function loadCSV() {
    console.log('Loading CSV data...');
    const fileStream = fs.createReadStream('raw_data/2024-4-7rawdata.csv');
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let headers = null;
    let lineCount = 0;

    for await (const line of rl) {
        if (lineCount === 0) {
            // First line contains headers
            headers = line.split(',');
            console.log('CSV Headers:', headers.slice(0, 10), '... (and more)');
        } else {
            // Parse data rows
            const values = line.split(',');
            const rowData = {};
            
            for (let i = 0; i < headers.length; i++) {
                const header = headers[i];
                const value = values[i];
                
                // Convert numeric values
                if (value && !isNaN(value) && value !== '') {
                    rowData[header] = parseFloat(value);
                } else {
                    rowData[header] = value;
                }
            }
            
            csvData.push(rowData);
        }
        
        lineCount++;
        if (lineCount % 1000 === 0) {
            console.log(`Loaded ${lineCount} lines...`);
        }
    }
    
    console.log(`CSV loaded: ${csvData.length} data rows`);
    startSending();
}

function createDataPacket(rowData) {
    const buf = Buffer.alloc(bufferSize, 0);
    let buffOffset = header.length;
    
    // Write header
    buf.write(header, 0);
    
    // Generate current timestamp for live graphing
    const now = new Date();
    const currentTimestamp = Math.floor(now.getTime());
    
    // Fill buffer with data according to format
    for (const property in DATA_FORMAT) {
        let value = rowData[property] || 0;
        
        switch (DATA_FORMAT[property][1]) {
            case "float":
                buf.writeFloatLE(parseFloat(value) || 0, buffOffset);
                break;
            case "char":
                buf.writeUInt8(Math.round(parseFloat(value) || 0), buffOffset);
                break;
            case "bool":
                buf.writeUInt8(value ? 1 : 0, buffOffset);
                break;
            case "uint8":
                // Override timestamp fields with current time
                if (property === "tstamp_hr") {
                    buf.writeUInt8(now.getHours(), buffOffset);
                } else if (property === "tstamp_mn") {
                    buf.writeUInt8(now.getMinutes(), buffOffset);
                } else if (property === "tstamp_sc") {
                    buf.writeUInt8(now.getSeconds(), buffOffset);
                } else {
                    buf.writeUInt8(Math.round(parseFloat(value) || 0), buffOffset);
                }
                break;
            case "uint16":
                // Override timestamp milliseconds with current time
                if (property === "tstamp_ms") {
                    buf.writeUInt16LE(now.getMilliseconds(), buffOffset);
                } else {
                    buf.writeUInt16LE(Math.round(parseFloat(value) || 0), buffOffset);
                }
                break;
            case "uint64":
                // Override Unix timestamp with current time
                if (property === "tstamp_unix") {
                    buf.writeBigUInt64LE(BigInt(currentTimestamp), buffOffset);
                } else {
                    buf.writeBigUInt64LE(BigInt(Math.round(parseFloat(value) || 0)), buffOffset);
                }
                break;
            default:
                buf.fill(parseFloat(value) || 0, buffOffset, buffOffset + DATA_FORMAT[property][0]);
                break;
        }
        
        buffOffset += DATA_FORMAT[property][0];
    }
    
    // Write footer
    buf.write(footer, buffOffset);
    
    return buf;
}

function startSending() {
    console.log('Starting to send data packets...');
    console.log(`Sending at ~31Hz (32ms intervals) to localhost:${PORT}`);
    
    setInterval(() => {
        if (csvData.length === 0) return;
        
        const currentRow = csvData[currentIndex];
        const packet = createDataPacket(currentRow);
        
        client.send(packet, 0, packet.length, PORT, 'localhost', (err) => {
            if (err) {
                console.warn('Error sending UDP packet:', err);
            }
        });
        
        // Move to next row, loop back to start when done
        currentIndex = (currentIndex + 1) % csvData.length;
        
        // Log progress occasionally
        if (currentIndex % 100 === 0) {
            console.log(`Sent ${currentIndex} packets, timestamp: ${currentRow.Var1 || 'N/A'}`);
        }
        
    }, 32); // 32ms = ~31Hz, same as DataGenerator
}

// Handle cleanup
process.on('SIGINT', () => {
    console.log('\nClosing UDP client...');
    client.close();
    process.exit(0);
});

// Start the process
loadCSV().catch(err => {
    console.error('Error loading CSV:', err);
});
