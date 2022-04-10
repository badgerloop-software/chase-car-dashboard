
import React from "react";
import { Box, Heading, VStack, HStack, SimpleGrid, Text, Progress } from "@chakra-ui/react";
import RangeBar from "./RangeBar"

export default class IOView extends React.Component {
  clamp = (x, a, b) => Math.max(a, Math.min(x, b));

  tempToPercentage = (temp, minTemp = 0, maxTemp = 100) => 100 * this.clamp(temp / (maxTemp - minTemp), 0, 1);

  currentToPercentage = (cur, maxCur = 5) => 100 * this.clamp(cur / maxCur, 0, 1);

  voltageToPercentage = (voltage, maxVoltage = 5) =>100 * this.clamp(voltage / maxVoltage, 0, 1);

  rangeBar = (val, doubleWidth = false) => <RangeBar val={val} w={doubleWidth ? "30vh" : "15vh"} />;

  render() {
    return (
      <VStack align="flex-start" margin="10px">
        <Box>
          <Heading>I/O Boards</Heading>
          <SimpleGrid
            columns={2}
            rows={1}
            spacingX={'0.25vw'}
            >
            <Box>
              <Text>12V Bus: {this.props.data?.bus_12V[0]?.toFixed(2) ?? "?"} V</Text>
              {this.rangeBar(this.voltageToPercentage(this.props.data?.bus_12V[0] ?? 0, 15))}
            </Box>
            <Box>
              <Text>5V Bus: {this.props.data?.bus_5V[0]?.toFixed(2) ?? "?"} V</Text>
              {this.rangeBar(this.voltageToPercentage(this.props.data?.bus_5V[0] ?? 0, 10))}
            </Box>
          </SimpleGrid>
        </Box>

        <Box>
          <Heading>Driver I/O</Heading>
          <VStack align="flex-start">
            <Box>
              <Text>Driver I/O Temp: {this.props.data?.driverIO_temp[0]?.toFixed(2) ?? "?"} &#x2103;</Text>
              {this.rangeBar(this.tempToPercentage(this.props.data?.driverIO_temp[0] ?? 0, 0, 100), true)}
            </Box>
            <Box>
              <Text>Driver I/O Current In: {this.props.data?.driverIO_current_in[0]?.toFixed(2) ?? "?"} A</Text>
              {this.rangeBar(this.currentToPercentage(this.props.data?.driverIO_current_in[0] ?? 0, 5), true)}
            </Box>
          </VStack>
        </Box>

        <Box>
          <Heading>Main I/O</Heading>
          <VStack align="flex-start">
            <Box>
              <Text>Main I/O Temp: {this.props.data?.mainIO_temp[0]?.toFixed(2) ?? "?"} &#x2103;</Text>
              {this.rangeBar(this.tempToPercentage(this.props.data?.mainIO_temp[0] ?? 0, 0, 100), true)}
            </Box>
            <Box>
              <Text>Main I/O Current In: {this.props.data?.mainIO_current_in[0]?.toFixed(2) ?? "?"} A</Text>
              {this.rangeBar(this.currentToPercentage(this.props.data?.mainIO_current_in[0] ?? 0, 5), true)}
            </Box>
          </VStack>
        </Box>
      </VStack>
    );
  }
}