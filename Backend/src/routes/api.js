import { Router } from "express";
import net from "net";
import { spawn } from "child_process";
import * as fs from "fs";
const nReadlines = require('n-readlines');
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";
import CONSTANTS from "../../src/constants.json";

const ROUTER = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA;
let frontendData = INITIAL_FRONTEND_DATA;

const NUM_BYTES_IDX = 0;
const DATA_TYPE_IDX = 1;

let graphsToSend = [];
let graphsMetadata = {}  // template => { "0": {"historyLength":20, "datasets":[A, B, C]}}

let bytesPerPacket = 0;
for (const property in DATA_FORMAT) {
  bytesPerPacket += DATA_FORMAT[property][NUM_BYTES_IDX];
}


// Send graph data to front-end
ROUTER.get(CONSTANTS.ROUTES.GET_GRAPH_DATA, (req, res) => {
  //console.time("send http");
  let final_data;
  if (Object.keys(frontendData).length !== 0) {
    final_data = filterGraphsToSend();
  } else {
    final_data = null;
  }
  const temp = res.send({ response: final_data }).status(200);
  //temp.addListener("finish", () => console.timeEnd("send http"));
});


// Send single values to front-end
ROUTER.get(CONSTANTS.ROUTES.GET_SINGLE_VALUES, (req, res) => {
  // console.time("send http");
  let singleValuesJSON;
  if (Object.keys(frontendData).length !== 0) { 
    singleValuesJSON = getSingleValues(frontendData);
  } else {
    singleValuesJSON = null;
  }
  // const temp =
  res.send({ response: singleValuesJSON }).status(200);
  // temp.addListener("finish", () => console.timeEnd("send http"));
});



// --------------------------------------------------------------------------------------------------------------------
// Data recording
// --------------------------------------------------------------------------------------------------------------------

// Convert line to UTF-8 and remove return character
function _convertLine(line) {
  return line.toString('utf8').replace('\r', "");
}


const RECORDED_DATA_PATH = './recordedData/sessions/';
const SESSIONS_LIST_PATH = './recordedData/sessionsList.bin';
const PROCESS_SCRIPT_PATH = './src/routes/process_recorded_data.py';
const DATA_FORMAT_PATH = './Data/sc1-data-format/format.json';
const PROCESSED_DATA_PATH = './recordedData/processedData/';

let doRecord = false; // Flag for whether we should be recording data or not
let currentSession = "";

let sessionsList = [];

const broadbandLines = new nReadlines(SESSIONS_LIST_PATH);
let line;
let lineNumber = 1;

// Getting all the created sessions from sessionsList.bin
while (line = broadbandLines.next()) {
  sessionsList.push(_convertLine(line));
  lineNumber++;
}
console.log("Initial list of recorded sessions:", sessionsList);


ROUTER.get(CONSTANTS.ROUTES.GET_SESSION_LIST, (req, res) => {
  res.send({ response: sessionsList }).status(200);
});


ROUTER.post(CONSTANTS.ROUTES.CREATE_RECORDING_SESSION, (req, res) => {
  if (req.body.fileName === "") {
    res.send({ response: "Empty" }).status(200);
    return;
  }

  fs.appendFile(SESSIONS_LIST_PATH, req.body.fileName + "\n", (err) => {
    sessionsList.push(req.body.fileName);
    if (err) {
      res.send({ response: "Error" }).status(200);
      return console.error(err);
    };
  });

  fs.writeFile(RECORDED_DATA_PATH + req.body.fileName + '.bin', '', { flag: 'w' }, function (err) {
    if (err) {
      res.send({ response: "Error" }).status(200);
      return console.error(err);
    }
    res.send({ response: "Created" }).status(200);
    currentSession = req.body.fileName;
  });
  console.log('req:', req.body);
});


ROUTER.post(CONSTANTS.ROUTES.SET_RECORDING_SESSION, (req, res) => {
  if (req.body.fileName === "") {
    res.send({ response: -1 }).status(200);
    return;
  }

  res.send({ response: 200 }).status(200);
  currentSession = req.body.fileName;

  console.log('req:', req.body);
});


// Set recording flag to true or false depeding on request
ROUTER.post(CONSTANTS.ROUTES.SET_RECORD, (req, res) => {
  if (currentSession === "") {
    res.send({ response: "NoFile" }).status(200);
    return;
  }
  res.send({ response: "Recording" }).status(200);
  doRecord = req.body.doRecord;
  console.log("Record Status:", req.body);
});


