import {Flex, Text, Spacer, Box} from "@chakra-ui/react"

export default function CellString(props){
    return(
        <Flex flex='2' pl='1' pr='1' direction='column'> 
            <Flex flex='0.4'>
                <Text fontSize='1vw'>{props.label}</Text>
                <Spacer/>
                <Text fontSize='1vw'>{props.temperature.toFixed(3)}&#8451;</Text>
            </Flex>
            <Box h='1.5vh' border='2px'></Box>
        </Flex>
    )

}
