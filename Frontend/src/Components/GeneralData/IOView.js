import { Flex, Spacer } from "@chakra-ui/react";
import HeadingCell from "../Shared/HeadingCell";
import RangeCell from "../Shared/RangeCell";
import CONSTANTS from "../../data-constants.json";

export default function IOView(props) {
    const fss = '1.0em';
    const fs = '1.2em';

    return (
      <Flex flex='auto' direction='column'>
        <HeadingCell fontSize='2.2vh' label='I/O Boards' />
        <Flex flex='auto' direction='column'>
            <Flex flex='inherit' py='1' pl='2' pr='2'>
                <RangeCell
                    w='7.5vw'
                    fontSize={fss}
                    label='Main 12V'
                    data={props.data?.main_12V_bus[0] ?? -1}
                    digits={2}
                    unit={' ' + CONSTANTS.main_12V_bus.UNIT}
                    min={CONSTANTS.main_12V_bus.MIN}
                    max={CONSTANTS.main_12V_bus.MAX}
                />
                <Spacer/>
                <RangeCell
                    w='7.5vw'
                    fontSize={fss}
                    label='Main 5V'
                    data={props.data?.main_5V_bus[0] ?? -1}
                    digits={2}
                    unit={' ' + CONSTANTS.main_5V_bus.UNIT}
                    min={CONSTANTS.main_5V_bus.MIN}
                    max={CONSTANTS.main_5V_bus.MAX}
                />
            </Flex>
        </Flex>

        <HeadingCell fontSize='2.2vh' label='Driver I/O' />
        <Flex flex='inherit' direction='column' py='1' pl='2' pr='2'>
            <RangeCell
                fontSize={fs}
                label='Driver I/O Temp'
                data={props.data?.driverIO_temp[0] ?? -1}
                digits={2}
                unit='&#x2103;'
                min={CONSTANTS.driverIO_temp.MIN}
                max={CONSTANTS.driverIO_temp.MAX}
            />
            <RangeCell
                fontSize={fs}
                label='Driver I/O Current In'
                data={props.data?.driver_vbus_current[0] ?? -1}
                digits={2}
                unit={' ' + CONSTANTS.driver_vbus_current.UNIT}
                min={CONSTANTS.driver_vbus_current.MIN}
                max={CONSTANTS.driver_vbus_current.MAX}
            />
        </Flex>

        <HeadingCell fontSize='2.2vh' label='Main I/O' />
        <Flex flex='inherit' direction='column' py='1' pl='2' pr='2'>
            <RangeCell
                fontSize={fs}
                label='Main I/O Temp'
                data={props.data?.mainIO_temp[0] ?? -1}
                digits={2}
                unit='&#x2103;'
                min={CONSTANTS.mainIO_temp.MIN}
                max={CONSTANTS.mainIO_temp.MAX}
            />
            <RangeCell
                fontSize={fs}
                label='Main I/O Current In'
                data={props.data?.main_vbus_current[0] ?? -1}
                digits={2}
                unit={' ' + CONSTANTS.main_vbus_current.UNIT}
                min={CONSTANTS.main_vbus_current.MIN}
                max={CONSTANTS.main_vbus_current.MAX}
            />
        </Flex>
      </Flex>
    );
}
