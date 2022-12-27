import express from "express";
import { createServer } from "http";
import index from "./routes/api.js";
import IMPORTED_CONSTANTS from "../src/constants.json";

const PORT = IMPORTED_CONSTANTS.PORT;
const APP = express();
APP.use(index);

const SERVER = createServer(APP);

SERVER.listen(PORT, () => console.log(`Listening on port ${PORT}`));
