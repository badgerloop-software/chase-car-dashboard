"use strict";

var _format = _interopRequireDefault(require("../../Backend/Data/sc1-data-format/format.json"));

var _buffer = require("buffer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const express = require("express");
// const http = require("http");
// const car = require("./car");
const net = require("net"); // const port = 4003;
// const app = express()
// const server = http.createServer(app);
// const carSimulator = new Car()
// carSimulator.start()
// server.listen(port, () => console.log(`Listening on port ${port}`));
//-----------TCP-------------


const port = 4003; // Calculate the number of bytes to allocate for the Buffer

let bytes = 0;

for (const property in _format.default) {
  bytes += _format.default[property][0];
}

let buf1 = _buffer.Buffer.alloc(bytes, 0); // Fill a buffer of the correct size with zeros


let nextValue = 0;
let buffOffset = 0;
const server = net.createServer(socket => {
  console.log("New connection :)");
  let interval;

  function exit() {
    clearInterval(interval);
    socket.destroy();
    console.log("socket successfully destroyed");
  }

  socket.on("error", error => {
    console.warn("socket errored", error);
    exit();
  });
  socket.on("close", close => {
    console.warn("socket closed", close);
    exit();
  });
  socket.on("end", () => {
    console.warn("socket ended");
    exit();
  });
  interval = setInterval(() => {
    buffOffset = 0; // Offset when adding each value to buf1

    nextValue = (nextValue + 1) % 100; // Generate a new value
    // Fill buf1 with new data according to the data format file

    for (const property in _format.default) {
      // Add the next value to the Buffer based on the data type
      switch (_format.default[property][1]) {
        case "uint8":
          buf1.writeUInt8(nextValue, buffOffset);
          break;

        case "float":
          buf1.writeFloatBE(nextValue + 0.125, buffOffset);
          break;

        case "char":
          buf1.writeUInt8(nextValue, buffOffset);
          break;

        case "bool":
          buf1.writeUInt8(nextValue % 2, buffOffset);
          break;

        default:
          // Fill the correct number of bytes with the next value if its type is not listed above
          buf1.fill(nextValue, buffOffset, buffOffset + _format.default[property][0]);
          break;
      } // Increment offset by amount specified in data format json


      buffOffset += _format.default[property][0];
    }

    socket.write(buf1); // socket.pipe(socket);
  }, 500);
});
server.on("error", err => {
  console.warn("An error has occurred:", err);
});
server.listen(port, () => {
  console.log("Waiting for connection ..."); // console.log("Data:",buf1)
});