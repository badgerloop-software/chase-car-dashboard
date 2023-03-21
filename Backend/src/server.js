import express from "express";
import { createServer } from "http";
import index from "./routes/api.js";
import cors from 'cors';
import CONSTANTS from "../src/constants.json";

const PORT = CONSTANTS.PORT;
const APP = express();
const bodyParser = require('body-parser');
APP.use(bodyParser.json());
APP.use(cors({
    // Accepted Origin
    origin: 'http://localhost:3000'
}));
APP.use(index);

const SERVER = createServer(APP);

SERVER.listen(PORT, () => console.log(`Listening on port ${PORT}`));
