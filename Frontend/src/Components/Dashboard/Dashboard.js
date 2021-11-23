import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack,
  Select
} from "@chakra-ui/react";
import React, { useState, useLayoutEffect } from "react";
import TirePressure from "../GeneralData/TirePressure";
import FaultsView from "../Faults/FaultsView";
import DataView from "../GeneralData/DataView";
import MiniMap from "../MiniMap/MiniMap";
import BatteryGraph from "../Graph/BatteryGraph";
import PowerGraph from "../Graph/PowerGraph";
import TemperatureGraph from "../Graph/TemperatureGraph";

export default function Dashboard(props) {
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

  return (
    <Grid
      templateColumns="1fr 2fr"
      templateRows="3fr 1fr 4fr 1fr 3fr"
      h="100vh"
      w="100vw"
    >
      <GridItem
        colStart={1}
        colSpan={1}
        rowStart={1}
        rowSpan={1}
        borderColor="black"
        borderWidth={1}
        p={2}
      >
        <FaultsView data={state.data}/>
      </GridItem>
      <GridItem
        colStart={1}
        colSpan={1}
        rowStart={2}
        rowSpan={3}
        borderColor="black"
        borderWidth={1}
      >
        <VStack h="100%" align="stretch" spacing={0}>
          <Select size="xs" variant="flushed" bg="white" placeholder="Select option">
            <option value="general">General Data</option>
            <option value="battery">Battery Cells</option>
            <option value="minimap">Minimap</option>
          </Select>
          <DataView data={state.data}/>
        </VStack>
      </GridItem>
      <GridItem
        colStart={1}
        colSpan={1}
        rowStart={5}
        rowSpan={1}
        borderColor="black"
        borderWidth={1}
      >
        <VStack h="100%" align="stretch" spacing={0}>
          <Select size="xs" variant="flushed" bg="white" placeholder="Select option">
            <option value="general">General Data</option>
            <option value="battery">Battery Cells</option>
            <option value="minimap">Minimap</option>
          </Select>
          <MiniMap/>
        </VStack>
      </GridItem>
      <GridItem
        colStart={2}
        colSpan={1}
        rowStart={1}
        rowSpan={2}
        borderColor="black"
        borderWidth={1}
      >
        <VStack h="100%" align="stretch" spacing={0}>
          <Select size="xs" variant="flushed" bg="white" placeholder="Select option">
            <option value="battery">Battery</option>
            <option value="power">Power</option>
            <option value="temperature">Temperature</option>
          </Select>
          <BatteryGraph/>
        </VStack>
      </GridItem>
      <GridItem
        colStart={2}
        colSpan={1}
        rowStart={3}
        rowSpan={1}
        borderColor="black"
        borderWidth={1}
      >
        <VStack h="100%" align="stretch" spacing={0}>
          <Select size="xs" variant="flushed" bg="white" placeholder="Select option">
            <option value="battery">Battery</option>
            <option value="power">Power</option>
            <option value="temperature">Temperature</option>
          </Select>
          <PowerGraph/>
        </VStack>
      </GridItem>
      <GridItem
        colStart={2}
        colSpan={1}
        rowStart={4}
        rowSpan={2}
        borderColor="black"
        borderWidth={1}
      >
        <VStack h="100%" align="stretch" spacing={0}>
          <Select size="xs" variant="flushed" bg="white" placeholder="Select option">
            <option value="battery">Battery</option>
            <option value="power">Power</option>
            <option value="temperature">Temperature</option>
          </Select>
          <TemperatureGraph/>
        </VStack>
      </GridItem>
    </Grid>
  );
}
