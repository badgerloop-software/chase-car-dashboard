import {Text, VStack, useColorMode} from "@chakra-ui/react"
import RangeBar from "../Shared/RangeBar";
import getColor from "../Shared/colors";

export default function StringCell(props) {
    const { colorMode } = useColorMode();

    const bg = (props.data < props.min || props.data > props.max) ? getColor("errorBg", colorMode) : null;

    return(
        <VStack alignItems='center' bg={bg} spacing='-2px' pb='2px' px='2px'>
            <Text fontSize='1vw'>
                {props.data}
            </Text>
            <RangeBar
                val={props.data}
                w='100%' h='1.25vh'
                min={props.min}
                max={props.max}
            />
        </VStack>
    );
}
