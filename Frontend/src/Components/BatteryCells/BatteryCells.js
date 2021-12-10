import { SimpleGrid, Heading, Text, VStack } from "@chakra-ui/react";
import CellGroup from "./CellGroup";

export default function BatteryCells(props) {
    return (
        <VStack>
            <Heading size="xs">Battery Cells</Heading>
            <SimpleGrid columns={4} rows={3} spacingX={'0.5vw'} spacingY={'0.5vh'}>
                <CellGroup
                    groupNum={1}
                    voltage={props.data?.batteryGroup1 ?? 5.0}
                    current={2.5}
                />
                <CellGroup
                    groupNum={2}
                    voltage={props.data?.batteryGroup2 ?? 5.0}
                    current={2.5}
                />
                <CellGroup
                    groupNum={3}
                    voltage={props.data?.batteryGroup3 ?? 5.0}
                    current={2.5}
                />
                <CellGroup
                    groupNum={4}
                    voltage={props.data?.batteryGroup4 ?? 5.0}
                    current={2.5}
                />
                <CellGroup
                    groupNum={5}
                    voltage={5.5}
                    current={2.5}
                />
                <CellGroup
                    groupNum={6}
                    voltage={5.5}
                    current={2.5}
                />
                <CellGroup
                    groupNum={7}
                    voltage={5.5}
                    current={2.5}
                />
                <CellGroup
                    groupNum={8}
                    voltage={5.5}
                    current={2.5}
                />
                <CellGroup
                    groupNum={9}
                    voltage={5.5}
                    current={2.5}
                />
                <CellGroup
                    groupNum={10}
                    voltage={5.5}
                    current={2.5}
                />
                <CellGroup
                    groupNum={11}
                    voltage={5.5}
                    current={2.5}
                />
                <CellGroup
                    groupNum={12}
                    voltage={5.5}
                    current={2.5}
                />
            </SimpleGrid>
        </VStack>
    );
}
