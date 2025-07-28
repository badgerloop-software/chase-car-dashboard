// file:///home/zavi/chase-car-dashboard/Frontend/src/CustomScripts/convertData.mjs

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertData() {
  try {
    const jsonPath = path.resolve(__dirname, '../../../Backend/Data/sc1-data-format/format.json');
    console.log(`Attempting to read JSON from: ${jsonPath}`);
    const data = await readFile(jsonPath, { encoding: 'utf8' });
    const SC1DataFormat = JSON.parse(data); // Use SC1DataFormat as per your original import

    // --- YOUR EXISTING LOGIC GOES HERE ---
    // Now you can use SC1DataFormat as you intended.
    console.log("SC1DataFormat loaded successfully:", SC1DataFormat);
    // ------------------------------------

  } catch (error) {
    console.error("Failed to load or parse JSON:", error);
    process.exit(1);
  }
}

convertData();
