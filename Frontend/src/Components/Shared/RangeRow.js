import {Flex, Center, Text, Spacer, useColorMode} from "@chakra-ui/react";
import getColor from "../Shared/colors";
import RangeBar from "./RangeBar";

export default function RangeRow(props) {
    const { colorMode } = useColorMode();
    const borderColor = getColor("border", colorMode);

    const bg = (props.dataValue < props.dataConstant.MIN || props.dataValue > props.dataConstant.MAX) ?
        getColor("errorBg", colorMode) : props.bg;

    // set the decimal point to 3 by default
    const decPoint = (props.DecimalPoint !== undefined) ? props.DecimalPoint : 3;
    
    let lineHeight;
    let textSize;
    let rangeBarHeight;
    if (props.size === 'sm' || props.size === undefined) {
        lineHeight = '1.2em';
        textSize = 'sm';
        rangeBarHeight = '1em';
    } else if (props.size === 'md') {
        lineHeight = '1.6em';
        textSize = 'md';
        rangeBarHeight = '1.4em';
    } else if (props.size === 'lg') {
        lineHeight = '2em';
        textSize = 'lg';
        rangeBarHeight = '1.8em';
    }

    return (
        <Center
            borderTopWidth={1}
            borderBottomWidth={props.borderBottomWidth ?? 1}
            borderColor={borderColor}
            bg={bg}
            lineHeight={lineHeight}
            height='100%'
        >
            <Flex w='95%'>
                <Text fontSize={textSize}>{props.dataTitle}:</Text>
                <Spacer />
                <Text fontSize={textSize} css={{paddingRight: "0.5em"}}>
                    {props.dataValue.toFixed(decPoint)} {props.dataConstant.UNIT}
                </Text>
                <RangeBar 
                    w={props.w ?? '3em'} 
                    h={rangeBarHeight}
                    borderRadius='0px' 

                    val={props.dataValue}
                    min={props.dataConstant.MIN}
                    max={props.dataConstant.MAX}
                />
            </Flex>
        </Center>
    );
}