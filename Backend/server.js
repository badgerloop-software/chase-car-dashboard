const express = require("express");
const http = require("http");

const port = 4001;
const index = require("./routes/api");

const app = express()
app.use(index);

const server = http.createServer(app);

server.listen(port, () => console.log(`Listening on port ${port}`));


//--------------TCP-------------------------

let net = require('net');
let car_port = 4003;
var client = new net.Socket();
client.connect(car_port, function () {
    console.log(`Connected to car server:${car_port}`);
});

client.on('data', function (data) {
    console.log('Received: ', data);
    // client.destroy(); //kill client after server's response
});

client.on('close', function () {
    console.log(`Connection to car server (${car_port}) is closed`);
});
