import {Flex, Text, Spacer} from "@chakra-ui/react"
import RangeBar from "./RangeBar"

export default function RangeCell(props){
    return(
        <Flex flex='2' direction='column'>
            <Flex flex='0.4'>
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