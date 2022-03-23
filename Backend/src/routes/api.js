import { Router } from "express";
import { DateTime } from "luxon";
import { Socket } from "net";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";

const router = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA,
  frontendData = INITIAL_FRONTEND_DATA;

// Send data to front-end
router.get("/api", (req, res) => {
  res.send({ response: frontendData }).status(200);
});

export default router;

//--------------TCP-------------------------

// const { Buffer } = require("buffer");
const car_port = 4003;
var client = new Socket();

client.connect(car_port, function () {
  console.log(`Connected to car server: localhost:${car_port}`);
});

client.on("data", function (data) {
  console.log("Received: ", data);
  unpackData(data);
  // client.destroy(); //kill client after server's response
});

client.on("close", function () {
  console.log(`Connection to car server (${car_port}) is closed`);
});

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
  // timestamps.unshift(DateTime.now().toString());

  // Add separators for timestamp to timestamps and limit array's length
  timestamps.unshift("::.");
  if (timestamps.length > xAxisCap) {
    timestamps.pop();
  }

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
        // Add the data to the front of dataArray
        dataArray.unshift(String.fromCharCode(data.readUInt8(buffOffset)));
        break;
      case "bool":
        // Add the data to the front of dataArray
        dataArray.unshift(Boolean(data.readUInt8(buffOffset)));
        break;
      case "uint8":
        if (property === "tstamp_hr") {
          timestamps[0] = data.readUInt8(buffOffset) + timestamps[0];
          break;
        }
        if (property === "tstamp_mn") {
          timestamps[0] = timestamps[0].replace("::", ":" + data.readUInt8(buffOffset) + ":");
          break;
        }
        if (property === "tstamp_sc") {
          timestamps[0] = timestamps[0].replace(":.", ":" + data.readUInt8(buffOffset) + ".");
          break;
        }
        // Add the data to the front of dataArray
        dataArray.unshift(data.readUInt8(buffOffset));
        break;
      case "uint16":
        if (property === "tstamp_ms") {
          timestamps[0] += data.readUInt16BE(buffOffset);
          break;
        }
        // Add the data to the front of dataArray
        dataArray.unshift(data.readUInt16BE(buffOffset));
        break;
      default:
        break;
    }

    if(!property.startsWith("tstamp")) {
      // If property is not used for timestamps
      // Limit dataArray to a length specified by xAxisCap
      if (dataArray.length > xAxisCap) {
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
