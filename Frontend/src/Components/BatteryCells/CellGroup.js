import { Box, Text, VStack } from "@chakra-ui/react";

export default function CellGroup(props) {
    return (
        <VStack
            borderWidth={1}
            borderColor="black"
            spacing={0}
            padding={1}
        >
            <Text as='u' fontSize='xs'>
                Group{props.groupNum}
            </Text>
            <Text fontSize='sm'>
                {props.voltage.toFixed(2)}V
            </Text>

            <Box border="2px" borderRadius='md' w = '3.5vw' h = '2.5vh'>
                {props.battery}
            </Box>


        </VStack>
    );
}
