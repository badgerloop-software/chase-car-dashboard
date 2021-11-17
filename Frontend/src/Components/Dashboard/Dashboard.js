import {
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
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
        <VStack>
          <Heading size="md">Faults</Heading>
          <HStack flexWrap="wrap">
            <Text>A</Text>
            <Text>B</Text>
            <Text>C</Text>
          </HStack>
        </VStack>
      </GridItem>
      <GridItem
        colStart={1}
        colSpan={1}
        rowStart={2}
        rowSpan={3}
        borderColor="black"
        borderWidth={1}
      >
        <Heading>Data</Heading>
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
      </GridItem>
      <GridItem
        colStart={1}
        colSpan={1}
        rowStart={5}
        rowSpan={1}
        borderColor="black"
        borderWidth={1}
      >
        <Center h="100%">
          <Text as="i">Minimap</Text>
        </Center>
      </GridItem>
      <GridItem
        colStart={2}
        colSpan={1}
        rowStart={1}
        rowSpan={2}
        borderColor="black"
        borderWidth={1}
      >
        <HStack h="100%" align="stretch">
          <Text
            css={{ writingMode: "vertical-lr" }}
            transform="rotate(180deg)"
            borderLeftColor="grey.300"
            borderLeftWidth={1}
            textAlign="center"
          >
            Graph I
          </Text>
          <Center flex={1}>Graph</Center>
        </HStack>
      </GridItem>
      <GridItem
        colStart={2}
        colSpan={1}
        rowStart={3}
        rowSpan={1}
        borderColor="black"
        borderWidth={1}
      >
        <HStack h="100%" align="stretch">
          <Text
            css={{ writingMode: "vertical-lr" }}
            transform="rotate(180deg)"
            borderLeftColor="grey.300"
            borderLeftWidth={1}
            textAlign="center"
          >
            Graph II
          </Text>
          <Center flex={1}>Graph</Center>
        </HStack>
      </GridItem>
      <GridItem
        colStart={2}
        colSpan={1}
        rowStart={4}
        rowSpan={2}
        borderColor="black"
        borderWidth={1}
      >
        <HStack h="100%" align="stretch">
          <Text
            css={{ writingMode: "vertical-lr" }}
            transform="rotate(180deg)"
            borderLeftColor="grey.300"
            borderLeftWidth={1}
            textAlign="center"
          >
            Graph III
          </Text>
          <Center flex={1}>Graph</Center>
        </HStack>
      </GridItem>
    </Grid>
  );
}
