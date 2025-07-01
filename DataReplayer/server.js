const fs = require('fs');
const readline = require('readline');

async function processCSV() {
    const fileStream = fs.createReadStream('../raw_data/2024-4-7rawdata.csv');
    
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    // Process each line
    for await (const line of rl) {
        // Print each line for now
        console.log(line);
    }
}

// Run the function
processCSV().catch(err => {
    console.error('Error processing CSV:', err);
});
