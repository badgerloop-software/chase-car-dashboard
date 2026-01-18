import { writeFileSync } from "fs";
import DATA_FORMAT from "../../../Backend/Data/sc1-data-format/format.json" with { type: "json" };

const constantsJson = {};

/**
 * Processes the unit values taken directly from the data format JSON to a more human-readable format.
 * @param {string} unit the unit value to format
 * @returns {string} the formatted unit value
 */
function expandUnit(unit) {
    // deg => °; ohm => Ω; ^2 => ²
    return unit.replace(/(?<deg>deg)|(?<ohm>[Oo]hm)|(?<square>\^2)/gm, (match, deg, ohm, square) => {
        switch(match) {
            case deg:
                return "°";
            case ohm:
                return "Ω";
            case square:
                return "²";
            default:
                return "";
        }
    });
}

// Loop through data labels in data format
for(const property in DATA_FORMAT) {
    // If the current property is timestamp data, skip it
    if(property.startsWith("tstamp")) continue;

    // Get list of info for current property/piece of data
    const [, , unit, min, max,] = DATA_FORMAT[property];

    // Add current property and its list of info/constants to JSON
    constantsJson[property] = {
        "UNIT": expandUnit(unit),
        "MIN": min,
        "MAX": max
    };
}

// Write JSON to file
writeFileSync("./src/data-constants.json", JSON.stringify(constantsJson, null, 4));
