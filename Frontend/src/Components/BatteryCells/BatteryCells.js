import { Flex, SimpleGrid } from "@chakra-ui/react";
import DataPack from "./DataPack";
import CellGroup from "./CellGroup";
import CONSTANTS from "../../data-constants.json";

export default function BatteryCells(props) {
    return (
        <SimpleGrid
            columns={2}
            rows={1}
            spacingX={'0.25vw'}
            h="calc(100% - 26px)" // Calculate height of container (100%) - height of Select (24px) and border (2px)
        >
            <Flex
                direction="column"
            >
                <DataPack
                    dataTitle="Power Input Voltage"
                    dataValue={props.data?.bms_input_voltage[0] ?? -1.0}
                    dataUnit={CONSTANTS.bms_input_voltage.UNIT}
                    dataMin={CONSTANTS.bms_input_voltage.MIN}
                    dataMax={CONSTANTS.bms_input_voltage.MAX}
                    bg='#DDDDDD'
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Pack State of Charge"
                    dataValue={props.data?.soc[0] ?? -1.0}
                    dataUnit={CONSTANTS.soc.UNIT}
                    dataMin={CONSTANTS.soc.MIN}
                    dataMax={CONSTANTS.soc.MAX}
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Pack Current"
                    dataValue={props.data?.pack_current[0] ?? -1.0}
                    dataUnit={CONSTANTS.pack_current.UNIT}
                    dataMin={CONSTANTS.pack_current.MIN}
                    dataMax={CONSTANTS.pack_current.MAX}
                    bg='#DDDDDD'
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Pack Voltage"
                    dataValue={props.data?.pack_voltage[0] ?? -1.0}
                    dataUnit={CONSTANTS.pack_voltage.UNIT}
                    dataMin={CONSTANTS.pack_voltage.MIN}
                    dataMax={CONSTANTS.pack_voltage.MAX}
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Pack Power Out"
                    dataValue={(props.data?.pack_voltage[0] * props.data?.pack_current[0]) ?? -1.0}
                    dataUnit="W"
                    dataMin={CONSTANTS.pack_voltage.MIN * CONSTANTS.pack_current.MIN}
                    dataMax={CONSTANTS.pack_voltage.MAX * CONSTANTS.pack_current.MAX}
                    bg='#DDDDDD'
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Pack Temperature"
                    dataValue={props.data?.pack_temp[0] ?? -1.0}
                    dataUnit="&#8451;"
                    dataMin={CONSTANTS.pack_temp.MIN}
                    dataMax={CONSTANTS.pack_temp.MAX}
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Fan Speed"
                    dataValue={props.data?.fan_speed[0] ?? -1.0}
                    dataUnit={CONSTANTS.fan_speed.UNIT}
                    dataMin={CONSTANTS.fan_speed.MIN}
                    dataMax={CONSTANTS.fan_speed.MAX}
                    bg='#DDDDDD'
                    DecimalPoint='0'
                />
                <DataPack
                    dataTitle="Pack Resistance"
                    dataValue={props.data?.pack_resistance[0] ?? -1.0}
                    dataUnit="m&#937;"
                    dataMin={CONSTANTS.pack_resistance.MIN}
                    dataMax={CONSTANTS.pack_resistance.MAX}
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Avg. Cell Int. Resist"
                    dataValue={props.data?.avg_cell_resistance[0] ?? -1.0}
                    dataUnit="m&#937;"
                    dataMin={CONSTANTS.avg_cell_resistance.MIN}
                    dataMax={CONSTANTS.avg_cell_resistance.MAX}
                    bg='#DDDDDD'
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Pack Capacity"
                    dataValue={props.data?.pack_capacity[0] ?? -1.0}
                    dataUnit={CONSTANTS.pack_capacity.UNIT}
                    dataMin={CONSTANTS.pack_capacity.MIN}
                    dataMax={CONSTANTS.pack_capacity.MAX}
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Adap. Total Capacity"
                    dataValue={props.data?.adaptive_total_capacity[0] ?? -1.0}
                    dataUnit={CONSTANTS.adaptive_total_capacity.UNIT}
                    dataMin={CONSTANTS.adaptive_total_capacity.MIN}
                    dataMax={CONSTANTS.adaptive_total_capacity.MAX}
                    bg='#DDDDDD'
                    DecimalPoint='3'
                />
                <DataPack
                    dataTitle="Pack State of Health"
                    dataValue={props.data?.soh[0] ?? -1.0}
                    dataUnit={CONSTANTS.soh.UNIT}
                    dataMin={CONSTANTS.soh.MIN}
                    dataMax={CONSTANTS.soh.MAX}
                    DecimalPoint='3'
                />
            </Flex>
            <SimpleGrid
                columns={3}
                rows={10}
                spacingX={'0.25vw'}
                spacingY={'0.25vh'}
                overflowY="scroll"
            >
                <CellGroup
                    groupNum={1}
                    voltage={props.data?.cell_group1_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={2}
                    voltage={props.data?.cell_group2_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={3}
                    voltage={props.data?.cell_group3_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={4}
                    voltage={props.data?.cell_group4_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={5}
                    voltage={props.data?.cell_group5_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={6}
                    voltage={props.data?.cell_group6_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={7}
                    voltage={props.data?.cell_group7_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={8}
                    voltage={props.data?.cell_group8_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={9}
                    voltage={props.data?.cell_group9_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={10}
                    voltage={props.data?.cell_group10_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={11}
                    voltage={props.data?.cell_group11_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={12}
                    voltage={props.data?.cell_group12_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={13}
                    voltage={props.data?.cell_group13_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={14}
                    voltage={props.data?.cell_group14_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={15}
                    voltage={props.data?.cell_group15_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={16}
                    voltage={props.data?.cell_group16_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={17}
                    voltage={props.data?.cell_group17_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={18}
                    voltage={props.data?.cell_group18_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={19}
                    voltage={props.data?.cell_group19_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={20}
                    voltage={props.data?.cell_group20_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={21}
                    voltage={props.data?.cell_group21_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={22}
                    voltage={props.data?.cell_group22_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={23}
                    voltage={props.data?.cell_group23_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={24}
                    voltage={props.data?.cell_group24_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={25}
                    voltage={props.data?.cell_group25_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={26}
                    voltage={props.data?.cell_group26_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={27}
                    voltage={props.data?.cell_group27_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={28}
                    voltage={props.data?.cell_group28_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={29}
                    voltage={props.data?.cell_group29_voltage[0] ?? -1.0}
                />
                <CellGroup
                    groupNum={30}
                    voltage={props.data?.cell_group30_voltage[0] ?? -1.0}
                />
            </SimpleGrid>
        </SimpleGrid>
    );
}
