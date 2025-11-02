const fs = require('fs');
const readline = require('readline');
const dgram = require('dgram');
const { Buffer } = require('buffer');
const inquirer = require('inquirer');
const path = require('path');

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
let selectedFile = '';

async function selectCSVFile() {
    const rawDataDir = path.join(__dirname, '..', 'raw_data');
    
    try {
        // Read all files in the raw_data directory
        const files = fs.readdirSync(rawDataDir);
        
        // Filter for CSV files
        const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));
        
        if (csvFiles.length === 0) {
            console.log('No CSV files found in raw_data directory!');
            process.exit(1);
        }
        
        console.log('Chase Car Dashboard - Data Replayer');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Create choices for inquirer with file info
        const choices = [];
        for (const file of csvFiles) {
            const filePath = path.join(rawDataDir, file);
            const fileSize = getFileSize(filePath);
            const duration = await getDriveDuration(filePath);
            
            choices.push({
                name: `${file.padEnd(35)} │ ${fileSize.padEnd(10)} │ ${duration}`,
                value: file
            });
        }
        
        console.log('Use ↑↓ arrow keys to navigate, press Enter to select:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'csvFile',
                message: 'Select CSV file:',
                choices: choices,
                pageSize: 10,
                prefix: ''
            }
        ]);
        
        console.log('');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Selected: ${answer.csvFile}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        
        selectedFile = path.join(rawDataDir, answer.csvFile);
        return selectedFile;
        
    } catch (error) {
        console.error('Error reading raw_data directory:', error);
        process.exit(1);
    }
}

function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
        return `${fileSizeInMB} MB`;
    } catch (error) {
        return 'Unknown size';
    }
}

async function getDriveDuration(filePath) {
    try {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let firstTimestamp = null;
        let lastTimestamp = null;
        let lineCount = 0;

        for await (const line of rl) {
            if (lineCount === 0) {
                // Skip header line
                lineCount++;
                continue;
            }

            const values = line.split(',');
            if (values.length > 0 && values[0] && !isNaN(values[0])) {
                const timestamp = parseFloat(values[0]);
                
                if (firstTimestamp === null) {
                    firstTimestamp = timestamp;
                }
                lastTimestamp = timestamp;
            }
            lineCount++;
        }

        if (firstTimestamp !== null && lastTimestamp !== null) {
            const durationSeconds = (lastTimestamp - firstTimestamp) / 1000; // Convert from ms to seconds
            const hours = Math.floor(durationSeconds / 3600);
            const minutes = Math.floor((durationSeconds % 3600) / 60);
            
            if (hours > 0) {
                return `${hours}h ${minutes}m`;
            } else {
                return `${minutes}m`;
            }
        }
        
        return 'Unknown duration';
    } catch (error) {
        return 'Unknown duration';
    }
}

async function loadCSV(filePath) {
    console.log(`Loading CSV data from: ${path.basename(filePath)}...`);
    const fileStream = fs.createReadStream(filePath);
    
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
    
    const sendInterval = setInterval(() => {
        if (csvData.length === 0) return;
        
        const currentRow = csvData[currentIndex];
        const packet = createDataPacket(currentRow);
        
        client.send(packet, 0, packet.length, PORT, 'localhost', (err) => {
            if (err) {
                console.warn('Error sending UDP packet:', err);
            }
        });
        
        // Move to next row, loop back to start when done
        currentIndex++;

        // Log progress occasionally
        if (currentIndex % 100 === 0) {
        console.log(`Sent ${currentIndex} packets, timestamp: ${currentRow.Var1 || 'N/A'}`);
        }

        // Stop when finished
        if (currentIndex >= csvData.length) {
        console.log('All data packets sent. Stopping replay.');
        clearInterval(sendInterval);
        client.close();
        process.exit(0);
        } 

        
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
async function main() {
    try {
        let selectedFile;
        
        // Check if a filename was provided as command line argument
        const args = process.argv.slice(2);
        if (args.length > 0) {
            const providedFilename = args[0];
            const rawDataDir = path.join(__dirname, '..', 'raw_data');
            const fullPath = path.join(rawDataDir, providedFilename);
            
            // Check if the file exists
            if (fs.existsSync(fullPath) && providedFilename.toLowerCase().endsWith('.csv')) {
                selectedFile = fullPath;
                console.log('');
                console.log('Chase Car Dashboard - Data Replayer');
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`Using provided file: ${providedFilename}`);
                console.log(`File size: ${getFileSize(fullPath)}`);
                console.log(`Drive duration: ${await getDriveDuration(fullPath)}`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('');
            } else {
                console.error(`Error: File "${providedFilename}" not found in raw_data directory or is not a CSV file.`);
                console.log('Available CSV files:');
                const files = fs.readdirSync(rawDataDir);
                const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));
                csvFiles.forEach(file => console.log(`  - ${file}`));
                process.exit(1);
            }
        } else {
            // No filename provided, show the menu
            selectedFile = await selectCSVFile();
        }
        
        await loadCSV(selectedFile);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
