import {Flex, Text, Spacer, Box, VStack} from "@chakra-ui/react"

export default function CellString(props){
    return(
        <Flex flex='1' pl='1' pr='1' direction='column'> 
            <Flex flex='0.4'>
                <Text fontSize='md'>{props.label}</Text>
                <Spacer/>
                <Text fontSize='md'>{props.temperature.toFixed(3)}&#8451;</Text>
            </Flex>
            <Box flex='0.6' border='2px'></Box>
        </Flex>
    )

}