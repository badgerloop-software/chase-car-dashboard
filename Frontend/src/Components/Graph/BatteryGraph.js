import { Center, HStack, Text } from "@chakra-ui/react";

export default function BatteryGraph(props) {
  return (
    <HStack h="100%" align="stretch">
      <Text
        css={{ writingMode: "vertical-lr" }}
        transform="rotate(180deg)"
        borderLeftColor="grey.300"
        borderLeftWidth={1}
        textAlign="center"
      >
        Battery
      </Text>
      <Center flex={1}>Battery Graph</Center>
    </HStack>
  );
}
