import { Router } from "express";
import net from "net";
import {spawn} from "child_process"; // TODO
import * as fs from "fs";
const nReadlines = require('n-readlines');
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import SESSION_SOLAR_CAR_DATA from "../../Data/session_data.json";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";
// TODO ---------------------------------------------------------------------
let doRecord = process.env.RECORDING || false; // Flag for whether we should be recording data or not
let currentSession = ""

const ROUTER = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA
let sessionSolarCarData = SESSION_SOLAR_CAR_DATA
let frontendData = INITIAL_FRONTEND_DATA;

let RecodedData = null
let sessionsList = []

const broadbandLines = new nReadlines('./recordedData/sessionsList.bin');
let line;
let lineNumber = 1;

// Getting all the created sessions from sessionsList.bin
while (line = broadbandLines.next()) {
  // console.log(`Line ${lineNumber} has: ${line.toString('ascii')}`);
  sessionsList.push(line.toString('utf8').replace('\r', ""))
  lineNumber++;
}
console.log(sessionsList)

// Send data to front-end
ROUTER.get("/api", (req, res) => {
  console.time("send http");
  const temp = res.send({ response: frontendData }).status(200);
  temp.addListener("finish", () => console.timeEnd("send http"));
});


// --------------------------------------------------------------------------------------------------------------------
// Data recording
// --------------------------------------------------------------------------------------------------------------------

ROUTER.get("/sessionsList", (req, res) => {
  res.send({ response: sessionsList }).status(200);
});


// TODO ---------------------------------------------------------------------
ROUTER.post("/create-recording-session", (req, res) => {
  if (req.body.fileName === "") {
    res.send({ response: "Empty" }).status(200);
    return
  }

  fs.appendFile('./recordedData/sessionsList.bin', req.body.fileName + "\n", (err) => {
    sessionsList.push(req.body.fileName)
    if (err) {
      res.send({ response: "Error" }).status(200);
      return console.error(err);
    };
  });

  fs.writeFile('./recordedData/sessions/' + req.body.fileName + '.bin', '', { flag: 'w' }, function (err) {
    if (err) {
      res.send({ response: "Error" }).status(200);
      return console.error(err);
    }
    res.send({ response: "Created" }).status(200)
    currentSession = req.body.fileName
  });
  console.log('req:', req.body);
});
// TODO ---------------------------------------------------------------------
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

ROUTER.post("/get-recorded-data/x", async (req, res) => {
  currentSession = req.body.fileName
  if (currentSession === "") {
    res.send({ response: "NoFile" }).status(200)
    return
  }

  console.log("Sess:", req.body)
  // await getrecordedData()
  // res.send({ response: RecodedData }).status(200)
});


ROUTER.get("/get-recorded-data", (req, res) => {
  // Execute Python script to convert recorded binary data to a formatted Excel file

  var dataToSend = "";
  // spawn new child process to call the python script
  //const python = spawn('python', ['C:\\Users\\james\\badgerloop_repo\\chase-car-dashboard\\Backend\\src\\routes\\script1.py']);

  // TODO Add installing python/pip (and any dependencies/additional modules, like `pip install numpy` and `pip install (--user most likely?) XlsxWriter`) in terminal in which npm is used to README

  console.log(currentSession);

  // TODO const python = spawn('python', ['./src/routes/exp_new_script1.py','./src/routes/demo3.bin','./Data/sc1-data-format/format.json','./src/routes/test.csv']);
  const python = spawn('python', ['./src/routes/exp_new_script1.py',
                                                './recordedData/sessions/' + currentSession + '.bin',
                                                './Data/sc1-data-format/format.json',
                                                './src/routes/' + currentSession + '.csv']);
  // collect data from script
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
    console.log(dataToSend);
  });
  python.stderr.on('data', function (data) {
    console.log('Python script errored out ...');
    dataToSend = data.toString();
    console.log(dataToSend);
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    //console.log(dataToSend);
    // TODO res.send({ response: dataToSend }).status(200);
  });

  /*if (currentSession == "") {
    res.send({ response: "NoFileSelected" }).status(200);
    return
  }
  getrecordedData()
  res.send({ response: RecodedData }).status(200);*/

  // ------------------------------------------------------------------------------------------------------------------

  if (currentSession == "") {
    res.send({ response: "NoFileSelected" }).status(200);
    return
  }
  getrecordedData()

  res.send({ response: RecodedData }).status(200);
})



//----------------------------------------------------- TCP -----------------------------------------------------------
import { Socket } from "net";

const CAR_PORT = 4003; // Port for TCP connection
const CAR_SERVER = "localhost"; // TCP server's IP address (Replace with pi's IP address to connect to pi)
var client = new Socket();
let timestamp = 0; // TODO This is just a variable to test adding an array of timestamps (for each set of solar car
                   //      data) to solarCarData

// The max number of data points to have in each array at one time
// equivalent to 10 minutes' worth of data being sent 30 Hz
const X_AXIS_CAP = 100; // TODO 18_000



function recordData(data) {
  fs.appendFile("recordedData/sessions/" + currentSession + ".bin", data, (err) => {/*error handling*/ });
}


