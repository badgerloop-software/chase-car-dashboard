import {Flex, VStack, Box} from "@chakra-ui/react";
import RangeRow from "../Shared/RangeRow";
import CONSTANTS from "../../data-constants.json";


export default function TempView(props) {

    console.log(props.data);
    console.log(CONSTANTS)
    return (
        <Flex flex="auto" direction="column" overflowY="scroll">
            <RangeRow
                dataConstant={CONSTANTS.motor_temp}
                dataValue={props.data.motor_temp[0] ?? CONSTANTS.motor_temp.MIN}
                dataTitle="Motor"
                size="sm"
            />
            <RangeRow
                dataConstant={CONSTANTS.road_temp}
                dataValue={props.data.road_temp[0] ?? CONSTANTS.road_temp.MIN}
                dataTitle="Road"
                size="sm"
            />
            <RangeRow
                dataConstant={CONSTANTS.brake_temp}
                dataValue={props.data.brake_temp[0] ?? CONSTANTS.brake_temp.MIN}
                dataTitle="Brake"
                size="sm"
            />
            <RangeRow
                dataConstant={CONSTANTS.air_temp}
                dataValue={props.data.air_temp[0] ?? CONSTANTS.air_temp.MIN}
                dataTitle="Air"
                size="sm"
            />
            <RangeRow
                dataConstant={CONSTANTS.dcdc_temp}
                dataValue={props.data.dcdc_temp[0] ?? CONSTANTS.dcdc_temp.MIN}
                dataTitle="DCDC"
                size="sm"
            />
            <RangeRow
                dataConstant={CONSTANTS.motor_controller_temp}
                dataValue={props.data.motor_controller_temp[0] ?? CONSTANTS.motor_controller_temp.MIN}
                dataTitle="Motor Controller"
                size="sm"
            />
            <RangeRow
                dataConstant={CONSTANTS.cabin_temp}
                dataValue={props.data.cabin_temp[0] ?? CONSTANTS.cabin_temp.MIN}
                dataTitle="Cabin"
                size="sm"
            />
            <RangeRow
                dataConstant={CONSTANTS.mainIO_temp}
                dataValue={props.data.mainIO_temp[0] ?? CONSTANTS.mainIO_temp.MIN}
                dataTitle="MainIO"
                size="sm"
            />
            <RangeRow
                dataConstant={CONSTANTS.driverIO_temp}
                dataValue={props.data.driverIO_temp[0] ?? CONSTANTS.driverIO_temp.MIN}
                dataTitle="DriverIO"
                size="sm"
            />
        </Flex>
    );


}