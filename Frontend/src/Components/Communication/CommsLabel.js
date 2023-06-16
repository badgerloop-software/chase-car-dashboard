import {Flex, Box, Image, Text} from "@chakra-ui/react";
import CheckMark from "./CommsIcons/Check Mark.png"
import CrossMark from "./CommsIcons/Cross Mark.png"

export default function CommsLabel(props) {
    return(
        <Flex alignItems='center'>
            {props.indent && <Box w='3vh' />}
            {props.boolean ? <Image boxSize='2vh' src={CheckMark}/> : <Image boxSize='2vh' src={CrossMark}/>}
            <Text fontSize='2vh'>&#160;{props.label}</Text>
        </Flex>
    );
}
