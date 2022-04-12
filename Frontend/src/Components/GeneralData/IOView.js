
import React from "react";
import { Box, Flex, Spacer, VStack, SimpleGrid, Text } from "@chakra-ui/react";
import Heading_Cell from "../PPC_MPPT/Heading_Cell";
import RangeBar from "../PPC_MPPT/RangeBar";

export default function IOView(props) {
    const fs = "1.2em"

    return (
      <Flex direction="column" align="center" borderLeft="1px">
        <Heading_Cell label="I/O Boards" />
        <SimpleGrid
          columns={2}
          rows={2}
          spacingX='0.75vw' // TODO Change this and other width/horizontal values to vw
          pt="0.5vh"
          pb="0.75vh"
          >
          <Flex>
            <Text fontSize={fs}>12V Bus</Text>
            <Spacer />
            <Text fontSize={fs}>{props.data?.bus_12V[0]?.toFixed(2) ?? "?"} V</Text>
          </Flex>
          <Flex>
            <Text fontSize={fs}>5V Bus</Text>
            <Spacer />
            <Text fontSize={fs}>{props.data?.bus_5V[0]?.toFixed(2) ?? "?"} V</Text>
          </Flex>
          <RangeBar val={props.data?.bus_12V[0] ?? 0} min={0} max={12} w="7.375vw" />
          <RangeBar val={props.data?.bus_5V[0] ?? 0} min={0} max={5} w="7.375vw" />
        </SimpleGrid>

        <Heading_Cell label="Driver I/O" />
        <Flex flex={1} direction={"column"} align="stretch" pt={"0.5vh"} pb={"0.75vh"}>
          <Flex>
            <Text fontSize={fs}>Driver I/O Temp</Text>
            <Spacer />
            <Text fontSize={fs}>{props.data?.driverIO_temp[0]?.toFixed(2) ?? "?"} &#x2103;</Text>
          </Flex>
          <RangeBar val={props.data?.driverIO_temp[0] ?? 0} min={0} max={100} w="15.5vw" />
          <Flex>
            <Text fontSize={fs}>Driver I/O Current In</Text>
            <Spacer />
            <Text fontSize={fs}>{props.data?.driverIO_current_in[0]?.toFixed(2) ?? "?"} A</Text>
          </Flex>
          <RangeBar val={props.data?.driverIO_current_in[0] ?? 0} min={0} max={150} w="15.5vw" />
        </Flex>

        <Heading_Cell label="Main I/O" />
        <Flex direction={"column"} flex={1} align="stretch" pt={"0.5vh"} pb={"0.75vh"} >
          <Flex>
            <Text fontSize={fs}>Main I/O Temp</Text>
            <Spacer />
            <Text fontSize={fs}>{props.data?.mainIO_temp[0]?.toFixed(2) ?? "?"} &#x2103;</Text>
          </Flex>
          <RangeBar val={props.data?.mainIO_temp[0] ?? 0} min={0} max={100} w="15.5vw" />
          <Flex>
            <Text fontSize={fs}>Main I/O Current In</Text>
            <Spacer />
            <Text fontSize={fs}>{props.data?.mainIO_current_in[0]?.toFixed(2) ?? "?"} A</Text>
          </Flex>
          <RangeBar val={props.data?.mainIO_current_in[0] ?? 0} min={0} max={100} w="15.5vw" />
        </Flex>
      </Flex>
    );
}
