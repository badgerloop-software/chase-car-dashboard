import { Flex, Heading, SimpleGrid, Spacer, VStack } from "@chakra-ui/react";
import CellGroup from "./CellGroup";

export default function BatteryCells(props) {
  return (
    <VStack>
      <Flex w="90%" align="stretch">
        <Heading size="sm">Pack Current: {props.data?.pack_current[0]}</Heading>
        <Spacer />
        <Heading size="sm">Pack Voltage: {props.data?.pack_voltage[0]}</Heading>
        <Spacer />
        <Heading size="sm">
          Pack Temperature: {props.data?.pack_temp[0]}
        </Heading>
      </Flex>
      <Heading size="xs">Battery Cells</Heading>
      <SimpleGrid
        columns={6}
        rows={5}
        spacingX={"0.25vw"}
        spacingY={"0.25vh"}
        overflowY="scroll"
        maxHeight="27.5vh"
      >
        <CellGroup
          groupNum={1}
          voltage={props.data?.cell_group1_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={2}
          voltage={props.data?.cell_group2_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={3}
          voltage={props.data?.cell_group3_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={4}
          voltage={props.data?.cell_group4_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={5}
          voltage={props.data?.cell_group5_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={6}
          voltage={props.data?.cell_group6_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={7}
          voltage={props.data?.cell_group7_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={8}
          voltage={props.data?.cell_group8_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={9}
          voltage={props.data?.cell_group9_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={10}
          voltage={props.data?.cell_group10_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={11}
          voltage={props.data?.cell_group11_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={12}
          voltage={props.data?.cell_group12_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={13}
          voltage={props.data?.cell_group13_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={14}
          voltage={props.data?.cell_group14_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={15}
          voltage={props.data?.cell_group15_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={16}
          voltage={props.data?.cell_group16_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={17}
          voltage={props.data?.cell_group17_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={18}
          voltage={props.data?.cell_group18_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={19}
          voltage={props.data?.cell_group19_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={20}
          voltage={props.data?.cell_group20_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={21}
          voltage={props.data?.cell_group21_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={22}
          voltage={props.data?.cell_group22_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={23}
          voltage={props.data?.cell_group23_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={24}
          voltage={props.data?.cell_group24_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={25}
          voltage={props.data?.cell_group25_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={26}
          voltage={props.data?.cell_group26_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={27}
          voltage={props.data?.cell_group27_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={28}
          voltage={props.data?.cell_group28_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={29}
          voltage={props.data?.cell_group29_voltage[0] ?? 5.0}
          temperature={2.5}
        />
        <CellGroup
          groupNum={30}
          voltage={props.data?.cell_group30_voltage[0] ?? 5.0}
          temperature={2.5}
        />
      </SimpleGrid>
    </VStack>
  );
}
