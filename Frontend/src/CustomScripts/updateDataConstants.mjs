import { readFile } from 'node:fs/promises'; // Import readFile for asynchronous file operations
import path from 'node:path';                // Import path for path manipulation
import { fileURLToPath } from 'node:url';     // Import fileURLToPath to get __dirname equivalent

// Convert import.meta.url to a file path to enable path resolution relative to the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateConstants() {
  try {
    // Construct the absolute path to the format.json file
    const jsonPath = path.resolve(__dirname, '../../../Backend/Data/sc1-data-format/format.json');
    console.log(`Attempting to read JSON from: ${jsonPath}`);

    // Read the file asynchronously as UTF-8 text
    const data = await readFile(jsonPath, { encoding: 'utf8' });

    // Parse the JSON string into a JavaScript object
    const DATA_FORMAT = JSON.parse(data);

    // --- YOUR EXISTING LOGIC GOES HERE ---
    // Now you can use DATA_FORMAT as you intended.
    console.log("DATA_FORMAT loaded successfully:", DATA_FORMAT);
    // For example, if you were exporting it or using it to update other constants:
    // export default DATA_FORMAT; // Or whatever your script does with DATA_FORMAT
    // ------------------------------------

  } catch (error) {
    // Log any errors that occur during file reading or JSON parsing
    console.error("Failed to load or parse JSON:", error);
    process.exit(1); // Exit the process with an error code to indicate failure
  }
}

// Call the asynchronous function to execute the script
updateConstants();
