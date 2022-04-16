import { writeFileSync } from "fs";
import DATA_FORMAT from "../../../Backend/Data/sc1-data-format/format.json" assert { type: "json" };

const constantsJson = {};

// Loop through data labels in data format
for(const property in DATA_FORMAT) {
    // If the current property is timestamp data, skip it
    if (property.startsWith("tstamp")) continue;

    // Get list of info for current property/piece of data
    const [, , unit, min, max,] = DATA_FORMAT[property];

    // Add current property and its list of info/constants to JSON
    constantsJson[property] = {
        "UNIT": unit,
        "MIN": min,
        "MAX": max
    };
}

// Write JSON to file
writeFileSync("./src/data-constants.json", JSON.stringify(constantsJson, null, 4));
