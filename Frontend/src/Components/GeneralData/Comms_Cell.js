import {Flex, Image, Text} from "@chakra-ui/react";
import CheckMark from "./DriverIcons/Check Mark.png"
import CrossMark from "./DriverIcons/Cross Mark.png"

export default function Comms_Cell(props) {
    return(
        <Flex alignItems='center'>
            {props.boolean ? <Image boxSize='2vh' src={Check_Mark}/> : <Image boxSize='2vh' src={Cross_Mark}/>}
            <Text fontSize='2vh'>&#160;{props.label}</Text>
        </Flex>
    );
}