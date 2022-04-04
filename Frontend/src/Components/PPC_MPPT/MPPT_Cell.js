import {Box, Text} from "@chakra-ui/react"

export default function MPPT_Cell(props){
    return (
        <Box 
        h='45%' 
        bg={props.boolean? '#05FF00':'#FF010140'}
        border='2px' 
        textAlign='center'
        >
            <Text as='b' fontSize='md'>{props.label}</Text>
        </Box>
    )

}