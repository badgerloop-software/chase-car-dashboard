import { Box, Text, VStack } from "@chakra-ui/react";

export default function CellGroup(props) {
    return (
        <VStack
            borderWidth={1}
            borderColor='black'
            spacing={0}
            padding={1}
        >
            <Text as='u' fontSize='sm'>
                Group {props.groupNum}
            </Text>
            <Text fontSize='sm'>
                {props.voltage.toFixed(2)} V
            </Text>
            <Box border='2px' borderRadius='md' w='90%' h='1.5vh'>
                {props.battery}
            </Box>
        </VStack>
    );
}
