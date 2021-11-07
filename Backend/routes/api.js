const express = require("express");
const router = express.Router();
const JSON_DATA = require("../package.json");
const SOLAR_CAR_DATA = require("../Data/cache_data.json");
let pow = 100
let newPow = 0

console.log(Object.keys(SOLAR_CAR_DATA))
function writeJsonFile() {
       
    SOLAR_CAR_DATA.power = pow + Math.sin(newPow++);
    carDataGen()
  
   
}

function carDataGen(){

}

setInterval(writeJsonFile, 1000);

router.get("/api", (req, res) => {
    res.send({ response: SOLAR_CAR_DATA }).status(200);
});

module.exports = router;
