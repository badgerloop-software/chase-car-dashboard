import { Box, Flex, Image} from "@chakra-ui/react";

export default function IconCell(props) {
    return(
        <Flex>{props.boolean ? <Image boxSize={props.boxSize} src={props.image}/> : <Box h={props.boxSize}></Box>}</Flex>
    );
}