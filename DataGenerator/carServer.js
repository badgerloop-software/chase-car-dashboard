const express = require("express");
const http = require("http");
const { Car } = require("./Car")

const port = 4003;
// const index = require("./routes/api");

const app = express()
// app.use(index);

const server = http.createServer(app);

const carSimulator = new Car()


carSimulator.start()



server.listen(port, () => console.log(`Listening on port ${port}`));