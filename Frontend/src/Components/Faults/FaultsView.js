import { Heading, HStack, Text, VStack } from "@chakra-ui/react";

export default function Faults(props) {
  return (
    <VStack>
      <Heading size="md">Faults</Heading>
      <HStack flexWrap="wrap">
        <Text>E-Stop {props.data?.eStop.toString()}</Text>
        <Text>BPS Fault {props.data?.bpsFault.toString()}</Text>
        <Text>Low Battery {props.data?.lowBattery.toString()}</Text>
      </HStack>
    </VStack>
  );
}
