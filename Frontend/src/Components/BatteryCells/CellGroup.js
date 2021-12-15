import { Text, VStack } from "@chakra-ui/react";

export default function CellGroup(props) {
    return (
        <VStack
            borderWidth={1}
            borderColor="black"
            spacing={0}
            padding={1}
        >
            <Text as='u' fontSize='sm'>
                Group {props.groupNum}
            </Text>
            <Text fontSize='xs'>
                V: {props.voltage}V
            </Text>
            <Text fontSize='xs'>
                T: {props.temperature}&deg;C
            </Text>
        </VStack>
    );
}
