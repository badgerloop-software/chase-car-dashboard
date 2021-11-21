import { Circle, Heading, SimpleGrid } from "@chakra-ui/layout";
import { VStack } from "@chakra-ui/react";

export default function TirePressure(props) {
  return (
    <VStack p={2}>
      <Heading size="md">Tire Pressure</Heading>
      <SimpleGrid columns={2} gap={2}>
        <Circle
          size={props.size}
          borderWidth={props.borderWidth}
          borderColor={props.borderColor}
        >
          {props.frontLeftTP}
        </Circle>
        <Circle
          size={props.size}
          borderWidth={props.borderWidth}
          borderColor={props.borderColor}
        >
          {props.frontRightTP}
        </Circle>
        <Circle
          size={props.size}
          borderWidth={props.borderWidth}
          borderColor={props.borderColor}
        >
          {props.backLeftTP}
        </Circle>
        <Circle
          size={props.size}
          borderWidth={props.borderWidth}
          borderColor={props.borderColor}
        >
          {props.backRightTP}
        </Circle>
      </SimpleGrid>
    </VStack>
  );
}
