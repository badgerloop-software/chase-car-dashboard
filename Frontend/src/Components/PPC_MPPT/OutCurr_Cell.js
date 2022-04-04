import {Flex, Box, Text} from "@chakra-ui/react";

export default function OutCurr_Cell(props) {
    return (
        <Flex w='50%' direction='column' lineHeight='1em'>
            <Box flex='1' border='1px'  borderBottom='0px'  textAlign='center'>
                <Text as='b' fontSize='sm'>{props.label}</Text>
            </Box>
            <Box flex='2' border='1px' textAlign='center' p='1' lineHeight='1.5em'>
                <Text fontSize='xl'>{props.current.toFixed(3)} A</Text>
                <Box h='30%' border='1px'></Box>
            </Box>
        </Flex>
    )
}