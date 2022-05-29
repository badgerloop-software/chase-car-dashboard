import {Flex, Text, Spacer} from "@chakra-ui/react"
import RangeBar from "./RangeBar"
import dataConstants from  "../../data-constants.json"

export default function RangeCell(props) {

    const MIN = dataConstants.string2_temp.MIN
    const MAX = dataConstants.string2_temp.MAX
    const UNIT = dataConstants.string2_temp.UNIT

    const bg = ((props.data < MIN && !props.ignoreMin) || (props.data > MAX && !props.ignoreMax)) ?
        "#ff000055" : null;

    return(
        <Flex flex='2' direction='column' backgroundColor={bg}>
            <Flex flex='0.4'>
                <Text fontSize={props.fontSize}>{props.label}</Text>
                <Spacer/>
                <Text fontSize={props.fontSize}>{props.data.toFixed(props.digits)}{UNIT}</Text>
            </Flex>
            <RangeBar
                val={props.data ?? -1}
                w={props.w}
            />
        </Flex>
    );

}


