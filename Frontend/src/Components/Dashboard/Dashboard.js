import { Grid, GridItem, VStack, Select } from "@chakra-ui/react";
import React, { useState, useLayoutEffect } from "react";
import FaultsView from "../Faults/FaultsView";
import DataViewOptions from "./DataViewOptions";
import DataView from "../GeneralData/DataView";
import BatteryCells from "../BatteryCells/BatteryCells"
import MiniMap from "../MiniMap/MiniMap";
import GraphOptions from "./GraphOptions";
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

  const [dataView1, setDataView1] = React.useState("");
  const [dataView2, setDataView2] = React.useState("");

  // Update the value indicating which data view to display when an option is selected
  const selectDataView = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.id === "dataViewSelect1") {
      // Avoid duplicate data views, unless they are both empty
      if((event.target.value === document.getElementById("dataViewSelect2").value)
         && (event.target.value !== "")) {
        // If trying to switch to a data view that is already being displayed in the other
        // section, switch the data views in this section and the other one
        setDataView2(dataView1);
        console.log(event.target.value.toString());
      }
      setDataView1(event.target.value);
    } else if(event.target.id === "dataViewSelect2") {
      // Avoid duplicate data views, unless they are both empty
      if((event.target.value === document.getElementById("dataViewSelect1").value)
          && (event.target.value !== "")) {
        // If trying to switch to a data view that is already being displayed in the other
        // section, switch the data views in this section and the other one
        setDataView1(dataView2);
      }
      setDataView2(event.target.value);
    }
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

  const [graph1, setGraph1] = React.useState("");
  const [graph2, setGraph2] = React.useState("");
  const [graph3, setGraph3] = React.useState("");

  // Update the value indicating which graph to display when an option is selected
  const selectGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.id === "graphSelect1") {
      // Avoid duplicate graphs, unless they are both empty
      if(event.target.value !== "") {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        switch(event.target.value) {
          case(document.getElementById("graphSelect2").value):
            setGraph2(graph1);
            break;
          case(document.getElementById("graphSelect3").value):
            setGraph3(graph1);
            break;
          default:
            break;
        }
      }
      setGraph1(event.target.value);
    } else if(event.target.id === "graphSelect2") {
      // Avoid duplicate graphs, unless they are both empty
      if(event.target.value !== "") {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        switch(event.target.value) {
          case(document.getElementById("graphSelect1").value):
            setGraph1(graph2);
            break;
          case(document.getElementById("graphSelect3").value):
            setGraph3(graph2);
            break;
          default:
            break;
        }
      }
      setGraph2(event.target.value);
    } else if(event.target.id === "graphSelect3") {
      // Avoid duplicate graphs, unless they are both empty
      if(event.target.value !== "") {
        // If trying to switch to a graph that is already being displayed in another
        // section, switch the graphs in this section and the other one
        switch(event.target.value) {
          case(document.getElementById("graphSelect1").value):
            setGraph1(graph3);
            break;
          case(document.getElementById("graphSelect2").value):
            setGraph2(graph3);
            break;
          default:
            break;
        }
      }
      setGraph3(event.target.value);
    }
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
                  value={dataView1}
                  onChange={selectDataView}
              >
                <DataViewOptions />
              </Select>
              {(switchDataView)(dataView1)}
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
                <DataViewOptions />
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
                  value={graph1}
                  onChange={selectGraph}
              >
                <GraphOptions />
              </Select>
              {(switchGraph)(graph1)}
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
                <GraphOptions />
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
                <GraphOptions />
              </Select>
              {(switchGraph)(graph3)}
            </VStack>
        </Grid>
      </GridItem>
    </Grid>
  );
}
