import { Box, SimpleGrid } from "@chakra-ui/react";
import DriverComms from "./DriverComms"

export default function DataView(props) {
  return (
    <SimpleGrid h="100%" rows={1} columns={2}>
      <DriverComms data={props.data}/>
      <Box/>
    </SimpleGrid>
  );
}
