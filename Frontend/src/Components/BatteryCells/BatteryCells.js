import { SimpleGrid, VStack } from "@chakra-ui/react";
import DataPack from "./DataPack";
import CellGroup from "./CellGroup";


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
                    <DataPack
                        dataTitle="Power Input Voltage"
                        dataValue={props.data?.bms_input_voltage[0] ?? 5.0}
                        dataUnit="V"
                        bg='#DDDDDD'
                    />
                    <DataPack
                        dataTitle="Pack State of Charge"
                        dataValue={props.data?.soc[0] ?? 5.0}
                        dataUnit="%"
                    />
                    <DataPack
                        dataTitle="Pack Current"
                        dataValue={props.data?.pack_current[0] ?? 5.0}
                        dataUnit="A"
                        bg='#DDDDDD'
                    />
                    <DataPack
                        dataTitle="Pack Voltage"
                        dataValue={props.data?.pack_voltage[0] ?? 5.0}
                        dataUnit="V"
                    />
                    <DataPack
                        dataTitle="Pack Power Out"
                        dataValue={(props.data?.pack_voltage[0] * props.data?.pack_current[0]) ?? 5.0}
                        dataUnit="V"
                        bg='#DDDDDD'
                    />
                    <DataPack
                        dataTitle="Pack Temperature"
                        dataValue={props.data?.pack_temp[0] ?? 5.0}
                        dataUnit="&#8451;"
                    />
                    <DataPack
                        dataTitle="Fan Speed"
                        dataValue={props.data?.fan_speed[0] ?? 5.0}
                        dataUnit=""
                        bg='#DDDDDD'
                    />
                    <DataPack
                        dataTitle="Pack Resistance"
                        dataValue={props.data?.pack_resistance[0] ?? 5.0}
                        dataUnit="m&#937;"
                    />
                    <DataPack
                        dataTitle="Avg Cell Internal Resist"
                        dataValue={props.data?.avg_cell_resistance[0] ?? 5.0}
                        dataUnit="m&#937;"
                        bg='#DDDDDD'
                    />
                    <DataPack
                        dataTitle="Pack Capacity"
                        dataValue={props.data?.pack_capacity[0] ?? 5.0}
                        dataUnit="Ah"
                    />
                    <DataPack
                        dataTitle="Adaptive Total Capacity"
                        dataValue={props.data?.adaptive_total_capacity[0] ?? 5.0}
                        dataUnit="Ah"
                        bg='#DDDDDD'
                    />
                    <DataPack
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
                    <CellGroup
                        groupNum={1}
                        voltage={props.data?.cell_group1_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={2}
                        voltage={props.data?.cell_group2_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={3}
                        voltage={props.data?.cell_group3_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={4}
                        voltage={props.data?.cell_group4_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={5}
                        voltage={props.data?.cell_group5_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={6}
                        voltage={props.data?.cell_group6_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={7}
                        voltage={props.data?.cell_group7_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={8}
                        voltage={props.data?.cell_group8_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={9}
                        voltage={props.data?.cell_group9_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={10}
                        voltage={props.data?.cell_group10_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={11}
                        voltage={props.data?.cell_group11_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={12}
                        voltage={props.data?.cell_group12_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={13}
                        voltage={props.data?.cell_group13_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={14}
                        voltage={props.data?.cell_group14_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={15}
                        voltage={props.data?.cell_group15_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={16}
                        voltage={props.data?.cell_group16_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={17}
                        voltage={props.data?.cell_group17_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={18}
                        voltage={props.data?.cell_group18_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={19}
                        voltage={props.data?.cell_group19_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={20}
                        voltage={props.data?.cell_group20_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={21}
                        voltage={props.data?.cell_group21_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={22}
                        voltage={props.data?.cell_group22_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={23}
                        voltage={props.data?.cell_group23_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={24}
                        voltage={props.data?.cell_group24_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={25}
                        voltage={props.data?.cell_group25_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={26}
                        voltage={props.data?.cell_group26_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={27}
                        voltage={props.data?.cell_group27_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={28}
                        voltage={props.data?.cell_group28_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={29}
                        voltage={props.data?.cell_group29_voltage[0] ?? 5.0}
                    />
                    <CellGroup
                        groupNum={30}
                        voltage={props.data?.cell_group30_voltage[0] ?? 5.0}
                    />
                </SimpleGrid>
            </SimpleGrid>
        </VStack>
    );
}
