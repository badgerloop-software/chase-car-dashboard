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
    SOLAR_CAR_DATA.speed = spd + Math.round(Math.sin(newSpd++));
    SOLAR_CAR_DATA.power = pow + Math.round(Math.sin(newPow++));
    SOLAR_CAR_DATA.charge = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.netPower = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.motorPower = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.milesLeft = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.batteryTemp = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.motorTemp = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.motorControllerTemp = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.frontLeftTP = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.frontRightTP = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.backLeftTP = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.backRightTP = chg + Math.round(Math.sin(newChg++));
    SOLAR_CAR_DATA.state = "D";
}

setInterval(writeFrontendData, 500);

router.get("/api", (req, res) => {
    res.send({ response: FRONTEND_DATA }).status(200);
});

module.exports = router;
