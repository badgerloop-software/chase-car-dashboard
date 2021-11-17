import "./Dashboard.css"
import {
  Box,
  Heading,
  Text,
  Flex, Center, Spacer,
  Square, GridItem, Grid
} from "@chakra-ui/react";
import { Select} from "@chakra-ui/react"
import React, { useState, useLayoutEffect } from "react";

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
    <Box>
      {/* <Heading>Dashboard</Heading> */}
      {/* <Box className="dashborad-container" >
        <Text>Speed: {state.data?.speed}</Text>
        <Text>Power: {state.data?.power}</Text>
        <Text>Charge: {state.data?.charge}</Text>
        <Text>netPower: {state.data?.netPower}</Text>
        <Text>motorPower: {state.data?.motorPower}</Text>
        <Text>milesLeft: {state.data?.milesLeft}</Text>
        <Text>batteryTemp: {state.data?.batteryTemp}</Text>
        <Text>motorTemp: {state.data?.motorTemp}</Text>
        <Text>motorControllerTemp: {state.data?.motorControllerTemp}</Text>
        <Text>frontLeftTP: {state.data?.frontLeftTP}</Text>
        <Text>frontRightTP: {state.data?.frontRightTP}</Text>
        <Text>backLeftTP: {state.data?.backLeftTP}</Text>
        <Text>backRightTP: {state.data?.backRightTP}</Text>
        <Text>state: {state.data?.state}</Text>
      </Box> */}
      <Grid
        h="100vh"
        templateRows="repeat(3, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={1}
        style={{ border: "1px solid green" }}
      >
        <GridItem rowSpan={3} colSpan={1} bg="blue.100" >
          <Grid
            h="100%"
            templateRows="repeat(3, 1fr)"
            templateColumns="repeat(1, 1fr)"
            gap={1}
          >
            <GridItem colSpan={1} bg="blue.200" />
            <GridItem colSpan={1} bg="blue.200" >
              <Select bg="white" placeholder="Select option">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </GridItem>
            <GridItem colSpan={1} bg="blue.200" >
              <Select bg="white" placeholder="Select option">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem colSpan={4} bg="blue.100" >
          <Grid
            h="100%"
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(30, 1fr)"
            gap={1}
          >
            <GridItem rowSpan={1} colSpan={1} bg="tomato" >
              {/* <Center> */}
                <Text id="vertical-text" orientation="vertical">Solor Car</Text>
              {/* </Center> */}
            </GridItem>
            <GridItem colSpan={29} bg="tomato" />
          </Grid>
        </GridItem>
        <GridItem colSpan={4} bg="blue.100" >
        </GridItem>
        <GridItem colSpan={4} bg="blue.100" >
        </GridItem>
      </Grid>

    </Box>
  );
}
