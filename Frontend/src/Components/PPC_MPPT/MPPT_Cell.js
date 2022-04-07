import {Box, Text, Center} from "@chakra-ui/react"

export default function MPPT_Cell(props){
    return (
        <Center 
            h='45%' 
            bg={props.boolean? '#05FF00':'#FF010140'}
            border='2px' 
            textAlign='center'
            lineHeight='1.6em'
        >
            <Text as='b' fontSize='1.5vw'>{props.label}</Text>
        </Center>
    )

}