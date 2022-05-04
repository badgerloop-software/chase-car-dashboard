import { Box, Text, VStack } from "@chakra-ui/react";
import CONSTANTS from "../../data-constants.json";
import RangeBar from "../Shared/RangeBar";

export default function CellGroup(props) {
    const voltageConstants = CONSTANTS[`cell_group${props.groupNum}_voltage`];
    const bg = (props.voltage < voltageConstants.MIN || props.voltage > voltageConstants.MAX) ?
        "#ff000055" : null;

    return (
        <VStack
            borderWidth={1}
            borderColor='black'
            spacing={0}
            padding={1}
            backgroundColor={bg}
        >
            <Text as='u' fontSize='sm'>
                Group {props.groupNum}
            </Text>
            <Text fontSize='sm'>
                {props.voltage.toFixed(2)} {voltageConstants.UNIT}
            </Text>
            <RangeBar val={props.battery} min={voltageConstants.MIN} max={voltageConstants.MAX} 
                w='99%' h='1.5vh' borderRadius='md' />
        </VStack>
    );
}
