import { Grid, GridItem, VStack, Select } from "@chakra-ui/react";
import React, { useState, useLayoutEffect } from "react";
import FaultsView from "../Faults/FaultsView";
import DataView from "../GeneralData/DataView";
import BatteryCells from "../BatteryCells/BatteryCells"
import MiniMap from "../MiniMap/MiniMap";
import BatteryGraph from "../Graph/BatteryGraph";
import PowerGraph from "../Graph/PowerGraph";
import TemperatureGraph from "../Graph/TemperatureGraph";

export default function Dashboard(props) {
  //-------------- Fetching data from backend and updating state/data --------------

  const callBackendAPI = async () => {
    const response = await fetch("/api");
    const body = await response.json();

    if (response.status !== 200) {
      console.error("api: error");
      throw Error(body.message);
    }

    return body;
  };

  const [state, setState] = useState({ data: null });
  useLayoutEffect(() => {
    callBackendAPI()
      .then((res) => {
        setState({ data: res.response });
        // console.log("api::", res.response);
      })
      .catch((err) => console.log(err));
  }, [state]);

  //------------------- Choosing data views using Select components -------------------

  const [dataView, setDataView] = React.useState("");
  const [dataView2, setDataView2] = React.useState("");
  // Update the value indicating which data view to display when an option is selected
  const selectDataView = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.id === "dataViewSelect1")
        setDataView(event.target.value);
    else if(event.target.id === "dataViewSelect2")
        setDataView2(event.target.value);
  };
  // Choose the data view to return/display based on the given option
  const switchDataView = (optionValue) => {
    if(optionValue === "general") {
      return <DataView data={state.data} />;
    } else if(optionValue === "battery") {
      return <BatteryCells data={state.data} />;
    } else if(optionValue === "minimap") {
      return <MiniMap />;
    } else {
      return <VStack />;
    }
  };

  //------------------- Choosing graphs using Select components -------------------

  const [graph, setGraph] = React.useState("");
  const [graph2, setGraph2] = React.useState("");
  const [graph3, setGraph3] = React.useState("");
  // Update the value indicating which graph to display when an option is selected
  const selectGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.id === "graphSelect1")
      setGraph(event.target.value);
    else if(event.target.id === "graphSelect2")
      setGraph2(event.target.value);
    else if(event.target.id === "graphSelect3")
      setGraph3(event.target.value);
  };
  // Choose the graph to return/display based on the given option
  const switchGraph = (optionValue) => {
    if(optionValue === "battery") {
      return <BatteryGraph />;
    } else if(optionValue === "power") {
      return <PowerGraph />;
    } else if(optionValue === "temperature") {
      return <TemperatureGraph />;
    } else {
      return <VStack />;
    }
  };

  return (
    <Grid
      templateColumns="1fr 2fr"
      h="100vh"
      w="100vw"
    >
      <GridItem
        colStart={1}
        colSpan={1}
      >
        <Grid
          h="100vh"
          templateRows="1fr 3fr"
        >
          <GridItem
              rowStart={1}
              rowSpan={1}
              borderColor="black"
              borderWidth={1}
              p={2}
          >
            <FaultsView data={state.data} />
          </GridItem>
          <GridItem
              rowStart={2}
              rowSpan={1}
          >
            <VStack
              align="stretch"
              spacing={0}
              borderColor="black"
              borderWidth={1}
            >
              <Select
                  id="dataViewSelect1"
                  size="xs"
                  variant="filled"
                  bgColor="grey.300"
                  placeholder="Select option"
                  value={dataView}
                  onChange={selectDataView}
              >
                <option value="general">General Data</option>
                <option value="battery">Battery Cells</option>
                <option value="minimap">Minimap</option>
              </Select>
              {(switchDataView)(dataView)}
            </VStack>
            <VStack
                align="stretch"
                spacing={0}
                borderColor="black"
                borderWidth={1}
            >
              <Select
                  id="dataViewSelect2"
                  size="xs"
                  variant="filled"
                  bgColor="grey.300"
                  placeholder="Select option"
                  value={dataView2}
                  onChange={selectDataView}
              >
                <option value="general">General Data</option>
                <option value="battery">Battery Cells</option>
                <option value="minimap">Minimap</option>
              </Select>
              {(switchDataView)(dataView2)}
            </VStack>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem
          colStart={2}
          colSpan={1}
      >
        <Grid
            h="100vh"
            templateRows="repeat(3, 1fr)"
        >
            <VStack
              h="100%"
              align="stretch"
              spacing={0}
              borderColor="black"
              borderWidth={1}
            >
              <Select
                  id="graphSelect1"
                  size="xs"
                  variant="filled"
                  bgColor="grey.300"
                  placeholder="Select option"
                  value={graph}
                  onChange={selectGraph}
              >
                <option value="battery">Battery</option>
                <option value="power">Power</option>
                <option value="temperature">Temperature</option>
              </Select>
              {(switchGraph)(graph)}
            </VStack>
            <VStack
                h="100%"
                align="stretch"
                spacing={0}
                borderColor="black"
                borderWidth={1}
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
                <option value="battery">Battery</option>
                <option value="power">Power</option>
                <option value="temperature">Temperature</option>
              </Select>
              {(switchGraph)(graph2)}
            </VStack>
            <VStack
                h="100%"
                align="stretch"
                spacing={0}
                borderColor="black"
                borderWidth={1}
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
                <option value="battery">Battery</option>
                <option value="power">Power</option>
                <option value="temperature">Temperature</option>
              </Select>
              {(switchGraph)(graph3)}
            </VStack>
        </Grid>
      </GridItem>
    </Grid>
  );
}
