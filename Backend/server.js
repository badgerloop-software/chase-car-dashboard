const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = 4001;
const index = require("./routes/data");

const app = express()
app.use(index);

const server = http.createServer(app);



server.listen(port, () => console.log(`Listening on port ${port}`));
