import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useLayoutEffect } from "react";
import TirePressure from "./TirePressure";
import FaultsView from "./FaultsView";
import DataView from "./DataView";
import MiniMap from "./MiniMap";

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
        <FaultsView/>
      </GridItem>
      <GridItem
        colStart={1}
        colSpan={1}
        rowStart={2}
        rowSpan={3}
        borderColor="black"
        borderWidth={1}
      >
        <DataView data={state.data}/>
      </GridItem>
      <GridItem
        colStart={1}
        colSpan={1}
        rowStart={5}
        rowSpan={1}
        borderColor="black"
        borderWidth={1}
      >
      <MiniMap/>
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
