import { Flex, Spacer, SimpleGrid, Heading, Text, VStack } from "@chakra-ui/react";
import CellGroup from "./CellGroup";

export default function BatteryCells(props) {
    return (
        <VStack>
            <Flex w="90%" align="stretch">
                <Heading size="sm">
                    Pack Current: {props.data?.batteryCurrent[0]}
                </Heading>
                <Spacer />
                <Heading size="sm">
                    Pack Temperature: {props.data?.batteryTemp[0]}
                </Heading>
            </Flex>
            <Heading size="xs">Battery Cells</Heading>
            <SimpleGrid columns={6} rows={5} spacingX={'0.25vw'} spacingY={'0.25vh'} >
                <CellGroup
                    groupNum={1}
                    voltage={props.data?.batteryGroup1[0] ?? 5.0}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={2}
                    voltage={props.data?.batteryGroup2[0] ?? 5.0}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={3}
                    voltage={props.data?.batteryGroup3[0] ?? 5.0}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={4}
                    voltage={props.data?.batteryGroup4[0] ?? 5.0}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={5}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={6}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={7}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={8}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={9}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={10}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={11}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={12}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={13}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={14}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={15}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={16}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={17}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={18}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={19}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={20}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={21}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={22}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={23}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={24}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={25}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={26}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={27}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={28}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={29}
                    voltage={5.5}
                    temperature={2.5}
                />
                <CellGroup
                    groupNum={30}
                    voltage={5.5}
                    temperature={2.5}
                />
            </SimpleGrid>
        </VStack>
    );
}