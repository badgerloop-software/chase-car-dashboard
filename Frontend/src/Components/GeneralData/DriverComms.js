import {Flex, Center, SimpleGrid, Text, Image, Box, HStack} from "@chakra-ui/react";
import RangeCell from "../Shared/RangeCell";
import HeadingCell from "../Shared/HeadingCell";
import CommsLabel from "./CommsLabel";
import Headlights from "./DriverIcons/Headlights.png"
import Hazards from "./DriverIcons/Hazards.png"
import Cruise from "./DriverIcons/Cruise.png"
import Left from "./DriverIcons/Left Turn.png"
import Right from "./DriverIcons/Right Turn.png"
import CONSTANTS from "../../data-constants.json";
import {isNullOrUndef} from "chart.js/helpers";

export default function DriverComms(props) {
    const timeArr = props.data?.timestamps[0].split(":"); // Split most recent timestamp into [hh, mm, ss.SSS]

    // Get delay (from hours to milliseconds) between most recent timestamp and current time
    const packetDelay = isNullOrUndef(props.data?.timestamps[0]) ?
                        new Date(0,0,0,0,0,0,0) :
                        new Date(new Date() - parseInt(timeArr[0]) * 3600000 - parseInt(timeArr[1]) * 60000
                                 - parseInt(timeArr[2].substring(0,2)) * 1000 - parseInt(timeArr[2].substring(3)));

    const bgColor = (packetDelay.getSeconds() > 1) ? "#ff000055" : null;

    /**
     * Get formatted delay between the current time and the most recent timestamp
     * @returns {string} A formatted string containing the delay between the current time and the most recent timestamp
     * @private
     */
    const _getFormattedPacketDelay = () => {
        // Return formatted delay
        return ((packetDelay.getHours() < 10) ? "0" + packetDelay.getHours() : packetDelay.getHours()) + ":"
               + ((packetDelay.getMinutes() < 10) ? "0" + packetDelay.getMinutes() : packetDelay.getMinutes()) + ":"
               + ((packetDelay.getSeconds() < 10) ? "0" + packetDelay.getSeconds() : packetDelay.getSeconds()) + "."
               + ((packetDelay.getMilliseconds() >= 100) ? packetDelay.getMilliseconds() :
                 ((packetDelay.getMilliseconds() >= 10) ? "0" + packetDelay.getMilliseconds() :
                 "00" + packetDelay.getMilliseconds()));
    };

    return (
        <Flex flex='auto' direction='column'>
            <HeadingCell fontSize='2.2vh' label='Driver / Cabin'/>
            <Flex flex='inherit' py='1'>
                <Flex flex='1' direction='column' pl='2' pr='2'>
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
                        unit='&#8451;'
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
            <Flex flex='inherit' direction='column' pl='2' justify='center' >
                <CommsLabel
                    boolean={props.data?.solar_car_connection[0]}
                    label='Solar Car'
                />
                <HStack>
                    <Text fontSize='2vh' style={{ textIndent: 30 }}>&#160;Packet Delay: </Text>
                    <Text fontSize='2vh' backgroundColor={bgColor}>{_getFormattedPacketDelay()}</Text>
                </HStack>
                <CommsLabel
                    boolean={props.data?.mainIO_heartbeat[0]}
                    label='Driver I/O - Main I/O'
                />
                <CommsLabel
                    boolean={props.data?.bms_canbus_failure[0]}
                    label='BMS CANBUS'
                />
            </Flex>
        </Flex>
    );
}
