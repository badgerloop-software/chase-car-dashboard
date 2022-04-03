import { Box, Grid, GridItem, HStack, Select, VStack } from "@chakra-ui/react";
import { DateTime } from "luxon";
import React, { useEffect, useReducer, useState } from "react";
import BatteryCells from "../BatteryCells/BatteryCells";
import FaultsView from "../Faults/FaultsView";
import DataView from "../GeneralData/DataView";
import MiniMap from "../MiniMap/MiniMap";
import GraphContainer from "./GraphContainer";

function reducer(currentState, newData) {
  // console.log("reducer called :~)", newData);

  // const timestamps = newData.timestamps.map((timestamp) =>
  //   DateTime.fromISO(timestamp)
  // );

  const output = {};
  for (const key in newData) {
    if (key === "timestamps" || key.startsWith("tstamp")) continue;

    output[key] = newData[key].map((value, idx) => ({
      x: newData.timestamps[idx],
      y: value,
    }));
  }

  return output;
}

export default function Dashboard(props) {
  //-------------- Fetching data from backend and updating state/data --------------

  async function callBackendAPI() {
    const response = await fetch("/api");
    const body = await response.json();

    if (response.status !== 200) {
      console.error("api: error");
      throw Error(body.message);
    }

    // console.log("body", body);
    return body;
  }

  const [queue, updateQueue] = useReducer(reducer, {});

  const [state, setState] = useState({ data: null });
  useEffect(() => {
    callBackendAPI()
      .then((res) => {
        setState({ data: res.response });
        updateQueue(res.response);
        // console.log("api::", res.response);
      })
      .catch((err) => console.log(err));
  }, [state]);

  //------------------- Choosing data views using Select components -------------------

  const [dataView1, setDataView1] = useState("");
  const [dataView2, setDataView2] = useState("");

  // Update the value indicating which data view to display when an option is selected
  const selectDataView = (event) => {
    if (event.target.id === "dataViewSelect1") {
      // Avoid duplicate data views, unless they are both empty
      if (
        event.target.value ===
          document.getElementById("dataViewSelect2").value &&
        event.target.value !== ""
      ) {
        // If trying to switch to a data view that is already being displayed in the other
        // section, switch the data views in this section and the other one
        setDataView2(dataView1);
        console.log(event.target.value.toString());
      }
      setDataView1(event.target.value);
    } else if (event.target.id === "dataViewSelect2") {
      // Avoid duplicate data views, unless they are both empty
      if (
        event.target.value ===
          document.getElementById("dataViewSelect1").value &&
        event.target.value !== ""
      ) {
        // If trying to switch to a data view that is already being displayed in the other
        // section, switch the data views in this section and the other one
        setDataView1(dataView2);
      }
      setDataView2(event.target.value);
    }
  };

  // Choose the data view to return/display based on the given option
  const switchDataView = (optionValue) => {
    if (optionValue === "general") {
      return <DataView data={state.data} />;
    } else if (optionValue === "battery") {
      return <BatteryCells data={state.data} />;
    } else if (optionValue === "minimap") {
      return <MiniMap />;
    } else {
      return <Box />;
    }
  };

  return (
    <HStack h="100vh" w="100vw" align="stretch" spacing={0}>
      <Grid flex="1 1 0" templateRows="1fr 3fr">
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
          h="37.5vh"
          rowStart={2}
          rowSpan={1}
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
          {switchDataView(dataView1)}
        </GridItem>
        <GridItem
          h="37.5vh"
          rowStart={3}
          rowSpan={1}
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
          {switchDataView(dataView2)}
        </GridItem>
      </Grid>
      <GraphContainer queue={queue} flex="2 2 0" maxW="67vw" />
    </HStack>
  );
}

function DataViewOptions(props) {
  return (
    <>
      <option value="general">General Data</option>
      <option value="battery">Battery Cells</option>
      <option value="minimap">Minimap</option>
    </>
  );
}