ROUTER.get(CONSTANTS.ROUTES.PROCESS_RECORDED_DATA, (req, res) => {
  // Execute Python script to convert recorded binary data to a formatted Excel file

  console.log(currentSession);

  if (currentSession === "") {
    res.send({ response: "NoFileSelected" }).status(200);
    return;
  }

  // Spawn new child process to call the python script
  const python = spawn('python', [PROCESS_SCRIPT_PATH,
    RECORDED_DATA_PATH + currentSession + '.bin',
    DATA_FORMAT_PATH,
    PROCESSED_DATA_PATH + currentSession + '.csv']);

  // Collect data from script
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    console.log(data.toString());
  });

  python.stderr.on('data', function (data) {
    console.log('Python script errored out ...');
    console.log(data.toString());
  });

  // In close event we are sure that stream from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
  });

  res.send({ response: currentSession }).status(200);
});


function recordData(data) {
  fs.appendFile(RECORDED_DATA_PATH + currentSession + ".bin", Buffer.concat([data, Buffer.alloc(1, true)]),
    (err) => {
      if (err) {
        console.error("ERROR: Error while appending to file");
      }
    });
}



// --------------------------------------------------------------------------------------------------------------------
// Performance improvements
// --------------------------------------------------------------------------------------------------------------------

ROUTER.post(CONSTANTS.ROUTES.UPDATE_GRAPHS_METADATA, (req, res) => {
  if (req.body) {
    updateGraphsMetadata(req.body);
    res.send({ status: "SUCCESS" }).status(200);
  } else {
    res.send({ status: "EMPTY-REQ" }).status(200);
  }

});

function getSingleValues(jsonData) {
  let newJson = {};

  for (const key in jsonData) {
    if (jsonData.hasOwnProperty(key)) {
      newJson[key] = [jsonData[key][0]];
    }
  }

  return newJson;
}

function filterGraphsToSend() {
  let obj = {};
  let maxNumValues = 1; // Needs to be 1 so that we have at least one timestamp

  graphsToSend.map((element) => {
    const numValues = (element[1] / 600) * X_AXIS_CAP; // TODO Update this with a non-static X_AXIS_CAP

    obj[`${element[0]}`] = frontendData[`${element[0]}`].slice(0, Math.round(numValues));

    if(numValues > maxNumValues) {
      maxNumValues = numValues;
    }
  });

  obj["timestamps"] = frontendData["timestamps"].slice(0, Math.round(maxNumValues));
  // Logs for checking lengths of each dataset and timestamps
  console.log("Max num values:", Math.round(maxNumValues))
  for (const key in obj) {
    console.log(`${key}: ${obj[key].length}`);
  }

  return obj;
}

function updateGraphsMetadata(data) {
  graphsToSend = [];

  for (const [key, value] of Object.entries(data)) {
    graphsMetadata[`${key}`] = value;
  }

  for (const key in graphsMetadata) {
    const data = graphsMetadata[key];
    updateGraphsToSend(data);
  }

}

function updateGraphsToSend(data) {
  if (data) {
    for (let i = 0; i < data?.datasets?.length; i++) {
      const dataset = data?.datasets[i];
      const historyLength = data?.historyLength;

      // Try to find the current dataset in the list of datasets to be sent to the frontend
      // datasetIdx == -1 => The dataset is not yet in the list. Add it to the list
      // datasetIdx != -1 => The dataset is already in the list. Possibly update the historyLength
      const datasetIdx = graphsToSend.map(element => element[0]).indexOf(dataset);

      if (datasetIdx === -1) {
        graphsToSend.push([dataset, historyLength]);
      } else if (graphsToSend[datasetIdx][1] <= historyLength) {
        graphsToSend[datasetIdx][1] = historyLength;
      }
    }
  }
}



//----------------------------------------------------- TCP ----------------------------------------------------------
/**
 * Throw an error describing the start command usage.
 */
function usageError() {
  throw new Error('Invalid command. Correct usages:\n' +
      '\t`npm start`: Use to connect the backend to the pi\n' +
      '\t`npm run start-dev` or `npm start dev` (from Backend/ only): Use to connect the backend to the local data ' +
         'generator\n' +
      '\t`npm run start-individual` or `npm start individual` (from Backend/ only): Use to connect the backend to a ' +
         'local instance of the engineering data distribution server, which is connected to the pi\n');
}

