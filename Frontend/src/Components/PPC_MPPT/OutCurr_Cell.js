import {Flex, Box, Text, Spacer} from "@chakra-ui/react";

export default function OutCurr_Cell(props) {
    return (
        <Flex w='50%' direction='column'>
            <Box flex='1' border='1px'  borderBottom='0px'  textAlign='center'>
                <Text as='b' fontSize='1vw'>{props.label}</Text>
            </Box>
            <Box flex='2' border='1px' textAlign='center' p='1' lineHeight='3vh'>
                <Text fontSize='1.5vw'>{props.current.toFixed(3)} A</Text>
                <Box h='0.7vw' border='1px'></Box>
            </Box>
        </Flex>
    )
}