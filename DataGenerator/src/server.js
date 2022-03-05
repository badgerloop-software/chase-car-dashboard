// const express = require("express");
// const http = require("http");
// const car = require("./car");
const net = require("net");

// const port = 4003;

// const app = express()
// const server = http.createServer(app);

// const carSimulator = new Car()
// carSimulator.start()

// server.listen(port, () => console.log(`Listening on port ${port}`));

//-----------TCP-------------
import DATA_FORMAT from "../../Backend/Data/sc1-data-format/format.json";
const port = 4003;

// Calculate the number of bytes to allocate for the Buffer
let bytes = 0;
for (const property in DATA_FORMAT) {
  bytes += DATA_FORMAT[property][0];
}

import { Buffer } from "buffer";
let buf1 = Buffer.alloc(bytes, 0); // Fill a buffer of the correct size with zeros
let nextValue = 1;
let buffOffset = 0;

const server = net.createServer((socket) => {
  console.log("New connection :)");

  let interval;
  function exit() {
    clearInterval(interval);
    socket.destroy();
    console.log("socket successfully destroyed");
  }

  socket.on("error", (error) => {
    console.warn("socket errored", error);
    exit();
  });
  socket.on("close", (close) => {
    console.warn("socket closed", close);
    exit();
  });
  socket.on("end", () => {
    console.warn("socket ended");
    exit();
  });

  interval = setInterval(() => {
    buffOffset = 0; // Offset when adding each value to buf1

    const time = new Date();
    // console.log(time);

    // Fill buf1 with new data according to the data format file
    for (const property in DATA_FORMAT) {
      // special values: RTC timestamps
      if (property === "rtc_hr") {
        buf1.writeUInt8(time.getHours(), buffOffset);
        // buf1.writeUInt8(7, buffOffset);

        // Increment offset by amount specified in data format json
        buffOffset += DATA_FORMAT[property][0];
        continue;
      }
      if (property === "rtc_mn") {
        buf1.writeUInt8(time.getMinutes(), buffOffset);
        // buf1.writeUInt8(27, buffOffset);

        // Increment offset by amount specified in data format json
        buffOffset += DATA_FORMAT[property][0];
        continue;
      }
      if (property === "rtc_sc") {
        buf1.writeUInt8(time.getSeconds(), buffOffset);
        // buf1.writeUInt8(27, buffOffset);

        // Increment offset by amount specified in data format json
        buffOffset += DATA_FORMAT[property][0];
        continue;
      }

      // Generate a new value
      nextValue = Math.abs(Math.sin(nextValue)) * 100;

      // Add the next value to the Buffer based on the data type
      switch (DATA_FORMAT[property][1]) {
        case "uint8":
          buf1.writeUInt8(Math.round(nextValue), buffOffset);
          break;
        case "float":
          buf1.writeFloatBE(Math.floor(nextValue) + 0.125, buffOffset);
          break;
        case "char":
          buf1.writeUInt8(Math.round(nextValue), buffOffset);
          break;
        case "bool":
          buf1.writeUInt8(Math.round(nextValue) % 2, buffOffset);
          break;
        default:
          // Fill the correct number of bytes with the next value if its type is not listed above
          buf1.fill(
            nextValue,
            buffOffset,
            buffOffset + DATA_FORMAT[property][0]
          );
          break;
      }
      // Increment offset by amount specified in data format json
      buffOffset += DATA_FORMAT[property][0];
    }

    socket.write(buf1);
    // socket.pipe(socket);
  }, 500);
});

server.on("error", (err) => {
  console.warn("An error has occurred:", err);
});

server.listen(port, () => {
  console.log("Waiting for connection ...");
  // console.log("Data:",buf1)
});
