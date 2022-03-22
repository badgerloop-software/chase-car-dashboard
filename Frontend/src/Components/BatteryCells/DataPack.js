import { Box, Text, VStack, Flex, Spacer } from "@chakra-ui/react";

export default function DataPack(props) {
    return (
        <VStack
            borderWidth={1}
            borderColor='black'
            spacing={0}
            bg={props.bg}
        >
            <Flex w='95%'>
                <Text fontSize='xs'>
                    {props.dataTitle}:
                </Text>
                <Spacer />
                <Text fontSize='xs'>
                    {props.dataValue.toFixed(3)}{props.dataUnit}
                </Text>
            </Flex>
            <Box border='1px' w='15vw' h='0.7vh'>
                {props.battery}
            </Box>
        </VStack>
    );
}
