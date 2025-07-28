import {Flex, useColorMode} from "@chakra-ui/react";
import RangeRow from "../Shared/RangeRow.js";
import CONSTANTS from "../../data-constants.json";
import getColor from "../Shared/colors.js";

export default function Temperature(props) {
    const { colorMode } = useColorMode();
    const headerBg = getColor("header", colorMode);

    return (
        <Flex flex="auto" direction="column" overflowY="scroll">
            <RangeRow
                dataTitle="Brake"
                dataValue={props.data?.brake_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.brake_temp}
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Air"
                dataValue={props.data?.air_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.air_temp}
            />
            <RangeRow
                dataTitle="Road"
                dataValue={props.data?.road_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.road_temp}
                bg={headerBg}
            />
            <RangeRow
                dataTitle="Motor"
                dataValue={props.data?.motor_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.motor_temp}
            />
            <RangeRow
                dataTitle="Motor Controller"
                dataValue={props.data?.motor_controller_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.motor_controller_temp}
                bg={headerBg}
            />
            <RangeRow
                dataTitle="DCDC"
                dataValue={props.data?.dcdc_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.dcdc_temp}
            />
            <RangeRow
                dataTitle="Main IO"
                dataValue={props.data?.mainIO_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.mainIO_temp}
                bg={headerBg}
            />
        </Flex>
    );
}
