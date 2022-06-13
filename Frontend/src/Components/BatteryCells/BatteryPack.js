import { Flex } from "@chakra-ui/react";
import DataPack from "./DataPack";
import CONSTANTS from "../../data-constants.json";

export default function BatteryPack(props) {
    return (
        <Flex flex="auto" direction="column">
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
                dataValue={isNaN(props.data?.pack_voltage[0] * props.data?.pack_current[0]) ?
                           -1.0 : props.data?.pack_voltage[0] * props.data?.pack_current[0]}
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
                dataMin={((props.data?.pack_temp[0] ?? -1.0) < (20 + 5 * CONSTANTS.fan_speed.MAX)) ?
                         Math.floor(((((props.data?.pack_temp[0] ?? -1.0) >= 20) ? props.data?.pack_temp[0] : 15) - 15) / 5) :
                         CONSTANTS.fan_speed.MAX}
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
                borderBottomWidth={0}
            />
        </Flex>
    );
}
