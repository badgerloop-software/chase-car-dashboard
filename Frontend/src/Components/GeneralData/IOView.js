import { Flex, Spacer, VStack } from "@chakra-ui/react";
import HeadingCell from "../Shared/HeadingCell";
import RangeCell from "../Shared/RangeCell";
import CONSTANTS from "../../data-constants.json";

export default function IOView(props) {
    const fss = "1.0em";
    const fs = "1.2em";

    return (
      <VStack align='stretch' spacing={0} borderLeft='1px'>
        <HeadingCell fontSize='2.2vh' label='I/O Boards' />
          <Flex pt='0.5vh' pb='0.75vh' pl='2' pr='2'>
            <RangeCell
                w='7.5vw'
                fontSize={fss}
                label='12V Bus'
                data={props.data?.bus_12V[0] ?? -1}
                digits={2}
                unit={' ' + CONSTANTS.bus_12V.UNIT}
                min={CONSTANTS.bus_12V.MIN}
                max={CONSTANTS.bus_12V.MAX}
            />
            <Spacer/>
            <RangeCell
                w='7.5vw'
                fontSize={fss}
                label='5V Bus'
                data={props.data?.bus_5V[0] ?? -1}
                digits={2}
                unit={' ' + CONSTANTS.bus_5V.UNIT}
                min={CONSTANTS.bus_5V.MIN}
                max={CONSTANTS.bus_5V.MAX}
            />
        </Flex>

        <HeadingCell fontSize='2.2vh' label='Driver I/O' />
        <Flex flex={2} direction='column' pt='0.5vh' pb='0.75vh' pl='2' pr='2'>
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
                data={props.data?.driverIO_current_in[0] ?? -1}
                digits={2}
                unit={' ' + CONSTANTS.driverIO_current_in.UNIT}
                min={CONSTANTS.driverIO_current_in.MIN}
                max={CONSTANTS.driverIO_current_in.MAX}
            />
        </Flex>

        <HeadingCell fontSize='2.2vh' label='Main I/O' />
        <Flex direction='column' flex={2} pt='0.5vh' pb='0.75vh' pl='2' pr='2'>
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
                data={props.data?.mainIO_current_in[0] ?? -1}
                digits={2}
                unit={' ' + CONSTANTS.mainIO_current_in.UNIT}
                min={CONSTANTS.mainIO_current_in.MIN}
                max={CONSTANTS.mainIO_current_in.MAX}
            />
        </Flex>
      </VStack>
    );
}
