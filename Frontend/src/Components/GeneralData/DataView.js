import { SimpleGrid } from "@chakra-ui/react";
import DriverComms from "./DriverComms";
import IOView from "./IOView";

export default function DataView(props) {
  return (
    <SimpleGrid h="100%" rows={1} columns={2}>
      <DriverComms data={props.data}/>
      <IOView data={props.data}/>
    </SimpleGrid>
  );
}