let INCOMING_DATA_PORT; // Port for TCP connection
let INCOMING_DATA_ADDRESS; // TCP server's IP address

// Set INCOMING_DATA_ADDRESS according to the command used to start the backend
if (process.argv.length === 3) {
  if ((process.argv.at(2) === "dev") || (process.argv.at(2) === "individual")) {
    // `npm start dev` or `npm start individual` was used. Connect to the local data generator or a local instance of
    // the engineering data distribution server
    INCOMING_DATA_ADDRESS = CONSTANTS.LOCAL_INCOMING_DATA_ADDRESS;
    INCOMING_DATA_PORT = CONSTANTS.NOM_INCOMING_DATA_PORT;
  } else {
    // An invalid command was used. Throw an error describing the usage
    usageError();
  }
} else if (process.argv.length === 2) {
  // `npm start` was used. Connect to the device running the engineering data distribution server
  INCOMING_DATA_ADDRESS = CONSTANTS.LAN_INCOMING_DATA_ADDRESS;
  INCOMING_DATA_PORT = CONSTANTS.NOM_INCOMING_DATA_PORT;
} else {
  // An invalid command was used. Throw an error describing the usage
  usageError();
}

console.log('INCOMING_DATA_ADDRESS: ' + INCOMING_DATA_ADDRESS);

// The max number of data points to have in each array at one time
// equivalent to 10 minutes' worth of data being sent 30 Hz
const X_AXIS_CAP = CONSTANTS.X_AXIS_CAP;

/**
 * Creates a connection with the TCP server at port INCOMING_DATA_PORT and address INCOMING_DATA_ADDRESS. Then, sets
 * listeners for connect, data, close, and error events. In the event of an error, the client will attempt to re-open
 * the socket at regular intervals.
 */
function openSocket() {
  // Establish connection with server
  console.log('INCOMING_DATA_PORT: ' + INCOMING_DATA_PORT);
  var client = net.connect(INCOMING_DATA_PORT, INCOMING_DATA_ADDRESS);
  client.setKeepAlive(true);

  // Connection established listener
  client.on("connect", () => {
    console.log(`Connected to car server: ${client.remoteAddress}:${INCOMING_DATA_PORT}`);
  });

  let partialData = '';
  // Data received listener
  client.on("data", (data) => {
    // Combine the new data with any previously received partial data
    partialData += data.toString('latin1');

    let startIndex = partialData.indexOf("<bl>");
    let endIndex = partialData.indexOf("</bl>");

    // Check if the packet is the size of a nominal payload without <bl></bl>
    // If so, assume it is a nominal packet without <bl></bl> and broadcast it as is
    if (partialData.length === bytesPerPacket) {
      unpackData(Buffer.from(partialData,'latin1'));
      if (doRecord) {
        recordData(Buffer.from(partialData,'latin1'));
      }
      partialData = '';
    } else {
      while (startIndex !== -1 && endIndex !== -1) {
        console.log("start index" + startIndex, "end index" + endIndex)
        // Extract a complete data packet
        const packet = Buffer.from(partialData.slice(startIndex+4, endIndex),'latin1');
        // Process the complete data packet
        if (packet.length == bytesPerPacket) {
          unpackData(packet);
          if (doRecord) {
            recordData(packet);
          }
        } else {
          console.warn("ERROR: Bad packet length ------------------------------------");
        }
        // Update the partial data to exclude the processed packet
        partialData = partialData.substring(endIndex + 5);
        // Search for the next complete data packet
        startIndex = partialData.indexOf("<bl>");
        endIndex = partialData.indexOf("</bl>");
      }
      // If the remaining data is longer than the expected packet length,
      // there might be an incomplete packet, so log a warning.
      if (partialData.length >= bytesPerPacket) {
        console.warn("ERROR: Incomplete or malformed packet ------------------------------------");
        partialData = '';
      }
    }
  });

  // Socket closed listener
  client.on("close", () => {
    // Pull the most recent solar_car_connection values to false if connection was previously established
    if (solarCarData.solar_car_connection.length > 0) {
      solarCarData.solar_car_connection[0] = false;
      frontendData.solar_car_connection[0] = false;
      // If recording, replace the latest solar_car_connection value in file with false
      if (doRecord) {
        fs.open(RECORDED_DATA_PATH + currentSession + ".bin", "r+", (err, fd) => {
          if (!err && fs.fstatSync(fd).size > 0) {
            fs.write(
              fd, Buffer.alloc(1, false), 0, 1, fs.fstatSync(fd).size - 1,
              (err, bw, buf) => {
                if (err) {
                  // Failed to write byte to offset
                  console.error("ERROR: Error writing to file when lost connection");
                }
              }
            );
          }
        });
      }
    }

    // Kill socket
    client.destroy();
    client.unref();

    console.warn(`Connection to car server (${INCOMING_DATA_PORT}) is closed`);

    // Attempt to re-open socket
    setTimeout(openSocket, 1000);
  });

  // Socket error listener
  client.on("error", (err) => {
    // Log error
    console.error("Client errored out:", err);
  });
}


