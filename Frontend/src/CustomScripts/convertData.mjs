import { writeFileSync } from "fs";
import SC1DataFormat from "../../../Backend/Data/sc1-data-format/format.json" assert { type: "json" };
import OldGraphData from "../Components/Graph/graph-data.json" assert { type: "json" };

/**
 * Processes the unit values taken directly from the data format JSON to a more human-readable format.
 * @param {string} unit the unit value to format
 * @returns {string} the formatted unit value
 */
function expandUnit(unit) {
  return unit.replaceAll("degC", "°C"); // degC => °C
}

// flatpack the old graph data to easily access old data
const allDatasets = OldGraphData.categories.flatMap(
  (category) => category.values
);
// console.log(allDatasets);

// the JSON list of categories to be written to the file
const categories = [];

// go through every item in the data format
for (const key of Object.keys(SC1DataFormat)) {
  // skip timestamp data
  if (key.startsWith("tstamp")) continue;

  // destructure the list stored in the data format
  const [, , unit, min, max, category] = SC1DataFormat[key];

  // find the category that this goes into
  const categoryIdx = categories.findIndex((c) => c.category === category);
  //   console.log("Looking for", category, "in", categories, ":", categoryIdx);

  // check old data to see if can recycle name
  const oldName = allDatasets.find((dataset) => dataset.key === key)?.name;
  // create the new listing
  const listing = {
    key,
    name: oldName ?? key,
    unit: expandUnit(unit),
    min,
    max,
  };

  if (categoryIdx === -1) {
    // doesn't exist = create new category
    categories.push({
      category,
      values: [listing],
    });
  } else {
    categories[categoryIdx].values.push(listing);
  }
}

// the default history length, in seconds
const defaultHistoryLength = OldGraphData.defaultHistoryLength ?? 60;

// create the JSON object
const json = { categories, defaultHistoryLength };

// write this JSON object
const output = JSON.stringify(json, null, 2);
// console.log(output);
writeFileSync("./src/Components/Graph/graph-data.json", output);

// export {};
