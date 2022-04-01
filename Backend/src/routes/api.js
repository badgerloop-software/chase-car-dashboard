import { Router } from "express";
import { Socket } from "net";
import INITIAL_FRONTEND_DATA from "../../Data/cache_data.json";
import INITIAL_SOLAR_CAR_DATA from "../../Data/dynamic_data.json";
import DATA_FORMAT from "../../Data/sc1-data-format/format.json";

const ROUTER = Router();
let solarCarData = INITIAL_SOLAR_CAR_DATA,
  frontendData = INITIAL_FRONTEND_DATA;

// Send data to front-end
ROUTER.get("/api", (req, res) => {
  res.send({ response: frontendData }).status(200);
});

export default ROUTER;

const CAR_PORT = 4003; // Port for TCP connection
const CAR_SERVER = "localhost"; // TCP server's IP address (Replace with pi's IP address to connect to pi)
var client = new Socket();

// Initiate connection
client.connect(CAR_PORT, CAR_SERVER, function () {
  console.log(`Connected to car server: ${client.remoteAddress}:${CAR_PORT}`);
});

// Data received listener: Log and unpack data when it's received
client.on("data", function (data) {
  console.log(data);
  unpackData(data);
});

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
        // Add char to the front of dataArray
        dataArray.unshift(String.fromCharCode(data.readUInt8(buffOffset)));
        break;
      case "bool":
        // Add bool to the front of dataArray
        dataArray.unshift(Boolean(data.readUInt8(buffOffset)));
        break;
      case "uint8":
        if (property === "tstamp_hr") {
          timestamps[0] = data.readUInt8(buffOffset) + timestamps[0];
          break;
        }
        if (property === "tstamp_mn") {
          timestamps[0] = timestamps[0].replace(
            "::",
            ":" + data.readUInt8(buffOffset) + ":"
          );
          break;
        }
        if (property === "tstamp_sc") {
          timestamps[0] = timestamps[0].replace(
            ":.",
            ":" + data.readUInt8(buffOffset) + "."
          );
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
        // Log if an unexpected type is specified in the data format
        console.log(
          `No case for unpacking type ${dataType} (type specified for ${property} in format.json)`
        );
        break;
    }

    if (!property.startsWith("tstamp")) {
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
