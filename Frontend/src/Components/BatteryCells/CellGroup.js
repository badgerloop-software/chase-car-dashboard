import { Box, Text, VStack } from "@chakra-ui/react";
import CONSTANTS from "../../data-constants.json";

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
            <Box border='2px' borderRadius='md' w='90%' h='1.5vh'>
                {props.battery}
            </Box>
        </VStack>
    );
}
