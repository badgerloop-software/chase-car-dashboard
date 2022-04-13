import { Box, SimpleGrid } from "@chakra-ui/react";
import Driver_Comms from "./Driver_Comms"

export default function DataView(props) {
  return (
    <SimpleGrid h="100%" rows={1} columns={2}>
      <Driver_Comms data={props.data}/>
      <Box/>
    </SimpleGrid>
  );
}
