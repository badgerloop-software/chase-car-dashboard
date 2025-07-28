import {Flex, Text, Box, HStack, useColorMode} from "@chakra-ui/react";
import HeadingCell from "../Shared/HeadingCell.js";
import CommsLabel from "./CommsLabel.js";
const isNullOrUndef = (value) => value === null || value === undefined;
import { getRelativePosition as _getRelativePosition } from 'chart.js/helpers/helpers.js';
import getColor from "../Shared/colors.js";
import {MILLIS_PER_HR, MILLIS_PER_MIN, MILLIS_PER_SEC} from "../Shared/misc-constants.js";

export default function Communication(props) {
    const { colorMode } = useColorMode();

    const timeArr = props.data?.tstamp_unix; // Split most recent timestamp into [hh, mm, ss.SSS]

    // Get delay (from hours to milliseconds) between most recent timestamp and current time
    const packetDelay = isNullOrUndef(props.data?.timestamps[0]) ?
                        new Date(0,0,0,0,0,0,0) :
                        new Date( Number(new Date(0,0,0,0,0,0,0)) + Number(new Date()) - timeArr);
    const bgColor = !props.data?.solar_car_connection[0] ||
            ((packetDelay.getHours() > 0) || (packetDelay.getMinutes() > 0) || (packetDelay.getSeconds() > 1)) ?
            getColor("errorBg", colorMode) : null;


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
        <Flex flex='auto' direction='column' overflowY='auto' height='90%'>
            <HeadingCell fontSize='2.2vh' label='Communication'/>
            <Flex flex='inherit' direction='column' pl='2' pt='2' >
                <CommsLabel
                    boolean={props.data?.solar_car_connection[0]}
                    label='Solar Car Connection'
                />
                <HStack>
                    <Text fontSize='2vh' style={{ textIndent: 30 }}>&#160;Packet Delay: </Text>
                    <Text fontSize='2vh' backgroundColor={bgColor}>{_getFormattedPacketDelay()}</Text>
                </HStack>
                <CommsLabel
                        indent={true}
                        boolean={props.data?.udp_status[0]}
                        label='UDP'
                />
                <CommsLabel
                        indent={true}
                        boolean={props.data?.lte_status[0]}
                        label='LTE'
                />
                <CommsLabel
                    boolean={props.data?.mainIO_heartbeat[0]}
                    label='Main IO Heartbeat'
                />
                <Box h='1vh' />
                <Text fontSize='2vh'>CAN Heartbeats:</Text>
                <Flex direction='column'>
                    <CommsLabel
                        indent={true}
                        boolean={props.data?.bms_can_heartbeat[0]}
                        label='BMS'
                    />
                    <CommsLabel
                        indent={true}
                        boolean={props.data?.mcc_can_heartbeat[0]}
                        label='MCC'
                    />
                    <CommsLabel      
                        indent={true}      
                        boolean={props.data?.mppt_can_heartbeat[0]}
                        label='MPPT'
                    />
                </Flex>
            </Flex>
        </Flex>
        )
}
