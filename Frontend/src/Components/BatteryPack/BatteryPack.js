import {Flex, Center, Box, Spacer, Text, useColorMode} from "@chakra-ui/react";
import RangeRow from "../Shared/RangeRow.js";
import RangeBar from "../Shared/RangeBar.js";
import CONSTANTS from "../../data-constants.json";
import getColor from "../Shared/colors.js";

export default function BatteryPack(props) {
    const { colorMode } = useColorMode();
    const headerBg = getColor("header", colorMode);
    const borderColor = getColor("border", colorMode);

    const fanEnableText = ((props.data?.fan_speed[0] ?? -1.0) === -1.0) ? 'N/A' : (props.data.fan_speed[0] ? 'EN' : 'DIS');
    const fanEnableColor = (props.data?.fan_speed[0] ?? false) ? getColor("greenBg", colorMode) : getColor("redBg", colorMode);
    const fanEnableTextColor = (props.data?.fan_speed[0] ?? false) ? getColor("txtGreenBg", colorMode) : getColor("txtRedBg", colorMode);

    const chargeEnableText = ((props.data?.charge_enable[0] ?? -1.0) === -1.0) ? 'N/A' : (props.data.charge_enable[0] ? 'High' : 'Low');
    const chargeEnableColor = ((props.data?.charge_enable[0] ?? -1.0) == CONSTANTS.charge_enable.MAX) ? getColor("greenBg", colorMode) : getColor("redBg", colorMode);
    const chargeEnableTextColor = ((props.data?.charge_enable[0] ?? -1.0) == CONSTANTS.charge_enable.MAX) ? getColor("txtGreenBg", colorMode) : getColor("txtRedBg", colorMode);

    // Fan speeds go from 0 to 6, where for every 5 degC increment in pack temp above 20 degC, fan speed should increase by 1
    //   However, fanSpeedMin cannot be greater than the nominal maximum value of fan_speed
    const fanSpeedMin = ((props.data?.pack_temp[0] ?? -1.0) < (20 + 5 * CONSTANTS.fan_speed.MAX)) ?
                         Math.floor(((((props.data?.pack_temp[0] ?? -1.0) >= 20) ? props.data?.pack_temp[0] : 15) - 15) / 5) :
                         CONSTANTS.fan_speed.MAX;

    return (
        <Flex flex='auto' direction='column' overflowY='auto' height='90%'>
            <RangeRow
                dataTitle="Pack Temp"
                dataValue={props.data?.pack_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.pack_temp}
            />
            <RangeRow
                dataTitle="Pack Internal Temp"
                dataValue={props.data?.pack_internal_temp[0] ?? -1.0}
                dataConstant={CONSTANTS.pack_internal_temp}

                bg={headerBg}
            />
            <Center
                borderTopWidth={1}
                borderBottomWidth={1}
                borderRightWidth={1}
                borderColor={borderColor}
                lineHeight='1.2em'
                height='100%'
                bg={((props.data?.fan_speed[0] ?? -1.0) < fanSpeedMin || (props.data?.fan_speed[0] ?? -1.0) > CONSTANTS.fan_speed.MAX) ?
                    getColor("errorBg", colorMode) : null}
            >
                <Flex w='95%' alignItems='center'>
                    <Center
                        border='2px'
                        w='2em'
                        background={fanEnableColor}
                        py='3px'
                    >
                        <Text 
                            fontSize='xs' 
                            fontWeight='bold'
                            lineHeight={1}
                            color={fanEnableTextColor}
                        >
                            {fanEnableText}
                        </Text>
                    </Center>
                    <Text fontSize='sm' lineHeight='2em' marginLeft='2.5%'>Fan Speed:</Text>
                    <Spacer />
                    <Text fontSize='sm' paddingRight='0.5em' lineHeight='2em'>
                        {props.data?.fan_speed[0] ?? -1}
                    </Text>

                    <RangeBar 
                            w='3em'
                            h='1em'
                            borderRadius='0px'

                            val={(props.data?.fan_speed[0] ?? -1.0)}
                            min={fanSpeedMin}
                            max={CONSTANTS.fan_speed.MAX}
                    />
                </Flex>
            </Center>
            <RangeRow
                dataTitle="Pack Current"
                dataValue={props.data?.pack_current[0] ?? -1.0}
                dataConstant={CONSTANTS.pack_current}

                bg={headerBg}
            />
            <RangeRow
                dataTitle="Pack Voltage"
                dataValue={props.data?.pack_voltage[0] ?? -1.0}
                dataConstant={CONSTANTS.pack_voltage}
            />
            <RangeRow
                dataTitle="Pack Power Out"
                dataValue={props.data?.pack_power[0] ?? -1.0}
                dataConstant={CONSTANTS.pack_power}

                bg={headerBg}
            />
            <RangeRow
                dataTitle="Pack SoC"
                dataValue={props.data?.soc[0] ?? -1.0}
                dataConstant={CONSTANTS.soc}
            />
            <RangeRow
                dataTitle="Pack Resistance"
                dataValue={props.data?.pack_resistance[0] ?? -1.0}
                dataConstant={CONSTANTS.pack_resistance}

                bg={headerBg}
            />
            <RangeRow
                dataTitle="Adapt. Total Capacity"
                dataValue={props.data?.adaptive_total_capacity[0] ?? -1.0}
                dataConstant={CONSTANTS.adaptive_total_capacity}
            />
            <Center
                borderTopWidth={1}
                borderRightWidth={1}
                borderColor={borderColor}
                bg={((props.data?.charge_enable[0] ?? -1.0) != CONSTANTS.charge_enable.MIN && (props.data?.charge_enable[0] ?? -1.0) != CONSTANTS.charge_enable.MAX) ?
                    getColor("errorBg", colorMode) : headerBg}
                lineHeight='1.2em'
                height='100%'
            >
                <Flex w='95%' alignItems='center'>
                    <Text fontSize='sm' lineHeight='2em'>Charge Enable:</Text>
                    <Spacer />
                    <Center
                        border='2px'
                        w='3.5em'
                        background={chargeEnableColor}
                        py='3px'
                    >
                        <Text
                            fontSize='xs'
                            fontWeight='bold'
                            lineHeight={1}
                            color={chargeEnableTextColor}
                        >
                            {chargeEnableText}
                        </Text>
                    </Center>
                </Flex>
            </Center>
        </Flex>
    );
}