async function getrecordedData() {
  fs.readFile('recordedData/sessions/' + currentSession + ".bin", (err, data) => {
    let bytesOffset = 0;
    for (const property in DATA_FORMAT) {
      bytesOffset += DATA_FORMAT[property][0];
    }
    let RD = []

    let end = false;
    let indx = 0;
    let i = 1
    end = false
    if (data) {
      // end == false
      while (end == false) {
        console.log("Getting record data")
        let buff = data.slice(indx, bytesOffset + indx)
        // console.log("on data::", buff)
        if (buff <= 0) {
          //End of buffer
          end = true
          RecodedData = RD
          return
        }

        RD.push(JSON.parse(JSON.stringify(unpackBufferData(buff))))
        // console.log("unpack::", unpackBufferData(buff))
        // console.log(i, ") DATA Slice:");
        indx += bytesOffset;
        // i++;
      }
    }
  });

}



function unpackBufferData(BufferData) {
  let buffOffset = 0; // Byte offset for the buffer array
  const xAxisCap = 25; // The max number of data points to have in each array at one time
  let timestamps = sessionSolarCarData["timestamps"]; // The array of timestamps for each set of data added to solarCarData

  // Add the current timestamp to timestamps, limit its length, and update the array in solarCarData
  timestamps.unshift(timestamp);
  timestamp++;
  if (timestamps.length > xAxisCap) {
    timestamps.pop();
  }

  // let fdata = [];

  sessionSolarCarData["timestamps"] = timestamps;

  for (const property in DATA_FORMAT) {
    let dataArray = []; // Holds the array of data specified by property that will be put in solarCarData
    let dataType = ""; // Data type specified in the data format

    if (sessionSolarCarData.hasOwnProperty(property)) {
      dataArray = sessionSolarCarData[property];
    }
    dataType = DATA_FORMAT[property][1];

    // Add the data from the buffer to solarCarData
    switch (dataType) {
      case "uint8":
        // Add uint8 to the front of dataArray
        dataArray.unshift(BufferData.readUInt8(buffOffset));
        break;
      case "float":
        // Add float to the front of dataArray
        dataArray.unshift(BufferData.readFloatLE(buffOffset));
        break;
      case "char":
        // Add char to the front of dataArray
        dataArray.unshift(String.fromCharCode(BufferData.readUInt8(buffOffset)));
        break;
      case "bool":
        // Add bool to the front of dataArray
        dataArray.unshift(Boolean(BufferData.readUInt8(buffOffset)));
        break;
      default:
        // Log if an unexpected type is specified in the data format
        // console.log(`No case for unpacking type ${dataType} (type specified for ${property} in format.json)`);
        break;
    }
    // Limit dataArray to a length specified by xAxisCap
    if (dataArray.length > xAxisCap) {
      dataArray.pop();
    }
    // Write dataArray to solarCarData at the correct key
    sessionSolarCarData[property] = dataArray;

    // Increment offset by amount specified in data format
    buffOffset += DATA_FORMAT[property][0];
    //
    // fdata.push(solarCarData);
    // console.log(solarCarData)

  }
  // console.log("Set::", sessionSolarCarData)
  return sessionSolarCarData

  // Update the data to be passed to the front-end
  // frontendData = solarCarData;
};


/**
 * Creates a connection with the TCP server at port CAR_PORT and address CAR_SERVER. Then, sets listeners for connect,
 * data, close, and error events. In the event of an error, the client will attempt to re-open the socket at
 * regular intervals.
 */
function openSocket() {
  // Establish connection with server
  var client = net.connect(CAR_PORT, CAR_SERVER); // TODO Add third parameter (timeout in ms) if we want to timeout due to inactivity
  client.setKeepAlive(true);

  // Connection established listener
  client.on("connect", () => {
    console.log(`Connected to car server: ${client.remoteAddress}:${CAR_PORT}`);
  });

  // Data received listener
  client.on("data", (data) => {
    // console.log(data);
    console.time("update data");
    unpackData(data);

    if (doRecord) {
      recordData(data)
    }
    // console.log(i++, ") Data::", data);

    /*TODO fs.writeFile('./src/routes/demo3.bin', data, { flag: 'a' }, err => {
      if (err) {
        console.error(err)
        return
      }
    }) // TODO
    fs.writeFile('./src/routes/unpacked_demo3.txt', JSON.stringify(solarCarData), { flag: 'a' }, err => {
      if (err) {
        console.error(err)
        return
      }
    }) // TODO
    */
    console.timeEnd("update data");
  });

  // Socket closed listener
  client.on("close", function () {
    // Pull the most recent solar_car_connection values to false if connection was previously established
    if (solarCarData.solar_car_connection.length > 0) {
      solarCarData.solar_car_connection[0] = false;
      frontendData.solar_car_connection[0] = false;
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

  // Add the current timestamp to timestamps, limit its length, and update the array in solarCarData
  // timestamps.unshift(DateTime.now().toString());

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
    dataType = DATA_FORMAT[property][1];

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
    buffOffset += DATA_FORMAT[property][0];
  }

  // Update the timestamps array in solarCarData
  solarCarData["timestamps"] = timestamps;

  // Update the data to be passed to the front-end
  frontendData = solarCarData;
}

// Create new socket
openSocket();

export default ROUTER;
