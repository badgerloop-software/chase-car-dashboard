import {Text, useColorMode, VStack} from "@chakra-ui/react";
import CONSTANTS from "../../data-constants.json";
import RangeBar from "../Shared/RangeBar.js";
import getColor from "../Shared/colors.js";

export default function CellGroup(props) {
    const { colorMode } = useColorMode();

    const voltageConstants = CONSTANTS[`cell_group${props.groupNum}_voltage`];
    const bg = (props.voltage < voltageConstants.MIN || props.voltage > voltageConstants.MAX) ?
        getColor("errorBg", colorMode) : null;
    const borderCol = getColor("border", colorMode);

    return (
        <VStack
            borderWidth={1}
            borderColor={borderCol}
            spacing={0}
            padding={1}
            backgroundColor={bg}
        >
            <Text fontSize='sm'>
                Group {props.groupNum}
            </Text>
            <Text as='b' fontSize='sm'>
                {props.voltage.toFixed(2)} {voltageConstants.UNIT}
            </Text>
            <RangeBar val={props.voltage} min={voltageConstants.MIN} max={voltageConstants.MAX}
                w='99%' h='1.5vh' borderRadius='md' />
        </VStack>
    );
}
