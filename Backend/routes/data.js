const express = require("express");
const router = express.Router();

data = {
    CarName: "BadgerLoop",
    speed: 500,
    power: 200,

}
router.get("/api", (req, res) => {
    res.send({ response: data }).status(200);
});

module.exports = router;
