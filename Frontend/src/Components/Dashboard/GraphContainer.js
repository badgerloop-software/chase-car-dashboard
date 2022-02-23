import { Select, VStack } from "@chakra-ui/react";
import { useState } from "react";
import BatteryGraph from "../Graph/BatteryGraph";
import CustomGraph from "../Graph/CustomGraph";
import GraphContext from "../Graph/GraphContext";
import PowerGraph from "../Graph/PowerGraph";
import TemperatureGraph from "../Graph/TemperatureGraph";

export default function GraphContainer(props) {
  const { queue, state } = props;

  //------------------- Choosing graphs using Select components -------------------

  const [graph1, setGraph1] = useState("");
  const [graph2, setGraph2] = useState("");
  const [graph3, setGraph3] = useState("");

  // Update the value indicating which graph to display when an option is selected
  const selectGraph = (event) => {
    if (event.target.id === "graphSelect1") {
      // Avoid duplicate graphs, unless they are both empty or custom
      if (event.target.value !== "" && event.target.value !== "custom") {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        // eslint-disable-next-line
        switch (event.target.value) {
          case document.getElementById("graphSelect2").value:
            setGraph2(graph1);
            break;
          case document.getElementById("graphSelect3").value:
            setGraph3(graph1);
            break;
          // default:
          //   break;
        }
      }
      setGraph1(event.target.value);
    } else if (event.target.id === "graphSelect2") {
      // Avoid duplicate graphs, unless they are both empty or custom
      if (event.target.value !== "" && event.target.value !== "custom") {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        // eslint-disable-next-line
        switch (event.target.value) {
          case document.getElementById("graphSelect1").value:
            setGraph1(graph2);
            break;
          case document.getElementById("graphSelect3").value:
            setGraph3(graph2);
            break;
          // default:
          //   break;
        }
      }
      setGraph2(event.target.value);
    } else if (event.target.id === "graphSelect3") {
      // Avoid duplicate graphs, unless they are both empty or custom
      if (event.target.value !== "" && event.target.value !== "custom") {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        // eslint-disable-next-line
        switch (event.target.value) {
          case document.getElementById("graphSelect1").value:
            setGraph1(graph3);
            break;
          case document.getElementById("graphSelect2").value:
            setGraph2(graph3);
            break;
          // default:
          //   break;
        }
      }
      setGraph3(event.target.value);
    }
  };

  //------------------------- Saving custom graphs ----------------------------

  const [customGraphData, setCustomGraphData] = useState({});

  const saveCustomGraph = (data) => {
    let graphData = customGraphData;

    graphData[data.title] = data;

    setCustomGraphData(graphData);

    console.log(customGraphData);
    // console.log("Colors: ", data.colors, "\nDatasets: ", data.datasets, "\nButtons: ", data.buttons, "\nTitle: ", data.title);
  };

  // Choose the graph to return/display based on the given option
  const switchGraph = (optionValue) => {
    if (optionValue === "battery") {
      return <BatteryGraph data={state.data} />;
    } else if (optionValue === "power") {
      return <PowerGraph data={state.data} />;
    } else if (optionValue === "temperature") {
      return <TemperatureGraph data={state.data} />;
    } else if (optionValue === "custom") {
      return (
        <CustomGraph
          id=""
          data={state.data}
          title=""
          buttons={[]}
          datasets={[]}
          save={saveCustomGraph}
        />
      );
    } else {
      for (const title in customGraphData) {
        if (optionValue === title) {
          return (
            <CustomGraph
              id={title}
              data={state.data}
              title={title}
              buttons={customGraphData[title].buttons}
              datasets={customGraphData[title].datasets}
              save={saveCustomGraph}
            />
          );
        }
      }
    }
  };

  return (
    <VStack flex="2 2 0" maxW="67vw" align="stretch" spacing={0}>
      <GraphContext.Provider value={queue}>
        <VStack
          align="stretch"
          spacing={0}
          borderColor="black"
          borderWidth={1}
          flex="1 1 0"
        >
          <Select
            id="graphSelect1"
            size="xs"
            variant="filled"
            bgColor="grey.300"
            placeholder="Select option"
            value={graph1}
            onChange={selectGraph}
          >
            <GraphOptions />
          </Select>
          {switchGraph(graph1)}
        </VStack>
        <VStack
          h="100%"
          align="stretch"
          spacing={0}
          borderColor="black"
          borderWidth={1}
          flex="1 1 0"
        >
          <Select
            id="graphSelect2"
            size="xs"
            variant="filled"
            bgColor="grey.300"
            placeholder="Select option"
            value={graph2}
            onChange={selectGraph}
          >
            <GraphOptions />
          </Select>
          {switchGraph(graph2)}
        </VStack>
        <VStack
          h="100%"
          align="stretch"
          spacing={0}
          borderColor="black"
          borderWidth={1}
          flex="1 1 0"
        >
          <Select
            id="graphSelect3"
            size="xs"
            variant="filled"
            bgColor="grey.300"
            placeholder="Select option"
            value={graph3}
            onChange={selectGraph}
          >
            <GraphOptions />
          </Select>
          {switchGraph(graph3)}
        </VStack>
      </GraphContext.Provider>
    </VStack>
  );
}

function GraphOptions(props) {
  let customGraphs = [];

  for (const title in props.customGraphs) {
    customGraphs.push(<option value={title}>{title}</option>);
  }

  return (
    <>
      <option value="battery">Battery</option>
      <option value="power">Power</option>
      <option value="temperature">Temperature</option>
      {customGraphs}
      <option value="custom">Custom</option>
    </>
  );
}
