import { Router } from "express";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";
import net from "net";
import fetch from 'node-fetch';
const { Client } = require("cassandra-driver"); // TODO For Cassandra

const ROUTER = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA,
  frontendData = INITIAL_FRONTEND_DATA;

// Send data to front-end
ROUTER.get("/api", (req, res) => {
  console.time("send http");
  const temp = res.send({ response: frontendData }).status(200);
  temp.addListener("finish", () => console.timeEnd("send http"));
});


//----------------------------------------------------- LTE ----------------------------------------------------------
let interval;

interval = setInterval(() => {
  // TODO Is not using a database for this project
  fetch('https://g5079b74c17c11c-allrecipes.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/test-select/api/select-2', {
    method: 'GET',
    headers: {
      "Content-type": "application/json"
    }
  })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // TODO Gets the first item of the response
        console.log('Request succeeded with JSON response', data.items[0]);
      })
      .catch(function(error) {
        console.log('Request failed', error);
      });
}, 250);
/*
const client = new Client({
  cloud: {
    secureConnectBundle: "./secure-connect-testingforbloop.zip",
  },
  credentials: {
    username: "<<CLIENT ID>>",
    password: "<<CLIENT SECRET>>",
  },
});

async function run() {


  await client.connect();

  // Execute a query
  //const rs = await client.execute("select counter from blooptests.table1 where session='sess5' order by tstamp desc, bytes desc, counter desc limit 1;");
  //console.log('Your cluster returned', rs.rows[0].get("counter"));

  //await client.shutdown();
}

async function execute() {
  // Execute a query
  const rs = await client.execute("select counter from blooptests.table1 where session='sess5' and tstamp='t' and bytes = '010101' and counter > 5000 order by counter desc limit 1;");
  console.log('Your cluster returned', rs.rows[0].get("counter"));
}

// Run the async function
run();*/



//----------------------------------------------------- TCP ----------------------------------------------------------
const CAR_PORT = 4003; // Port for TCP connection
const CAR_SERVER = "localhost"; // TCP server's IP address (Replace with pi's IP address to connect to pi)

// The max number of data points to have in each array at one time
// equivalent to 10 minutes' worth of data being sent 30 Hz
const X_AXIS_CAP = 18_000;

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
    console.timeEnd("update data");

    execute(); // TODO
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
