import {Flex, Center, VStack, SimpleGrid, Text, Image, Box} from "@chakra-ui/react";
import RangeCell from "../Shared/RangeCell";
import HeadingCell from "../Shared/HeadingCell";
import CommsLabel from "./CommsLabel";
import Headlights from "./DriverIcons/Headlights.png"
import Hazards from "./DriverIcons/Hazards.png"
import Cruise from "./DriverIcons/Cruise.png"
import Left from "./DriverIcons/Left Turn.png"
import Right from "./DriverIcons/Right Turn.png"

export default function DriverComms(props) {
    return (
        <VStack align='stretch' spacing={0}>
            <HeadingCell fontSize='2.2vh' label='Driver / Cabin'/>
            <Flex flex='3' pt='1' pb='1'>
                <Flex flex='1.5' direction='column' pl='2' pr='2'>
                    <RangeCell
                        fontSize='2vh'
                        label='Speed'
                        data={props.data?.speed[0] ?? -1.0}
                        digits={0}
                        unit=" mph"
                    />
                    <RangeCell
                        fontSize='2vh'
                        label='Accelerator'
                        data={props.data?.accelerator[0] ?? -1.0}
                        digits={0}
                        unit="V"
                    />
                    <RangeCell
                        fontSize='2vh'
                        label='Cabin Temp'
                        data={props.data?.cabin_temp[0] ?? -1.0}
                        digits={1}
                        unit="&#8451;"
                    />
                </Flex>
                <Center w='30%'>
                    <SimpleGrid columns={2} rows={3} alignItems='center' spacing={2}>
                        <Center h='35px' w='35px' borderColor='black' borderWidth='2px' borderRadius='md' textAlign='center'>
                            <Text as='b' fontSize='2.3vh'>{props.data?.state[0] ?? "?"}</Text>
                        </Center>
                        {props.data?.headlights[0] ? <Image boxSize='35px' src={Headlights}/> : <Box h='35px'/>}
                        {props.data?.hazards[0] ? <Image boxSize='35px' src={Hazards}/> : <Box h='35px'/>}
                        {props.data?.cruise[0] ? <Image boxSize='35px' src={Cruise}/> : <Box h='35px'/>}
                        {props.data?.left_turn[0] ? <Image boxSize='35px' src={Left}/> : <Box h='35px'/>}
                        {props.data?.right_turn[0] ? <Image boxSize='35px' src={Right}/> : <Box h='35px'/>}
                    </SimpleGrid>
                </Center>
            </Flex>
            <HeadingCell fontSize='2.2vh' label='Communication'/>
            <Flex flex='3' direction='column' pt='1' pl='2' pb='1'>
                <VStack spacing={0} align='left' marginBottom='5px'>
                    <CommsLabel
                        boolean={props.data?.solar_car_connection}
                        label='Solar Car'
                    />
                    <Text fontSize='2vh' style={{ textIndent: 30 }}>&#160;Packet Delay: 00.00</Text>
                </VStack>
                <CommsLabel
                    boolean={props.data?.mainIO_heartbeat[0]}
                    label='Driver I/O - Main I/O'
                />
                <CommsLabel
                    boolean={props.data?.bms_canbus_failure[0]}
                    label='BMS CANBUS'
                />
            </Flex>
        </VStack>
    );
}
