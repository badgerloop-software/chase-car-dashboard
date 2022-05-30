import { Select, useConst, VStack } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import CustomGraph from "../Graph/CustomGraph";
import GraphData from "../Graph/graph-data.json";

/**
 * Generates color data for all categories/datasets and packs the data nicely
 *
 * The data is in this format:
 * ```
 * [
 *   {
 *     key: string,
 *     name: string,
 *     color: string
 *   }
 * ]```
 *
 * where `key` is the internally-used string used to identify the dataset,
 * `name` is the human-readable name of this dataset, and `color` is the
 * (CSS-compatible) hex color code assigned to this dataset.
 *
 * @returns a list of categories taken from the JSON file with randomly generated colors
 */
function generateCategories() {
  const allDatasets = GraphData.categories
    .flatMap((category) => category.values)
    .map((obj) => {
      const colorNum = Math.floor(Math.random() * 0x3fffff + 0x3fffff);
      const color = "#" + colorNum.toString(16);

      const output = { key: obj.key, name: obj.name, color };
      // console.log("Generated color for", obj, ":", output);
      return output;
    });

  return allDatasets;
}

/**
 * Creates a new GraphContainer component
 *
 * @param {any} props the props to pass to this graph container
 * @returns the graph-containing component
 */
export default function GraphContainer({ queue, latestTime, ...props }) {
  // fetch constants: categories and flatpacked categories
  const allDatasets = useConst(generateCategories);

  //------------------- Choosing graphs using Select components -------------------
  // stores the list of graph names/id
  const [graphTitles, setGraphTitles] = useState(["", "", ""]);

  /**
   * A function that makes the given graph display in the given place. If the graph is
   * already being shown in a different place and cannot be duplicated, it will be
   * swapped with the graph in the given index.
   *
   * @param {string} name the name of the graph to show
   * @param {number} idx the index of the new place the graph should be
   */
  const showGraph = useCallback(
    (name, idx) => {
      // save graph in old position, if needed
      // if (graphTitles[idx] && graphTitles[idx] !== "Custom")
      //   onSave(graphTitles[idx], datasets);

      // duplicate the graph titles
      const copy = graphTitles.slice();

      // check for special values
      if (name?.length && name !== "Custom") {
        const oldIdx = graphTitles.indexOf(name);

        // found old position of graph, swap with new position
        if (oldIdx !== -1) {
          // see https://jsbench.me/snl20xx1g9/1 for reasoning behind this algorithm
          copy[oldIdx] = copy[idx];
          copy[idx] = name;
          // console.log(graphTitles, "[", idx, "] =", name, "=", graphTitles);

          setGraphTitles(copy);
          return;
        }
      }

      // default set: if new custom/empty graph or replacing new custom/empty graph
      // see https://jsbench.me/vsl20xqpso/1 for reasoning behind this algorithm
      copy[idx] = name;
      // console.log(graphData, "[", idx, "] =", name, "=", graphData);
      setGraphTitles(copy);
    },
    [graphTitles, setGraphTitles]
  );

  //------------------------- Saving custom graphs ----------------------------
  // a state variable that stores all saved custom graphs' data
  // the key is the name of the graph, and the value contains the selected datasets and the visible history length
  // format: {[name: string]: {datasets: string[], historyLength: number}}
  const [customGraphData, setCustomGraphData] = useState({});
  // console.log("custom graph data:", customGraphData);

  /**
   * Saves the given graph's data (namely, the datasets that it is displaying and its "history length")
   *
   * @param {string} title the title of the graph to be saved
   * @param {{datasets: string[], historyLength: number}} data all the data associated with the graph that is supposed to be saved
   * @param {string[]} data.datasets the datasets that are displayed in the graph to be saved
   * @param {number} data.historyLength the length of history, in seconds, to display to the user
   * @param {number} index the index of the graph that's being saved
   */
  const onSave = useCallback(
    (title, isNew, data, index) => {
      // check duplicates if new
      if (isNew && Object.keys(customGraphData).includes(title)) {
        console.warn("No\n", title, "is in", customGraphData);
        return false;
      }

      // set new graph data assigned to this graph
      const tempData = Object.assign({}, customGraphData);
      tempData[title] = data;
      setCustomGraphData(tempData);

      // update the graph title
      const tempTitles = graphTitles.slice();
      tempTitles[index] = title;
      setGraphTitles(tempTitles);

      // go ahead with saving
      return true;
    },
    [setCustomGraphData, setGraphTitles, customGraphData, graphTitles]
  );

  //----------------- Calculate all data that can be shown --------------------
  /**
   * A "pre-packed" representation of the data that can be easily inserted into
   * the graph component for rendering.
   *
   * The object is of the format:
   * ```
   * [
   *   {
   *     key: string,
   *     label: string,
   *     data: [{x: DateTime, y: any}],
   *     borderColor: string,
   *     backgroundColor: string
   *   }
   * ]
   */
  const packedData = useMemo(() => {
    // console.log("memo invoked");
    console.time("unpack graph data");
    const temp = allDatasets.map((value) => {
      const output = {
        key: value.key,
        label: value.name,
        data: queue[value.key],
        borderColor: value.color,
        backgroundColor: value.color + "b3",
      };
      // console.log("packing:", output);
      return output;
    });
    console.timeEnd("unpack graph data");
    return temp;
  }, [allDatasets, queue]);

  // console.log("graph container propaganda");

  return (
    <VStack align="stretch" spacing={0} {...props}>
      {graphTitles.map((graphTitle, index) => {
        const key = graphTitle?.length
          ? graphTitle === "Custom"
            ? "Custom" + index
            : "graph_" + graphTitles[index]
          : index;
        // console.log(index, graphTitle, key);
        return (
          <VStack
            align="stretch"
            spacing={0}
            borderColor="black"
            borderWidth={1}
            flex="1 1 0"
            key={key}
          >
            <Select
              id="graphSelect1"
              size="xs"
              variant="filled"
              bgColor="grey.300"
              placeholder="Select option"
              value={graphTitles[index]}
              onChange={(evt) => showGraph(evt.target.value, index)}
            >
              <GraphOptions titles={Object.keys(customGraphData)} />
            </Select>
            {graphTitles[index] === "" ? null : graphTitles[index] ===
              "Custom" ? (
              <CustomGraph
                onSave={(title, isNew, data) =>
                  onSave(title, isNew, data, index)
                }
                title=""
                // categories={categories}
                packedData={packedData}
                initialDatasets={[]}
                // allDatasets={allDatasets}
                latestTime={latestTime}
              />
            ) : (
              <CustomGraph
                onSave={(title, isNew, data) =>
                  onSave(title, isNew, data, index)
                }
                title={graphTitles[index]}
                // categories={categories}
                packedData={packedData}
                initialDatasets={customGraphData[graphTitles[index]].datasets}
                secondsRetained={
                  customGraphData[graphTitles[index]].historyLength
                }
                // allDatasets={allDatasets}
                latestTime={latestTime}
              />
            )}
          </VStack>
        );
      })}
    </VStack>
  );
}

/**
 * Creates a component that contains all the given titles as well as "Custom" in a dropdown option list.
 *
 * @param {{titles: string[]}} props the props to pass to this component
 * @param {string[]} props.titles the list of graph titles to display in the dropdown
 * @returns a component containing all the given options and "Custom"
 */
function GraphOptions({ titles }) {
  return (
    <>
      {titles
        .filter((title) => title && title !== "Custom")
        .map((title) => (
          <option key={title} value={title}>
            {title}
          </option>
        ))}
      <option value="Custom">Custom</option>
    </>
  );
}
