import {Box, Text} from "@chakra-ui/react";

export default function PPC_Cell(props) {
    return (
        <Box 
        w='47%' 
        bg={props.boolean ? '#05FF00':'#FF010140'}
        border='2px' 
        textAlign='center' 
        lineHeight='1em'
        >
            <Text as='b' fontSize='sm'>{props.label}</Text>
        </Box>
    )
}