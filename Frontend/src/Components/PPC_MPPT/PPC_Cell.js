import {Box, Text, Center} from "@chakra-ui/react";

export default function PPC_Cell(props) {
    return (
        <Center 
            w='47%' 
            bg={props.boolean ? '#05FF00':'#FF010140'}
            border='2px' 
            textAlign='center' 
            lineHeight='2vh'
        >
            <Text as='b' fontSize='1vw'>{props.label}</Text>
        </Center>
    )
}