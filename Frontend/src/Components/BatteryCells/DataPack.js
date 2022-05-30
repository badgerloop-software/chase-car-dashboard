import { Center, Flex, Spacer, Text } from "@chakra-ui/react";

export default function DataPack(props) {
    const bg = (props.dataValue < props.dataMin || props.dataValue > props.dataMax) ?
        "#ff000055" : props.bg;

    return (
        <Center
            borderWidth={1}
            borderColor='black'
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
