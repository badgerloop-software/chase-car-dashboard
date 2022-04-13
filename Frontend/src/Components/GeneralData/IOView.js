import { Flex, Spacer, VStack } from "@chakra-ui/react";
import HeadingCell from "../Shared/HeadingCell";
import RangeCell from "../Shared/RangeCell";

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
                unit=' V'
                min={0}
                max={100}
            />
            <Spacer/>
            <RangeCell
                w='7.5vw'
                fontSize={fss}
                label='5V Bus'
                data={props.data?.bus_5V[0] ?? -1}
                digits={2}
                unit=' V'
                min={0}
                max={100}
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
                min={0}
                max={100}
            />
            <RangeCell
                fontSize={fs}
                label='Driver I/O Current In'
                data={props.data?.driverIO_current_in[0] ?? -1}
                digits={2}
                unit=' A'
                min={0}
                max={100}
            />
        </Flex>

        <HeadingCell fontSize='2.2vh' label='Main I/O' />
        <Flex direction='column' flex={2} align='stretch' pt='0.5vh' pb='0.75vh' pl='2' pr='2'>
            <RangeCell
                fontSize={fs}
                label='Main I/O Temp'
                data={props.data?.mainIO_temp[0] ?? -1}
                digits={2}
                unit='&#x2103;'
                min={0}
                max={100}
            />
            <RangeCell
                fontSize={fs}
                label='Main I/O Current In'
                data={props.data?.mainIO_current_in[0] ?? -1}
                digits={2}
                unit=' A'
                min={0}
                max={100}
            />
        </Flex>
      </VStack>
    );
}
