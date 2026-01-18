import { writeFileSync } from "fs"
import SC1DataFormat from "../../../Backend/Data/sc1-data-format/format.json" with { type: "json" }
import OldGraphData from "../Components/Graph/graph-data.json" with { type: "json" }

/**
 * Processes the unit values taken directly from the data format JSON to a more human-readable format.
 * @param {string} unit the unit value to format
 * @returns {string} the formatted unit value
 */
function expandUnit(unit) {
  // deg => °; ohm => Ω; ^2 => ²
  return unit.replace(/(?<deg>deg)|(?<ohm>[Oo]hm)|(?<square>\^2)/gm, (match, deg, ohm, square) => {
    switch (match) {
      case deg:
        return "°"
      case ohm:
        return "Ω"
      case square:
        return "²"
      default:
        return ""
    }
  })
}

// flatpack the old graph data to easily access old data
const temp = OldGraphData.Output.flatMap(
  (category) => category.subcategories
)

const allDatasets = temp.flatMap(
  (subcategory) => subcategory.values
)

// the JSON list of categories to be written to the file
let categories = [{
  "category": "Software",
  "subcategories": [
    {
      "subcategory": "Communication",
      "values": [
        {
          "key": "solar_car_connection",
          "name": "Solar Car Connection",
          "unit": "",
          "min": 0,
          "max": 1
        }
      ]
    }
  ]
}]

// go through every item in the data format
for (const key of Object.keys(SC1DataFormat)) {
  // skip timestamp data
  if (key.startsWith("tstamp")) continue

  // destructure the list stored in the data format
  const [, , unit, min, max, category] = SC1DataFormat[key]

  // check old data to see if can recycle name
  const oldName = allDatasets.find((dataset) => dataset.key === key)?.name
  // create the new listing
  const listing = {
    key,
    name: oldName ?? key,
    unit: expandUnit(unit),
    min,
    max,
  }

  let res = category.split(';')

  let c = res[0]
  let subc = res[1]
  const ind = categories.findIndex((cat) => cat.category === c)

  if (ind !== -1) {
    const subInd = categories[ind].subcategories.findIndex((sc) => sc.subcategory === subc)
    
    if (subInd !== -1) {
      categories[ind].subcategories[subInd].values.push(listing)
    } else {
      categories[ind].subcategories.push({
        'subcategory': subc,
        'values': [listing]
      })
    }
  } else {
    categories.push({
      'category': c,
      'subcategories': [
        {
          'subcategory': subc,
          'values': [listing]
        }
      ]
    })
  }
}

// the default history length, in seconds
const defaultHistoryLength = OldGraphData.defaultHistoryLength ?? 60

const newFileOutput = {
  'Output': categories,
  'defaultHistoryLength': defaultHistoryLength
}
// console.log(output)
writeFileSync("./src/Components/Graph/graph-data.json", JSON.stringify(newFileOutput, null, 2))

// generate the faux queue object for when the car/data generator isn't connected
let fauxQueue = { timestamps: ['00:00:00.000'] };
for (const key of Object.keys(SC1DataFormat)) {
  fauxQueue[key] = [null];
}

writeFileSync("./src/Components/Graph/faux-queue.json", JSON.stringify(fauxQueue, null, 2));
