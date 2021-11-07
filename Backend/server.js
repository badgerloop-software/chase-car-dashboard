const express = require("express");
const http = require("http");

const port = 4001;
const index = require("./routes/data");

const app = express()
app.use(index);

const server = http.createServer(app);



server.listen(port, () => console.log(`Listening on port ${port}`));
