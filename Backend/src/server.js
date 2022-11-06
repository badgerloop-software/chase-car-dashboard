import express from "express";
import { createServer } from "http";
import index from "./routes/api.js";
import cors from 'cors';
import CONSTANTS from "../src/constants.json";
import bodyParser  from "body-parser";

const PORT = CONSTANTS.PORT;
const APP = express();
  
APP.use(bodyParser.json());
APP.use(cors({
    // Accepted Origin
    origin: 'http://localhost:3000'
}));
APP.use(index);

const SERVER = createServer(APP);

SERVER.listen(PORT, () => console.log(`Listening on port ${PORT}`));
