import {Flex, Text, Spacer, Box} from "@chakra-ui/react"

export default function CellString(props){
    return(
        <Flex flex='1' direction='column' pl='1' pr='1'> 
            <Flex flex='1'>
                <Text fontSize='sm'>{props.label}</Text>
                <Spacer/>
                <Text fontSize='sm'>{props.temperature.toFixed(3)}&#8451;</Text>
            </Flex>
            <Box flex='0.3' border='2px'></Box>
        </Flex>
    )

}