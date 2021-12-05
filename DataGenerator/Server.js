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
let i = 0;
let buf1 = Buffer.alloc(bytes, 0);

const server = net.createServer(function(socket) {
	console.log("New connection :)")

	setInterval(()=>{
		/*Psuedocode: Automatically populating a Buffer of the correct length with groups of bytes in the correct order
		              (speed, charge, solarPower, etc.) and formats (float, char, uint8, etc.) that represent random values from 0-100
		for(const property in DATA_FORMAT) {
			randomVal = (i++)%101;
			buf1.appendByteGroup(randomVal.toByteGroup(DATA_FORMAT[property][1]));
		}*/
		buf1 = Buffer.alloc(bytes, (i++)%101); // 52 bytes (currently) in byte array format; wrap values so they don't exceed 100
		socket.write(buf1);
		// socket.pipe(socket);
	}, 500);
});

server.listen(port, ()=>{
	console.log("Waiting for connection ...")
	// console.log("Data:",buf1)
});
