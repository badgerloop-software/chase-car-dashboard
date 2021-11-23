const e = require("express");

class Car {
    constructor() {
        this.power = 10;
        this.charge = 0;
        this.solarCharge = 0;
        this.state = "P";
        this.speed = 100;
        this.speedChanger = 0;

        this.motorPower = 0;
        this.netPower = 0;

        this.milesLeft = 30;

        this.batteryTemp = 18;
        this.motorTemp = 19;
        this.motorControllerTemp = 15;

        this.lowBattery = false;
        this.bpsFault = false;
        this.eStop = false;

        this.communications = false;
        this.cruiseControl = false

        this.leftTurn = false;
        this.rightTurn = false;

        this.frontLeftTP = 30;
        this.frontRightTP = 30;
        this.backtLeftTP = 30;
        this.backRightTP = 30;

    }
    start() {


        setInterval(() => {
            // - lights on

            // - dashboard status indicators on
            // - solar panel starts charging

            this.netPower = this.solorPower + this.power;
            this.solar()
            this.startCharging()
            this.drive()
        }, 500);
    }

    startCharging() {
        this.power += this.solorPower;
    }

    solar() {
        this.solorPower += Math.sin(this.speedChanger++);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    drive() {
        //- state(N/D/P)

        if (this.state === "D") {
            console.log("D...")
            setTimeout(() => {
                this.state = "N"
            }, 60000)
        } else {
            if (this.getRandomInt(3) === 0) {
                this.state = "P"
            } else if (this.getRandomInt(3) === 1) {
                this.state = "N"
            } else if (this.getRandomInt(3) === 2) {
                this.state = "D"
            }

        }

        if (this.state === "D") {
            this.motorPower += 30*Math.sin(this.speedChanger++)
            this.speed += Math.round(Math.cos(this.motorPower))
            console.log("driving...", this.speed)
        } else if (this.state === "P") {
            console.log("Parking...")
        } else if (this.state === "N") {
            console.log("Nuetral...")
        }
    }


}

module.exports = { Car }
