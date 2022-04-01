import { Heading, HStack, Text, VStack } from "@chakra-ui/react";

export default function Faults(props) {
  return (
    <VStack>
      <Heading size="md">Faults</Heading>
      <HStack flexWrap="wrap">
        <Text>Driver E-Stop {props.data?.driver_eStop[0].toString()}</Text>
        <Text>BPS Fault {props.data?.bps_fault[0].toString()}</Text>
      </HStack>
    </VStack>
  );
}
