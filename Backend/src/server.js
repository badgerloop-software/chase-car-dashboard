import express from "express";
import { createServer } from "http";
import index from "./routes/api.js";

const PORT = 4001;
const APP = express();
APP.use(index);

const SERVER = createServer(APP);

SERVER.listen(PORT, () => console.log(`Listening on port ${PORT}`));
