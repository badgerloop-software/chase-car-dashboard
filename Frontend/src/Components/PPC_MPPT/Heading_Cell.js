import {Box, Heading} from "@chakra-ui/react";

export default function Heading_Cell(props) {
    return (
        <Box bg='#DDDDDD' borderTop='1px' borderBottom='1px' textAlign='center'>
            <Heading as='b' fontSize='sm'>{props.label}</Heading>
        </Box>
    )
}