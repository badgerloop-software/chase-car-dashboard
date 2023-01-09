import express from "express";
import { createServer } from "http";
import {index, createAutomaticRecording} from "./routes/api.js";
import cors from 'cors';
import { create } from "domain";

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

const prompt = require('prompt-sync')({sigint: true})

const SERVER = createServer(APP);

SERVER.listen(PORT, () => {
  let recordFlag = Boolean(process.env.RECORDING);
  let customNameFlag = process.env.NOCUSTOMNAME === "0" ? false : true;
  console.debug(`Recording? ${recordFlag} Custom Name? ${customNameFlag}`)
  console.log(`Listening on port ${PORT}`)
  if (recordFlag) {
    var filename;
    if (!customNameFlag) {
      filename = prompt("Enter a filename: ").trim();
      // Clean filename to replace spaces with -
      filename = filename.replace(/ /g, "-");
    }
    createAutomaticRecording(filename);
  }
});
