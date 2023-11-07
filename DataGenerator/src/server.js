import DATA_FORMAT from "../../Backend/Data/sc1-data-format/format.json";
import { DateTime } from "luxon";
import CONSTANTS from "../src/constants.json";
const NET = require("net");
const PORT = CONSTANTS.PORT; // Port for TCP connection

// Calculate the number of bytes to allocate for the Buffer
let bytes = 0;
for (const property in DATA_FORMAT) {
  bytes += DATA_FORMAT[property][0];
}

import { Buffer } from "buffer";
import {t} from "@babel/core/lib/vendor/import-meta-resolve";
let buf1 = Buffer.alloc(bytes+9, 0); // Fill a buffer of the correct size with zeros
let nextValue = 1;
let buffOffset = 0;

const SERVER = NET.createServer((socket) => {
  console.log("New connection :)");

  let interval;
  // stop writing data and destroy the socket
  function exit() {
    clearInterval(interval);
    socket.destroy();
    console.log("socket successfully destroyed");
  }

  // Error, connection closed, and connection ended listener
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

  // Pack and send a buffer at half second intervals
  interval = setInterval(() => {
    buffOffset = 4; // Offset when adding each value to buf1

    // const time = DateTime.now().minus(30_000); // thirty seconds in the past
    const time = DateTime.now();
    // console.log(time);
    //write start symbol
    buf1.write("<bl>")
    // Fill buf1 with new data according to the data format file
    for (const property in DATA_FORMAT) {
      // Generate a new value
      nextValue = Math.abs(Math.sin(nextValue)) * 100;

      // Add the next value to the Buffer based on the data type
      switch (DATA_FORMAT[property][1]) {
        case "float":
          buf1.writeFloatLE(Math.floor(nextValue) + 0.125, buffOffset);
          break;
        case "char":
          buf1.writeUInt8(Math.round(nextValue), buffOffset);
          break;
        case "bool":
          // Using % 2, write 1 or 0 (true or false) to Buffer
          // (i.e. writing true or false to Buffer based on whether nextValue (rounded) is odd or even)
          buf1.writeUInt8(Math.round(nextValue) % 2, buffOffset);
          break;
        case "uint8":
          // special values: Solar car dashboard time received (hours, minutes, and seconds)
          if (property === "tstamp_hr") {
            buf1.writeUInt8(time.get("hour"), buffOffset);
            break;
          }
          if (property === "tstamp_mn") {
            buf1.writeUInt8(time.get("minute"), buffOffset);
            break;
          }
          if (property === "tstamp_sc") {
            buf1.writeUInt8(time.get("second"), buffOffset);
            break;
          }
          buf1.writeUInt8(Math.round(nextValue), buffOffset);
          break;
        case "uint16":
          // special value: Solar car dashboard time received (milliseconds)
          if (property === "tstamp_ms") {
            buf1.writeUInt16LE(time.get("millisecond"), buffOffset);
            break;
          }
          buf1.writeUInt16LE(Math.round(nextValue), buffOffset);
          break;
        case "uint64":
          if (property === "tstamp_unix") {
            buf1.writeBigUInt64LE(BigInt(time), buffOffset);
            break;
          }
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
    //write end symbol
    buf1.write("</bl>",buffOffset)
    socket.write(buf1);
  }, 34);
});

// Error listener
SERVER.on("error", (err) => {
  console.warn("An error has occurred:", err);
});

// Listen for connections on specified port
SERVER.listen(PORT, () => {
  console.log("Waiting for connection ...");
});
