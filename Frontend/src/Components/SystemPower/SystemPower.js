import {Flex, useColorMode} from "@chakra-ui/react";
import RangeRow from "../Shared/RangeRow";
import CONSTANTS from "../../data-constants.json";
import getColor from "../Shared/colors";

export default function SystemPower(props) {
    const { colorMode } = useColorMode();
    const headerBg = getColor("header", colorMode);

    return (
        <Flex flex='auto' direction='column' overflowY='auto' height='90%'>
            <RangeRow
                dataTitle="BMS Input Voltage"
                dataValue={props.data?.bms_input_voltage[0] ?? -1.0}
                dataConstant={CONSTANTS.bms_input_voltage}
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Main 5V Bus"
                dataValue={props.data?.main_5V_bus[0] ?? -1.0}
                dataConstant={CONSTANTS.main_5V_bus}
            />
            <RangeRow
                dataTitle="Main 12V Bus"
                dataValue={props.data?.main_12V_bus[0] ?? -1.0}
                dataConstant={CONSTANTS.main_12V_bus}
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Main 24V Bus"
                dataValue={props.data?.main_24V_bus[0] ?? -1.0}
                dataConstant={CONSTANTS.main_24V_bus}
            />
            <RangeRow
                dataTitle="Main 5V Current"
                dataValue={props.data?.main_5V_current[0] ?? -1.0}
                dataConstant={CONSTANTS.main_5V_current}
            />
            <RangeRow
                dataTitle="Main 12V Current"
                dataValue={props.data?.main_12V_current[0] ?? -1.0}
                dataConstant={CONSTANTS.main_12V_current}
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Main 24V Current"
                dataValue={props.data?.main_24V_current[0] ?? -1.0}
                dataConstant={CONSTANTS.main_24V_current}
            />
            <RangeRow
                dataTitle="Supp. Voltage"
                dataValue={props.data?.supplemental_voltage[0] ?? -1.0}
                dataConstant={CONSTANTS.supplemental_voltage}
            />
            <RangeRow
                dataTitle="Approx. Supp. SoC"
                dataValue={props.data?.est_supplemental_soc[0] ?? -1.0}
                dataConstant={CONSTANTS.est_supplemental_soc}
                bottomBorderWidth={0}
                bg={headerBg}
            />
        </Flex>
    );
}
