const express = require("express");
const http = require("http");
const { Car } = require("./Car")
var net = require('net');

// const port = 4003;

// const app = express()
// const server = http.createServer(app);

// const carSimulator = new Car()
// carSimulator.start()

// server.listen(port, () => console.log(`Listening on port ${port}`));

//-----------TCP-------------
const port = 4003;

const { Buffer } = require('buffer');
const buf1 = Buffer.alloc(10,1);

const server = net.createServer(function(socket) {
	console.log("New connection")

	setInterval(()=>{
		socket.write(buf1);
		socket.pipe(socket);
	}, 500);
	

 
});

server.listen(port, ()=>{
	console.log("Waiting for connection ...")
	// console.log("Data:",buf1)
});



