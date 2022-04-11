import {Flex, Text, Spacer, Box} from "@chakra-ui/react"

export default function CellString(props){
    return(
        <Flex flex='2' pl='1' pr='1' direction='column'>
            <Flex flex='0.4'>
                <Text fontSize={props.fontSize}>{props.label}</Text>
                <Spacer/>
                <Text fontSize={props.fontSize}>{props.dataType.toFixed(props.digits)}{props.unitType}</Text>
            </Flex>
            <Box h='1.5vh' border='2px'></Box>
        </Flex>
    )

}
