import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import TirePressure from "./TirePressure";
import BatteryCharge from "./BatteryCharge";

export default function DataView(props) {
  return (
    <div>
      <Heading>Data</Heading>
      <HStack>
        <BatteryCharge charge={props.data?.charge[0]}/>
        <Box>
          <Text>Speed: {props.data?.speed[0]}</Text>
          <Text>Charge: {props.data?.charge[0]}</Text>
          <Text>netPower: {(props.data?.batteryVoltage[0] ?? 0) * (props.data?.batteryCurrent[0] ?? 0)}</Text>
          <Text>motorPower: {props.data?.motorPower[0]}</Text>
          <Text>milesLeft: {/*props.data?.milesLeft[0]*/ 0}</Text>
          <Text>batteryTemp: {props.data?.batteryTemp[0]}</Text>
          <Text>motorTemp: {props.data?.motorTemp[0]}</Text>
          <Text>motorControllerTemp: {props.data?.motorControllerTemp[0]}</Text>
          <Text>state: {props.data?.state[0]}</Text>
        </Box>
        <TirePressure
          size={10}
          borderWidth={1}
          borderColor="black"
          frontLeftTP={props.data?.frontLeftTP[0]}
          frontRightTP={props.data?.frontRightTP[0]}
          backLeftTP={props.data?.backLeftTP[0]}
          backRightTP={props.data?.backRightTP[0]}
        />
      </HStack>
    </div>
  );
}
