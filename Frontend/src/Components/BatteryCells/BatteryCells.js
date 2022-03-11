import { Box, Flex, Spacer, SimpleGrid, Heading, Text, VStack } from "@chakra-ui/react";
import CellGroupL from "./CellGroupL";
import CellGroupR from "./CellGroupR";


export default function BatteryCells(props) {
    return (
        <VStack>
            <SimpleGrid
                columns={2}
                rows={1}
                spacingX={'0.25vw'}
            >
                <SimpleGrid
                    columns={1}
                    overflowY="scroll"
                    maxHeight="40vh"
                >
                    <CellGroupL
                        dataTitle="Power Input Voltage"
                        dataValue={props.data?.bms_input_voltage[0] ?? 5.0}
                        dataUnit="V"
                        bg='#DDDDDD'
                    />
                    <CellGroupL
                        dataTitle="Pack State of Charge"
                        dataValue={props.data?.soc[0] ?? 5.0}
                        dataUnit="%"
                    />
                    <CellGroupL
                        dataTitle="Pack Current"
                        dataValue={props.data?.pack_current[0] ?? 5.0}
                        dataUnit="A"
                        bg='#DDDDDD'
                    />
                    <CellGroupL
                        dataTitle="Pack Voltage"
                        dataValue={props.data?.pack_voltage[0] ?? 5.0}
                        dataUnit="V"
                    />
                    <CellGroupL
                        dataTitle="Pack Power Out"
                        dataValue={(props.data?.pack_voltage[0] * props.data?.pack_current[0]) ?? 5.0}
                        dataUnit="V"
                        bg='#DDDDDD'
                    />
                    <CellGroupL
                        dataTitle="Pack Temperature"
                        dataValue={props.data?.pack_temp[0] ?? 5.0}
                        dataUnit="&#8451;"
                    />
                    <CellGroupL
                        dataTitle="Fan Speed"
                        dataValue={props.data?.fan_speed[0] ?? 5.0}
                        dataUnit=""
                        bg='#DDDDDD'
                    />
                    <CellGroupL
                        dataTitle="Pack Resistance"
                        dataValue={props.data?.pack_resistance[0] ?? 5.0}
                        dataUnit="m&#937;"
                    />
                    <CellGroupL
                        dataTitle="Avg Cell Internal Resist"
                        dataValue={props.data?.avg_cell_resistance[0] ?? 5.0}
                        dataUnit="m&#937;"
                        bg='#DDDDDD'
                    />
                    <CellGroupL
                        dataTitle="Pack Capacity"
                        dataValue={props.data?.pack_capacity[0] ?? 5.0}
                        dataUnit="Ah"
                    />
                    <CellGroupL
                        dataTitle="Adaptive Total Capacity"
                        dataValue={props.data?.adaptive_total_capacity[0] ?? 5.0}
                        dataUnit="Ah"
                        bg='#DDDDDD'
                    />
                    <CellGroupL
                        dataTitle="Pack State of Health"
                        dataValue={props.data?.soh[0] ?? 5.0}
                        dataUnit="Ah"
                    />
                </SimpleGrid>
                <SimpleGrid
                    columns={4}
                    rows={10}
                    spacingX={'0.25vw'}
                    spacingY={'0.25vh'}
                    overflowY="scroll"
                    maxHeight="40vh"
                >
                    <CellGroupR
                        groupNum={1}
                        voltage={props.data?.cell_group1_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={2}
                        voltage={props.data?.cell_group2_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={3}
                        voltage={props.data?.cell_group3_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={4}
                        voltage={props.data?.cell_group4_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={5}
                        voltage={props.data?.cell_group5_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={6}
                        voltage={props.data?.cell_group6_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={7}
                        voltage={props.data?.cell_group7_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={8}
                        voltage={props.data?.cell_group8_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={9}
                        voltage={props.data?.cell_group9_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={10}
                        voltage={props.data?.cell_group10_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={11}
                        voltage={props.data?.cell_group11_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={12}
                        voltage={props.data?.cell_group12_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={13}
                        voltage={props.data?.cell_group13_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={14}
                        voltage={props.data?.cell_group14_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={15}
                        voltage={props.data?.cell_group15_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={16}
                        voltage={props.data?.cell_group16_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={17}
                        voltage={props.data?.cell_group17_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={18}
                        voltage={props.data?.cell_group18_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={19}
                        voltage={props.data?.cell_group19_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={20}
                        voltage={props.data?.cell_group20_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={21}
                        voltage={props.data?.cell_group21_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={22}
                        voltage={props.data?.cell_group22_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={23}
                        voltage={props.data?.cell_group23_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={24}
                        voltage={props.data?.cell_group24_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={25}
                        voltage={props.data?.cell_group25_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={26}
                        voltage={props.data?.cell_group26_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={27}
                        voltage={props.data?.cell_group27_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={28}
                        voltage={props.data?.cell_group28_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={29}
                        voltage={props.data?.cell_group29_voltage[0] ?? 5.0}
                    />
                    <CellGroupR
                        groupNum={30}
                        voltage={props.data?.cell_group30_voltage[0] ?? 5.0}
                    />
                </SimpleGrid>
            </SimpleGrid>
        </VStack>
    );
}
