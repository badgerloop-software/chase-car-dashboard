import { Text, VStack } from "@chakra-ui/react";

export default function CellGroup(props) {
    return (
        <VStack
            flexWrap="wrap"
            borderWidth={1}
            borderColor="black"
            spacing={0}
            padding={1}
        >
            <Text as='u' fontSize='sm'>
                Cell Group {props.groupNum}
            </Text>
            <Text fontSize='sm'>
                V: {props.voltage}
            </Text>
            <Text fontSize='sm'>
                I: {props.current}
            </Text>
        </VStack>
    );
}
