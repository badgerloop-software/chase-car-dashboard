import {Center, Flex, Spacer, Text, useColorMode} from "@chakra-ui/react";
import getColor from "../Shared/colors";

export default function DataPack(props) {
    const { colorMode } = useColorMode();

    const borderCol = getColor("border", colorMode);

    const bg = (props.dataValue < props.dataMin || props.dataValue > props.dataMax) ?
        getColor("errorBg", colorMode) : props.bg;

    return (
        <Center
            borderTopWidth={1}
            borderBottomWidth={props.borderBottomWidth ?? 1}
            borderColor={borderCol}
            bg={bg}
            lineHeight='1.2em'
            height='100%'
        >
            <Flex w='95%'>
                <Text fontSize='sm'>
                    {props.dataTitle}:
                </Text>
                <Spacer />
                <Text fontSize='sm'>
                    {props.dataValue.toFixed(props.DecimalPoint)} {props.dataUnit}
                </Text>
            </Flex>
        </Center>
    );
}
