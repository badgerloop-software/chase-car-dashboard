import { Router } from "express";
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";

const router = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA,
  frontendData = INITIAL_FRONTEND_DATA;

// Send data to front-end
router.get("/api", (req, res) => {
  res.send({ response: frontendData }).status(200);
});

export default router;

//--------------TCP-------------------------

import { Socket } from "net";
// const { Buffer } = require("buffer");
const car_port = 4003;
const car_server = "192.168.1.1";
var client = new Socket();
//var client = net.createConnection(car_port, "192.168.1.1", function () {
//  console.log(`Created connection with ${client.remoteAddress}:${car_port}`);
//});
let timestamp = 0; // TODO This is just a variable to test adding an array of timestamps (for each set of solar car
                   // data) to solarCarData

client.connect(car_port, car_server, function () {
  console.log(`Connected to car server: ${client.remoteAddress}:${car_port}`);
});

//client.on("connect", function () {
//  console.log(`Connected to car server: localhost:${car_port}`);
//});

//client.on("lookup", function (host) {
  //console.log("Received: ", data);
//  console.log(data.toString());
  //unpackData(data);
  // client.destroy(); //kill client after server's response
//});
let count = 0;
client.on("data", function (data) {
  //console.log("Received: ", data);
  console.log(data);
  //console.log(data.toString());

  if(count >= 1) {
    unpackData(data);
  } else {
    count++;
  }

  // client.destroy(); //kill client after server's response
});

client.on("close", function () {
  console.log(`Connection to car server (${car_port}) is closed`);
});

client.on("error", (err) => {
  console.log("Client errored out:", err);
  client.destroy();
  // If connection with the solar car was refused, try connecting to localhost (in lieu of having separate run scripts
  // for testing with localhost and running with the pi's IP)
  if(err.toString() === `Error: connect ECONNREFUSED ${car_server}:${car_port}`) {
    client.connect(car_port, function () {
      console.log(`Connected to car server: ${client.remoteAddress}:${car_port}`);
    });
  }
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
  timestamp ++;
  if(timestamps.length > xAxisCap) {
    timestamps.pop();
  }
  solarCarData["timestamps"] = timestamps;

  for (const property in DATA_FORMAT) {
    let dataArray = []; // Holds the array of data specified by property that will be put in solarCarData
    let dataType = ""; // Data type specified in the data format

    if(solarCarData.hasOwnProperty(property)) {
      dataArray = solarCarData[property];
    }
    dataType = DATA_FORMAT[property][1];

    // Add the data from the buffer to solarCarData
    switch (dataType) {
      case "uint8":
        // Add the data to the front of dataArray
        dataArray.unshift(data.readUInt8(buffOffset));
        break;
      case "float":
        // Add the data to the front of dataArray
        dataArray.unshift(data.readFloatLE(buffOffset));
        break;
      case "char":
        // Add the data to the front of dataArray
        dataArray.unshift(String.fromCharCode(data.readUInt8(buffOffset)));
        break;
      case "bool":
        // Add the data to the front of dataArray
        dataArray.unshift(Boolean(data.readUInt8(buffOffset)));
        break;
      default:
        break;
    }
    // Limit dataArray to a length specified by xAxisCap
    if(dataArray.length > xAxisCap) {
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
