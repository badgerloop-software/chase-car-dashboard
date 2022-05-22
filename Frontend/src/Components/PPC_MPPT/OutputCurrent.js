import {Flex, Box, Text} from "@chakra-ui/react";
import RangeBar from "../Shared/RangeBar";

export default function OutputCurrent(props) {
    const bg = (props.current < props.currentMin || props.current > props.currentMax) ?
        "#ff000055" : null;

    return (
        <Flex w='50%' direction='column'>
            <Box flex='1' border='1px'  borderBottom='0px'  textAlign='center'>
                <Text as='b' fontSize='1vw'>{props.label}</Text>
            </Box>
            <Box flex='2' border='1px' textAlign='center' p='1' lineHeight='3vh' backgroundColor={bg}>
                <Text fontSize='1.5vw'>{props.current.toFixed(3)} A</Text>
                <RangeBar val={props.current} min={props.currentMin} max={props.currentMax} />
            </Box>
        </Flex>
    )
}
