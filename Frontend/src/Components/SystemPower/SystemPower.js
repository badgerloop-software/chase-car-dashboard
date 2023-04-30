import {Flex, useColorMode} from "@chakra-ui/react";
import RangeRow from "../Shared/RangeRow";
import CONSTANTS from "../../data-constants.json";
import getColor from "../Shared/colors";

export default function SystemPower(props) {
    const { colorMode } = useColorMode();
    const headerBg = getColor("header", colorMode);

    return (
        <Flex flex="auto" direction="column" overflowY="scroll">
            <RangeRow
                dataTitle="BMS Input Voltage"
                dataValue={props.data?.bms_input_voltage[0] ?? -1.0}
                dataConstant={CONSTANTS.bms_input_voltage}
                DecimalPoint='3'

                bg={headerBg}
            />
            <RangeRow
                dataTitle="Main VBus Curr"
                dataValue={props.data?.main_vbus_current[0] ?? -1.0}
                dataConstant={CONSTANTS.main_vbus_current}
                DecimalPoint='3'
            />
            <RangeRow
                dataTitle="Main VBus"
                dataValue={props.data?.main_vbus[0] ?? -1.0}
                dataConstant={CONSTANTS.main_vbus}
                DecimalPoint='3'
                
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Main 5V Bus"
                dataValue={props.data?.main_5V_bus[0] ?? -1.0}
                dataConstant={CONSTANTS.main_5V_bus}
                DecimalPoint='3'
            />
            <RangeRow
                dataTitle="Main 12V Bus"
                dataValue={props.data?.main_12V_bus[0] ?? -1.0}
                dataConstant={CONSTANTS.main_12V_bus}
                DecimalPoint='3'
                
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Driver VBus Curr"
                dataValue={props.data?.driver_vbus_current[0] ?? -1.0}
                dataConstant={CONSTANTS.driver_vbus_current}
                DecimalPoint='3'
            />
            <RangeRow
                dataTitle="Driver VBus"
                dataValue={props.data?.driver_vbus[0] ?? -1.0}
                dataConstant={CONSTANTS.driver_vbus}
                DecimalPoint='3'
                
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Driver 5V Bus"
                dataValue={props.data?.driver_5V_bus[0] ?? -1.0}
                dataConstant={CONSTANTS.driver_5V_bus}
                DecimalPoint='3'
            />
            <RangeRow
                dataTitle="Driver 12V Bus"
                dataValue={props.data?.driver_12V_bus[0] ?? -1.0}
                dataConstant={CONSTANTS.driver_12V_bus}
                DecimalPoint='3'
                
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Supp. Voltage"
                dataValue={props.data?.supplemental_voltage[0] ?? -1.0}
                dataConstant={CONSTANTS.supplemental_voltage}
                DecimalPoint='3'
            />
            <RangeRow
                dataTitle="Approx. Supp. SoC"
                dataValue={props.data?.est_supplemental_soc[0] ?? -1.0}
                dataConstant={CONSTANTS.est_supplemental_soc}
                DecimalPoint='3'
                
                bg={headerBg}
            />
        </Flex>
        );
}