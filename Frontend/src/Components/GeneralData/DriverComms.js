import {Flex, Center, VStack, SimpleGrid, Text, Image, Box} from "@chakra-ui/react";
import RangeCell from "../Shared/RangeCell";
import HeadingCell from "../Shared/HeadingCell";
import CommsLabel from "./CommsLabel";
import Headlights from "./DriverIcons/Headlights.png"
import Hazards from "./DriverIcons/Hazards.png"
import Cruise from "./DriverIcons/Cruise.png"
import Left from "./DriverIcons/Left Turn.png"
import Right from "./DriverIcons/Right Turn.png"
import CONSTANTS from "../../data-constants.json";

export default function DriverComms(props) {
    /**
     * Get delay between the current time and the most recent timestamp
     * @returns {string} A formatted string containing the delay betweent the current time and the most recent timestamp
     * @private
     */
    const _getPacketDelay = () => {
        const timeArr = props.data?.timestamps[0].split(":"); // Split most recent timestamp into [hh, mm, ss.SSS]
        const currTime = new Date(); // Get current time

        // Get delay (from hours to milliseconds) between most recent timestamp and current time
        const packetDelay = new Date(currTime - parseInt(timeArr[0]) * 3600000 - parseInt(timeArr[1]) * 60000
                                     - parseInt(timeArr[2].substr(0,2)) * 1000 - parseInt(timeArr[2].substr(3,3)));

        // Return formatted delay
        return ((packetDelay.getHours() < 10) ? "0" + packetDelay.getHours() : packetDelay.getHours()) + ":"
               + ((packetDelay.getMinutes() < 10) ? "0" + packetDelay.getMinutes() : packetDelay.getMinutes()) + ":"
               + ((packetDelay.getSeconds() < 10) ? "0" + packetDelay.getSeconds() : packetDelay.getSeconds()) + "."
               + ((packetDelay.getMilliseconds() >= 100) ? packetDelay.getMilliseconds() :
                 ((packetDelay.getMilliseconds() >= 10) ? "0" + packetDelay.getMilliseconds() :
                 "00" + packetDelay.getMilliseconds()));
    };

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
                        unit={' ' + CONSTANTS.speed.UNIT}
                        min={CONSTANTS.speed.MIN}
                        max={CONSTANTS.speed.MAX}
                    />
                    <RangeCell
                        fontSize='2vh'
                        label='Accelerator'
                        data={props.data?.accelerator[0] ?? -1.0}
                        digits={0}
                        unit={' ' + CONSTANTS.accelerator.UNIT}
                        min={CONSTANTS.accelerator.MIN}
                        max={CONSTANTS.accelerator.MAX}
                    />
                    <RangeCell
                        fontSize='2vh'
                        label='Cabin Temp'
                        data={props.data?.cabin_temp[0] ?? -1.0}
                        digits={1}
                        unit="&#8451;"
                        min={CONSTANTS.cabin_temp.MIN}
                        max={CONSTANTS.cabin_temp.MAX}
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
                        boolean={props.data?.solar_car_connection[0]}
                        label='Solar Car'
                    />
                    <Text fontSize='2vh' style={{ textIndent: 30 }}>&#160;Packet Delay: {_getPacketDelay()}</Text>
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
