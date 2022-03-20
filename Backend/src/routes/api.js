import { Router } from "express";
import * as fs from "fs";
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";
// TODO ---------------------------------------------------------------------
let doRecord = false; // Flag for whether we should be recording data or not
let sessionFile = ""

const ROUTER = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA,
  frontendData = INITIAL_FRONTEND_DATA;

let RecodedData = null

// Send data to front-end
ROUTER.get("/api", (req, res) => {
  res.send({ response: frontendData }).status(200);
});

// TODO ---------------------------------------------------------------------
ROUTER.post("/create-recording-session", (req, res) => {
  if(req.body.fileName === ""){
    res.send({ response: "Empty" }).status(200);
    return
  }
  fs.writeFile('./recordedData/sessions/' + req.body.fileName + '.bin', '', { flag: 'w' }, function (err) {
    if (err) {
      res.send({ response: "Error" }).status(200);
      return console.error(err);
    }
    res.send({ response: "Created" }).status(200)
    sessionFile = req.body.fileName+".bin"
  });
  console.log('req:', req.body);
});


// Set recording flag to true or false depeding on request
ROUTER.post("/record-data", (req, res) => {
  if(sessionFile === ""){
    res.send({ response: "NoFile" }).status(200)
    return
  } 
  res.send({ response: "Recording" }).status(200)
  doRecord = req.body.doRecord
  console.log("Record Status:", req.body)
});


ROUTER.get("/get-recorded-data", (req, res) => {
  res.send({ response: RecodedData }).status(200);

})

// TODO ---------------------------------------------------------------------

export default ROUTER;

//*******************************************/
//--------------TCP-------------------------
//*****************************************/

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

// Data onreceived: Log and unpack data when it's received
let i = 1;
client.on("data", function (data) {
  unpackData(data);
  if (doRecord) {
    recordData(data)
  }
  // console.log(i++, ") Data::", data);
});


function recordData(data) {
  fs.appendFile("recordedData/sessions/"+sessionFile, data, (err) => {/*error handling*/ });
}
// getrecordedData()

function getrecordedData() {
  console.log("Geting record data")
  let bytesOffset = 0;
  for (const property in DATA_FORMAT) {
    bytesOffset += DATA_FORMAT[property][0];
  }
  let RD = []

  fs.readFile('recordedData/data.bin', (err, data) => {
    let end = false;
    let indx = 0;
    let i = 1
    end = false
    while (end == false) {
      let buff = data.slice(indx, bytesOffset + indx)
      if (buff <= 0) {
        end = true
        // Send recorded flag to false
        RecodedData = RD
        console.log("END of recordedData buffer::")
        return
      }

      let unpackedSet = unpackBufferData(buff)
      RD.push(unpackedSet)
      // console.log(i, ") DATA Slice:");
      indx += bytesOffset;
      i++;
    }
  });
}

function unpackBufferData(data) {
  let buffOffset = 0; // Byte offset for the buffer array
  const xAxisCap = 25; // The max number of data points to have in each array at one time
  let timestamps = solarCarData["timestamps"]; // The array of timestamps for each set of data added to solarCarData

  // Add the current timestamp to timestamps, limit its length, and update the array in solarCarData
  timestamps.unshift(timestamp);
  timestamp++;
  if (timestamps.length > xAxisCap) {
    timestamps.pop();
  }

  // let fdata = [];

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
    //
    // fdata.push(solarCarData);
    // console.log(solarCarData)

  }

  return solarCarData

  // Update the data to be passed to the front-end
  // frontendData = solarCarData;
}

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
