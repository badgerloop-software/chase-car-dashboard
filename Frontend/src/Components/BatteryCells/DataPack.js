import { Box, Text, VStack, Flex, Spacer, Center } from "@chakra-ui/react";

export default function DataPack(props) {
    return (
        <Center
            borderWidth={1}
            borderColor='black'
            bg={props.bg}
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
