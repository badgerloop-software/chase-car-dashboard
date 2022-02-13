import { Router } from "express";
import * as fs from "fs";
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";
// TODO ---------------------------------------------------------------------
let doRecord = false; // Flag for whether we should be recording data or not

const ROUTER = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA,
  frontendData = INITIAL_FRONTEND_DATA;

// Send data to front-end
ROUTER.get("/api", (req, res) => {
  res.send({ response: frontendData }).status(200);
});

// TODO ---------------------------------------------------------------------
// Set recording flag to true
ROUTER.get("/start-record", (req, res) => {
  doRecord = true;
});

// Set recording flag to false
ROUTER.get("/stop-record", (req, res) => {
  doRecord = false;
});
// TODO ---------------------------------------------------------------------

export default ROUTER;

//--------------TCP-------------------------

import { Socket } from "net";
const CAR_PORT = 4003; // Port for TCP connection to Car Datagenerator
const CAR_SERVER = "localhost"; // TCP server's IP address (Replace with pi's IP address to connect to pi)
var client = new Socket();
let timestamp = 0; // TODO This is just a variable to test adding an array of timestamps (for each set of solar car
// data) to solarCarData

// Initiate connection
client.connect(CAR_PORT, CAR_SERVER, function () {
  console.log(`Connected to car server: ${client.remoteAddress}:${CAR_PORT}`);
});

// Data received listener: Log and unpack data when it's received
client.on("data", function (data) {
  console.log(data);
  // TODO ------------------------------------------------------------------------------------------
  //if(doRecord) {
    // Add the most recent data to runName.bin
    fs.appendFile("recordedData/runName.bin", data, (err) => {/*error handling*/});
    fs.readFile("recordedData/runName.bin", (err, fData) => {
      // Write the first speed value to runName.txt (should match the first value in runName.csv)
      fs.appendFile("recordedData/runName.csv", fData.readUInt8(0) + "\n", (err) => {/*error handling*/});
    })
    // Write the most recent speed value to runName.csv
    fs.appendFile("recordedData/runName.txt", data.readUInt8(0) + "\n", (err) => {/*error handling*/});
  //}
  // TODO ------------------------------------------------------------------------------------------
  unpackData(data);
});


//**Example for getting content from a file line by line  */
// const allFileContents = fs.readFileSync('recordedData/runName.csv', 'utf-8');
// allFileContents.split(/\r?\n/).forEach(line =>  {
//   console.log(`Line from file: ${line}`);
// });

// Socket closed listener: Log when connection is closed
client.on("close", function () {
  console.log(`Connection to car server (${CAR_PORT}) is closed`);
});

// Error listener: Destroy the socket and log the error
client.on("error", (err) => {
  console.log("Client errored out:", err);
  client.destroy();
});

/**
 * Unpacks a Buffer and updates the data to be passed to the front-end
 *
 * @param data the data to be unpacked
 */
function unpackData(data) {
  let buffOffset = 0; // Byte offset for the buffer array
  const xAxisCap = 25; // The max number of data points to have in each array at one time
  let timestamps = solarCarData["timestamps"]; // The array of timestamps for each set of data added to solarCarData

  // Add the current timestamp to timestamps, limit its length, and update the array in solarCarData
  timestamps.unshift(timestamp);
  timestamp++;
  if (timestamps.length > xAxisCap) {
    timestamps.pop();
  }
  solarCarData["timestamps"] = timestamps;

  for (const property in DATA_FORMAT) {
    let dataArray = []; // Holds the array of data specified by property that will be put in solarCarData
    let dataType = ""; // Data type specified in the data format

    if (solarCarData.hasOwnProperty(property)) {
      dataArray = solarCarData[property];
    }
    dataType = DATA_FORMAT[property][1];

    // Add the data from the buffer to solarCarData
    switch (dataType) {
      case "uint8":
        // Add uint8 to the front of dataArray
        dataArray.unshift(data.readUInt8(buffOffset));
        break;
      case "float":
        // Add float to the front of dataArray
        dataArray.unshift(data.readFloatLE(buffOffset));
        break;
      case "char":
        // Add char to the front of dataArray
        dataArray.unshift(String.fromCharCode(data.readUInt8(buffOffset)));
        break;
      case "bool":
        // Add bool to the front of dataArray
        dataArray.unshift(Boolean(data.readUInt8(buffOffset)));
        break;
      default:
        // Log if an unexpected type is specified in the data format
        console.log(`No case for unpacking type ${dataType} (type specified for ${property} in format.json)`);
        break;
    }
    // Limit dataArray to a length specified by xAxisCap
    if (dataArray.length > xAxisCap) {
      dataArray.pop();
    }
    // Write dataArray to solarCarData at the correct key
    solarCarData[property] = dataArray;

    // Increment offset by amount specified in data format
    buffOffset += DATA_FORMAT[property][0];
  }

  // Update the data to be passed to the front-end
  frontendData = solarCarData;
}
