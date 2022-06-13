import {Flex, Text, Spacer} from "@chakra-ui/react"
import RangeBar from "./RangeBar"

export default function RangeCell(props){
    const bg = (props.data < props.min || props.data > props.max) ?
        "#ff000055" : null;

    return(
        <Flex flex='2' direction='column' backgroundColor={bg}>
            <Flex flex='0.4' w={props.w}>
                <Text fontSize={props.fontSize}>{props.label}</Text>
                <Spacer/>
                <Text fontSize={props.fontSize}>{props.data.toFixed(props.digits)}{props.unit}</Text>
            </Flex>
            <RangeBar
                val={props.data ?? -1}
                min={props.min ?? -1}
                max={props.max ?? 0}
                w={props.w}
            />
        </Flex>
    );

}
