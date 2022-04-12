import { Box, Heading, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import BatteryCharge from "./BatteryCharge";
import IOView from "./IOView"

export default function DataView(props) {
  return (
    <SimpleGrid
        h={"100%"}
      columns={2}
      rows={1}
    >
      <div>
        <Heading>Data</Heading>
        <HStack>
          <BatteryCharge charge={props.data?.soc[0]}/>
          <Box>
            <Text>Speed: {props.data?.speed[0]}</Text>
            <Text>Charge: {props.data?.soc[0]}</Text>
            <Text>netPower: {(props.data?.pack_voltage[0] ?? 0) * (props.data?.pack_current[0] ?? 0)}</Text>
            <Text>milesLeft: {/*props.data?.milesLeft[0]*/ 0}</Text>
            <Text>batteryTemp: {props.data?.pack_temp[0]}</Text>
            <Text>motorTemp: {props.data?.motor_temp[0]}</Text>
            <Text>state: {props.data?.state[0]}</Text>
          </Box>
        </HStack>
      </div>


        <IOView data={props.data}/>

    </SimpleGrid>
  );
}
