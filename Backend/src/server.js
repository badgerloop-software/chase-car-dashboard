import express from "express";
import { createServer } from "http";
import index from "./routes/api.js";
import cors from 'cors';
// var cors = require('cors');


const PORT = 4001;
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
