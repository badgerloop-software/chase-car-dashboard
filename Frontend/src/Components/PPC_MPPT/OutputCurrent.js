import {Flex, Box, Text, useColorMode} from "@chakra-ui/react";
import RangeBar from "../Shared/RangeBar";
import getColor from "../Shared/colors";

export default function OutputCurrent(props) {
    const { colorMode } = useColorMode();

    const borderCol = getColor("border", colorMode);
    const bg = (props.current < props.currentMin || props.current > props.currentMax) ?
               getColor("errorBg", colorMode) : null;

    return (
        <Flex w='50%' direction='column'>
            <Box flex='1' borderColor={borderCol} borderWidth='2px'  borderBottom='0px'  textAlign='center'>
                <Text as='b' fontSize='1vw'>{props.label}</Text>
            </Box>
            <Box flex='2' borderColor={borderCol} borderWidth='2px' textAlign='center' p='1' lineHeight='3vh' backgroundColor={bg}>
                <Text fontSize='1.5vw'>{props.current.toFixed(3)} A</Text>
                <RangeBar val={props.current} min={props.currentMin} max={props.currentMax} />
            </Box>
        </Flex>
    )
}