/**
 * Unpacks a Buffer and updates the data to be passed to the front-end
 *
 * @param data the data to be unpacked
 */
function unpackData(data) {
  let buffOffset = 0; // Byte offset for the buffer array
  let timestamps = solarCarData["timestamps"]; // The array of timestamps for each set of data added to solarCarData
  // Array values indicate the status of the connection to the solar car. These will always be true when unpacking data
  let solar_car_connection = solarCarData["solar_car_connection"];

  // Add separators for timestamp to timestamps and limit array's length
  timestamps.unshift("::.");
  if (timestamps.length > X_AXIS_CAP) {
    timestamps.pop();
  }

  // Repeat with solar_car_connection
  solar_car_connection.unshift(true);
  if (solar_car_connection.length > X_AXIS_CAP) solar_car_connection.pop();
  solarCarData["solar_car_connection"] = solar_car_connection;

  for (const property in DATA_FORMAT) {
    let dataArray = []; // Holds the array of data specified by property that will be put in solarCarData
    let dataType = ""; // Data type specified in the data format

    if (solarCarData.hasOwnProperty(property)) {
      dataArray = solarCarData[property];
    }
    dataType = DATA_FORMAT[property][DATA_TYPE_IDX];

    // Add the data from the buffer to solarCarData
    switch (dataType) {
      case "float":
        // Add the data to the front of dataArray
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
      case "uint8":
        switch (property) {
          case "tstamp_hr":
            const hours = data.readUInt8(buffOffset);
            if (hours < 10) timestamps[0] = "0" + hours + timestamps[0];
            else timestamps[0] = hours + timestamps[0];
            break;
          case "tstamp_mn":
            const mins = data.readUInt8(buffOffset);
            timestamps[0] = timestamps[0].replace(
              "::",
              ":" + (mins < 10 ? "0" + mins : mins) + ":"
            );
            break;
          case "tstamp_sc":
            const secs = data.readUInt8(buffOffset);
            timestamps[0] = timestamps[0].replace(
              ":.",
              ":" + (secs < 10 ? "0" + secs : secs) + "."
            );
            break;
          default:
            // Add the data to the front of dataArray
            dataArray.unshift(data.readUInt8(buffOffset));
            break;
        }
        break;
      case "uint16":
        if (property === "tstamp_ms") {
          const millis = data.readUInt16LE(buffOffset);
          let millisStr;
          if (millis >= 100) {
            millisStr = millis;
          } else if (millis >= 10) {
            millisStr = "0" + millis;
          } else {
            millisStr = "00" + millis;
          }
          if (typeof millisStr === "undefined") {
            console.warn(
              `Millis value of ${millis} caused undefined millis value`
            );
          }

          timestamps[0] += millisStr;
          break;
        }
        // Add the data to the front of dataArray
        dataArray.unshift(data.readUInt16BE(buffOffset));
        break;
      default:
        // Log if an unexpected type is specified in the data format
        console.log(
          `No case for unpacking type ${dataType} (type specified for ${property} in format.json)`
        );
        break;
    }

    if (!property.startsWith("tstamp")) {
      // If property is not used for timestamps
      // Limit dataArray to a length specified by X_AXIS_CAP
      if (dataArray.length > X_AXIS_CAP) {
        dataArray.pop();
      }
      // Write dataArray to solarCarData at the correct key
      solarCarData[property] = dataArray;
    }

    // Increment offset by amount specified in data format
    buffOffset += DATA_FORMAT[property][NUM_BYTES_IDX];
  }

  // Update the timestamps array in solarCarData
  solarCarData["timestamps"] = timestamps;

  // Update the data to be passed to the front-end
  frontendData = solarCarData;
}

// Create new socket
openSocket();

export default ROUTER;
