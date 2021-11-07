const express = require("express");
const router = express.Router();
const JSON_DATA = require("../package.json");
const SOLAR_CAR_DATA = require("../Data/cache_data.json");

function writeJsonFile() {
    SOLAR_CAR_DATA.power += 1;
}
setInterval(writeJsonFile, 2000);

router.get("/api", (req, res) => {
    res.send({ response: SOLAR_CAR_DATA }).status(200);
});

module.exports = router;
