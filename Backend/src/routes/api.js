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

let bytesPerPacket = 0;
for (const property in DATA_FORMAT) {
  bytesPerPacket += DATA_FORMAT[property][NUM_BYTES_IDX];
}


// Send data to front-end
ROUTER.get("/api", (req, res) => {
  console.time("send http");
  const temp = res.send({ response: frontendData }).status(200);
  temp.addListener("finish", () => console.timeEnd("send http"));
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
console.log("Initial list of recorded sessions:", sessionsList)


ROUTER.get("/sessionsList", (req, res) => {
  res.send({ response: sessionsList }).status(200);
});


ROUTER.post("/create-recording-session", (req, res) => {
  if (req.body.fileName === "") {
    res.send({ response: "Empty" }).status(200);
    return
  }

  fs.appendFile(SESSIONS_LIST_PATH, req.body.fileName + "\n", (err) => {
    sessionsList.push(req.body.fileName)
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
    res.send({ response: "Created" }).status(200)
    currentSession = req.body.fileName
  });
  console.log('req:', req.body);
});


ROUTER.post("/current-recording-session", (req, res) => {
  if (req.body.fileName === "") {
    res.send({ response: -1 }).status(200);
    return
  }

  res.send({ response: 200 }).status(200)
  currentSession = req.body.fileName

  console.log('req:', req.body);
});


// Set recording flag to true or false depeding on request
ROUTER.post("/record-data", (req, res) => {
  if (currentSession === "") {
    res.send({ response: "NoFile" }).status(200)
    return
  }
  res.send({ response: "Recording" }).status(200)
  doRecord = req.body.doRecord
  console.log("Record Status:", req.body)
});


ROUTER.get("/process-recorded-data", (req, res) => {
  // Execute Python script to convert recorded binary data to a formatted Excel file

  console.log(currentSession)

  if (currentSession === "") {
    res.send({ response: "NoFileSelected" }).status(200);
    return
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
})


function recordData(data) {
  fs.appendFile(RECORDED_DATA_PATH + currentSession + ".bin", Buffer.concat([data, Buffer.alloc(1, true)]),
                (err) => {
                  if(err) {
                    console.error("ERROR: Error while appending to file");
                  }
  });
}



//----------------------------------------------------- TCP ----------------------------------------------------------
const CAR_PORT = CONSTANTS.CAR_PORT; // Port for TCP connection
let CAR_ADDRESS; // TCP server's IP address (PI_ADDRESS to connect to pi; TEST_ADDRESS to connect to data generator)

// Set CAR_ADDRESS according to the command used to start the backend
if((process.argv.length === 3) && (process.argv.findIndex((val) => val === "dev") === 2)) {
  // `npm start dev` was used. Connect to data generator
  CAR_ADDRESS = CONSTANTS.TEST_ADDRESS;
} else if(process.argv.length === 2) {
  // `npm start` was used. Connect to the pi
  CAR_ADDRESS = CONSTANTS.PI_ADDRESS;
} else {
  // An invalid command was used. Throw an error describing the usage
  throw new Error('Invalid command. Correct usages:\n' +
                  '\t`npm start`: Use to connect the backend to the pi\n' +
                  '\t`npm run start-dev`: Use to connect the backend to the local data generator\n' +
                  '\t`npm start dev` (from Backend/ only): Same as `npm run start-dev`\n');
}

console.log('CAR_ADDRESS: ' + CAR_ADDRESS);

// The max number of data points to have in each array at one time
// equivalent to 10 minutes' worth of data being sent 30 Hz
const X_AXIS_CAP = CONSTANTS.X_AXIS_CAP;

/**
 * Creates a connection with the TCP server at port CAR_PORT and address CAR_ADDRESS. Then, sets listeners for connect,
 * data, close, and error events. In the event of an error, the client will attempt to re-open the socket at
 * regular intervals.
 */
function openSocket() {
  // Establish connection with server
  console.log('CAR_PORT: ' + CAR_PORT);
  var client = net.connect(CAR_PORT, CAR_ADDRESS); // TODO Add third parameter (timeout in ms) if we want to timeout due to inactivity
  client.setKeepAlive(true);

  // Connection established listener
  client.on("connect", () => {
    console.log(`Connected to car server: ${client.remoteAddress}:${CAR_PORT}`);
  });

  // Data received listener
  client.on("data", (data) => {
    if(data.length === bytesPerPacket) {
      console.time("update data");
      unpackData(data);

      if (doRecord) {
        recordData(data)
      }

      console.timeEnd("update data");
    } else {
      console.warn("ERROR: Bad packet length ------------------------------------");
    }

  });

  // Socket closed listener
  client.on("close", function () {
    // Pull the most recent solar_car_connection values to false if connection was previously established
    if (solarCarData.solar_car_connection.length > 0) {
      solarCarData.solar_car_connection[0] = false;
      frontendData.solar_car_connection[0] = false;
      // If recording, replace the latest solar_car_connection value in file with false
      if(doRecord) {
        fs.open(RECORDED_DATA_PATH + currentSession + ".bin", "r+", (err, fd) => {
          if(!err) {
            fs.write(
                fd, Buffer.alloc(1, false), 0, 1, fs.fstatSync(fd).size - 1,
                (err, bw, buf) => {
                  if(err) {
                    // Failed to write byte to offset
                    console.error("ERROR: Error writing to file when lost connection");
                  }
                }
            );
          }
        });
      }
    }

    console.log(`Connection to car server (${CAR_PORT}) is closed`);
  });

  // Socket error listener
  client.on("error", (err) => {
    // Log error
    console.log("Client errored out:", err);

    // Kill socket
    client.destroy();
    client.unref();

    // Pull the most recent solar_car_connection values to false if connection was previously established
    if (solarCarData.solar_car_connection.length > 0) {
      solarCarData.solar_car_connection[0] = false;
      frontendData.solar_car_connection[0] = false;
    }

    // Attempt to re-open socket
    setTimeout(openSocket, 1000);
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
          const millis = data.readUInt16BE(buffOffset);
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
