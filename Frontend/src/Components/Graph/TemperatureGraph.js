import { Center, HStack, Text } from "@chakra-ui/react";

export default function TemperatureGraph(props) {
  return (
    <HStack h="100%" align="stretch">
      <Text
        css={{ writingMode: "vertical-lr" }}
        transform="rotate(180deg)"
        borderLeftColor="grey.300"
        borderLeftWidth={1}
        textAlign="center"
      >
        Temperature
      </Text>
      <Center flex={1}>Temperature Graph</Center>
    </HStack>
  );
}
