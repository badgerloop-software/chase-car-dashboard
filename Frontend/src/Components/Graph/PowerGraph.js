import { Center, HStack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import GraphContext from "../Graph/GraphContext";

export default function PowerGraph(props) {
  const graphData = useContext(GraphContext);
  return (
    <HStack h="100%" align="stretch">
      <Text
        css={{ writingMode: "vertical-lr" }}
        transform="rotate(180deg)"
        borderLeftColor="grey.300"
        borderLeftWidth={1}
        textAlign="center"
      >
        Power
      </Text>
      <Center flex={1}>
        Power Graph
        <br />
        {JSON.stringify(graphData?.motorPower)}
      </Center>
    </HStack>
  );
}
