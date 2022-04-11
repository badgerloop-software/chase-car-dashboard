
import React from "react";
import { Box, Flex, VStack, SimpleGrid, Text } from "@chakra-ui/react";
import Heading_Cell from "../PPC_MPPT/Heading_Cell";
import RangeBar from "../PPC_MPPT/RangeBar";

export default class IOView extends React.Component {
  render() {
    return (
      <Flex direction="column"> 
        <Heading_Cell label="I/O Boards" />
        <SimpleGrid
          columns={2}
          rows={1}
          spacingX={'0.25vw'}
          margin="2px"
          >
          <Box>
            <Text>12V Bus: {this.props.data?.bus_12V[0]?.toFixed(2) ?? "?"} V</Text>
            <RangeBar val={this.props.data?.bus_12V[0] ?? 0} min={0} max={15} w="15vh" />
          </Box>
          <Box>
            <Text>5V Bus: {this.props.data?.bus_5V[0]?.toFixed(2) ?? "?"} V</Text>
            <RangeBar val={this.props.data?.bus_5V[0] ?? 0} min={0} max={10} w="15vh" />
          </Box>
        </SimpleGrid>

        <Heading_Cell label="Driver I/O" />
        <VStack align="flex-start" margin="2px">
          <Box>
            <Text>Driver I/O Temp: {this.props.data?.driverIO_temp[0]?.toFixed(2) ?? "?"} &#x2103;</Text>
            <RangeBar val={this.props.data?.driverIO_temp[0] ?? 0} min={0} max={100} w="32vh" />
          </Box>
          <Box>
            <Text>Driver I/O Current In: {this.props.data?.driverIO_current_in[0]?.toFixed(2) ?? "?"} A</Text>
            <RangeBar val={this.props.data?.driverIO_current_in[0] ?? 0} min={0} max={150} w="32vh" />
          </Box>
        </VStack>

        <Heading_Cell label="Main I/O" />
        <VStack align="flex-start" margin="2px">
          <Box>
            <Text>Main I/O Temp: {this.props.data?.mainIO_temp[0]?.toFixed(2) ?? "?"} &#x2103;</Text>
            <RangeBar val={this.props.data?.mainIO_temp[0] ?? 0} min={0} max={100} w="32vh" />
          </Box>
          <Box>
            <Text>Main I/O Current In: {this.props.data?.mainIO_current_in[0]?.toFixed(2) ?? "?"} A</Text>
            <RangeBar val={this.props.data?.mainIO_current_in[0] ?? 0} min={0} max={100} w="32vh" />
          </Box>
          </VStack>
      </Flex>
    );
  }
}