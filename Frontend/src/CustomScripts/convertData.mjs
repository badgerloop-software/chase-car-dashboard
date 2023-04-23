import { writeFileSync } from "fs";
import SC1DataFormat from "../../../Backend/Data/sc1-data-format/format.json" assert { type: "json" };
import OldGraphData from "../Components/Graph/graph-data.json" assert { type: "json" };

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

// flatpack the old graph data to easily access old data
const allDatasets = OldGraphData.categories.flatMap(
  (category) => category.values
);
// console.log(allDatasets);

// the JSON list of categories to be written to the file
const categories = [{
  category: "Software;Communication",
  values: []
}];

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

// add solar_car_connection dataset
categories
  .find((category) => category.category === "Software;Communication")
  .values.push({
    key: "solar_car_connection",
    name: "Solar Car Connection",
    unit: "",
    min: 0,
    max: 1,
  });

// the default history length, in seconds
const defaultHistoryLength = OldGraphData.defaultHistoryLength ?? 60;

// create the JSON object
const json = { categories, defaultHistoryLength };

// write this JSON object
const output = JSON.stringify(json, null, 2);

const cats = json.categories
let newCategories = []

for (let i = 0; i < cats.length; i++) {
  let res = cats[i].category.split(';')

  let c = res[0]
  let subc = res[1]
  let ind = undefined;
  for (let j = 0; j < newCategories.length; j++) {
    if (newCategories[j].category.localeCompare(c) == 0) {
      ind = j
      break
    }
  }

  if (ind) {
    newCategories[ind].subcategories.push({
      'subcategory': subc,
      'values': cats[i]['values']
    })
  } else {
    newCategories.push({
      'category': c,
      'subcategories': [
        {
          'subcategory': subc,
          'values': cats[i]['values']
        }
      ]
    })
  }
}

// console.log(newCategories)

const newFileOutput = {
  'Input': 'summary',
  'key': ['size, type, units, min, max', "category;subcategory"],
  'Output': newCategories
}
// console.log(output);
writeFileSync("./Frontend/src/Components/Graph/graph-data1.json", JSON.stringify(newFileOutput, null, 2));

// export {};
