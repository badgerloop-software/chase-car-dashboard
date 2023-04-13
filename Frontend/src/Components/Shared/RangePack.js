import {Flex, Center, Text, Spacer, useColorMode} from "@chakra-ui/react";
import getColor from "../Shared/colors";
import RangeBar from "./RangeBar";

export default function RangePack(props) {
    const { colorMode } = useColorMode();
    const borderColor = getColor("border", colorMode);

    const bg = (props.dataValue < props.dataMin || props.dataValue > props.dataMax) ?
        getColor("errorBg", colorMode) : props.bg;

    // set the decimal point to 3 by default
    const decPoint = (props.DecimalPoint !== undefined) ? props.DecimalPoint : 3;

    return (
        <Center
            borderTopWidth={1}
            borderBottomWidth={props.borderBottomWidth ?? 1}
            borderColor={borderColor}
            bg={bg}
            lineHeight='1.2em'
            height='100%'
        >
            <Flex w='95%'>
                <Text fontSize='sm'>{props.dataTitle}:</Text>
                <Spacer />
                <Text fontSize='sm'>
                    {props.dataValue.toFixed(decPoint)} {props.dataUnit}
                </Text>
                <Spacer />
                <RangeBar 
                    w={props.w ?? '3em'} 
                    h='1em'
                    borderRadius='0px' 

                    val={props.dataValue}
                    min={props.dataMin}
                    max={props.dataMax}
                />
            </Flex>
        </Center>
    );
}