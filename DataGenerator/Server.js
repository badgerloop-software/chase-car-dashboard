const express = require("express");
const http = require("http");
const { Car } = require("./Car");
var net = require('net');

// const port = 4003;

// const app = express()
// const server = http.createServer(app);

// const carSimulator = new Car()
// carSimulator.start()

// server.listen(port, () => console.log(`Listening on port ${port}`));

//-----------TCP-------------
const DATA_FORMAT = require("../Backend/Data/sc1-data-format/format.json");
const port = 4003;

// Calculate the number of bytes to allocate for the Buffer
let bytes = 0;
for(const property in DATA_FORMAT) {
	bytes += DATA_FORMAT[property][0];
}

const { Buffer } = require('buffer');
let buf1 = Buffer.alloc(bytes, 0); // Fill a buffer of the correct size with zeros
let nextValue = 0;
let buffOffset = 0;

const server = net.createServer(function(socket) {
	console.log("New connection :)")

	setInterval(()=>{
		buffOffset = 0; // Offset when adding each value to buf1
		nextValue = (nextValue+1)%100; // Generate a new value

		// Fill buf1 with new data according to the data format file
		for(const property in DATA_FORMAT) {
			// Add the next value to the Buffer based on the data type
			switch(DATA_FORMAT[property][1]) {
				case("uint8"):
					buf1.writeUInt8(nextValue, buffOffset);
					break;
				case("float"):
					buf1.writeFloatBE(nextValue+0.125, buffOffset);
					break;
				case("char"):
					buf1.writeUInt8(nextValue, buffOffset);
					break;
				case("bool"):
					buf1.writeUInt8(nextValue%2, buffOffset);
					break;
				default:
					// Fill the correct number of bytes with the next value if its type is not listed above
					buf1.fill(nextValue, buffOffset, buffOffset + DATA_FORMAT[property][0]);
					break;
			}
			// Increment offset by amount specified in data format json
			buffOffset += DATA_FORMAT[property][0];
		}

		socket.write(buf1);
		// socket.pipe(socket);
	}, 500);
});

server.listen(port, ()=>{
	console.log("Waiting for connection ...")
	// console.log("Data:",buf1)
});
