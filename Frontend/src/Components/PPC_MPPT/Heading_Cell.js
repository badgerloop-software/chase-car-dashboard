import {Box, Heading} from "@chakra-ui/react";

export default function Heading_Cell(props) {
    return (
        <Box bg='#DDDDDD' borderTop='1px' borderBottom='1px' textAlign='center' lineHeight='1'>
            <Heading as='b' fontSize='1.1vw'>{props.label}</Heading>
        </Box>
    )
}