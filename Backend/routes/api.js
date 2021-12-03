const express = require("express");
const router = express.Router();

const DATA_FORMAT = require("../Data/sc1-data-format/format.json");
const SOLAR_CAR_DATA = require("../Data/dynamic_data.json");
let FRONTEND_DATA = require("../Data/cache_data.json");

/**
 * Unpacks a Buffer and updates the data to be passed to the front-end
 *
 * @param data the data to be unpacked
 */
function unpackData(data) {
    let buffOffset = 0; // Byte offset for the buffer array
    let dataType = ""; // Data type specified in the data format json

    for(const property in DATA_FORMAT) {
        dataType = DATA_FORMAT[property][1];

        // Add the data from the buffer to SOLAR_CAR_DATA
        switch(dataType) {
            case("uint8"):
                // Read value from data, add it to SOLAR_CAR_DATA, and
                // increment offset by one byte
                SOLAR_CAR_DATA[property] = data.readUInt8(buffOffset++);
                break;
            case("float"):
                // Read value from data and add it to SOLAR_CAR_DATA
                SOLAR_CAR_DATA[property] = data.readFloatBE(buffOffset);
                // Increment offset by four bytes
                buffOffset += 4;
                break;
            case("char"):
                // Read value from data, add it to SOLAR_CAR_DATA, and increment offset by
                // one byte
                SOLAR_CAR_DATA[property] = String.fromCharCode(data.readUInt8(buffOffset++));
                break;
            case("bool"):
                // Read value from data, add it to SOLAR_CAR_DATA, and
                // increment offset by one byte
                SOLAR_CAR_DATA[property] = Boolean(data.readUInt8(buffOffset++));
                break;
            default:
                break;
        }
    }

    // Update the data to be passed to the front-end
    FRONTEND_DATA = SOLAR_CAR_DATA;
}

router.get("/api", (req, res) => {
    res.send({ response: FRONTEND_DATA }).status(200);
});

module.exports = router;

//--------------TCP-------------------------

let net = require('net');
const { Buffer } = require('buffer');
let car_port = 4003;
var client = new net.Socket();

client.connect(car_port, function () {
    console.log(`Connected to car server:${car_port}`);
});

client.on('data', function (data) {
    console.log('Received: ', data);
    unpackData(data);
    // client.destroy(); //kill client after server's response
});

client.on('close', function () {
    console.log(`Connection to car server (${car_port}) is closed`);
});
