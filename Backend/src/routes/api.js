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
  let dataType = ""; // Data type specified in the data format json

  for (const property in DATA_FORMAT) {
    dataType = DATA_FORMAT[property][1];

    // Add the data from the buffer to SOLAR_CAR_DATA
    switch (dataType) {
      case "uint8":
        solarCarData[property] = data.readUInt8(buffOffset);
        break;
      case "float":
        solarCarData[property] = data.readFloatBE(buffOffset);
        break;
      case "char":
        solarCarData[property] = String.fromCharCode(
          data.readUInt8(buffOffset)
        );
        break;
      case "bool":
        solarCarData[property] = Boolean(data.readUInt8(buffOffset));
        break;
      default:
        break;
    }

    // Increment offset by amount specified in data format json
    buffOffset += DATA_FORMAT[property][0];
  }

  // Update the data to be passed to the front-end
  frontendData = solarCarData;
}
