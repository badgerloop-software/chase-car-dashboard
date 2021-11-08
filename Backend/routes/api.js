const express = require("express");
const router = express.Router();
const JSON_DATA = require("../package.json");
const SOLAR_CAR_DATA = require("../Data/dynamic_data.json");
let FRONTEND_DATA = require("../Data/cache_data.json");
let pow = 100;
let newPow = 0;
let spd = 35;
let newSpd = 0;
let chg = 50;
let newChg = 0;

console.log(Object.keys(SOLAR_CAR_DATA));

function writeFrontendData() {
    carDataGen();
    FRONTEND_DATA = SOLAR_CAR_DATA;
}

function carDataGen() {
    SOLAR_CAR_DATA.speed = spd + Math.sin(newSpd++);
    SOLAR_CAR_DATA.power = pow + Math.sin(newPow++);
    SOLAR_CAR_DATA.charge = chg + Math.sin(newChg++);
}

setInterval(writeFrontendData, 500);

router.get("/api", (req, res) => {
    res.send({ response: FRONTEND_DATA }).status(200);
});

module.exports = router;
