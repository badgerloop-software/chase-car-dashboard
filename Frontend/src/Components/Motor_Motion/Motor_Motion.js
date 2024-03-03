import {Grid, GridItem, Box, Flex, Spacer, Text, Center, useColorMode, VStack, Image} from "@chakra-ui/react";
import HeadingCell from "../Shared/HeadingCell";
import CONSTANTS from "../../data-constants.json"
import getColor from "../Shared/colors";
import images from "../Motor_Motion/Icons/Images"
import RangeCell from "../Shared/RangeCell";

export default function Motor_Motion(props) {
    const { colorMode } = useColorMode();

    const borderCol = getColor("border", colorMode);
    const greenBgCol = getColor("greenBg", colorMode);
    const greenTxtCol = getColor("txtGreenBg", colorMode);
    const redBgCol = getColor("redBg", colorMode);
    const redTxtCol = getColor("txtRedBg", colorMode);
    const headerBg = getColor("header", colorMode);

    const fitType = "scale-down";

    const Images = images[`${colorMode}`];
    
    return (
        <Flex flex='auto' direction='column'>
            <HeadingCell fontSize='2.2vh' label='Motor / Motion'/>
            <Grid 
                flex='2'
                templateRows="1fr 1fr 1fr 1.4fr 1.4fr" 
                templateColumns="1fr 1fr 4fr 2fr"
                pt='1'
                pb='1'
            >

                <GridItem
                    rowStart={1}
                    rowSpan={2}
                    colStart={1}
                >
                    <VStack spacing='0px'>
                        <Text fontSize='1.5vh'>F/R</Text>
                        <Center 
                            h='3vh'
                            w='3vh'
                            textAlign='center'
                            borderWidth='2px'
                            borderRadius='md'
                            borderColor={borderCol}
                        >
                            <Text as='b' fontSize='2vh'>{}</Text>
                        </Center>
                    </VStack>
                </GridItem>
                <GridItem
                    rowStart={1}
                    rowSpan={2}
                    colStart={2}
                >
                    <VStack spacing='0px'>
                        <Text fontSize='1.5vh'>State</Text>
                        <Center
                            h='3vh'
                            w='3vh'
                            textAlign='center'
                            borderWidth='2px'
                            borderRadius='md'
                            borderColor={borderCol}
                        >
                            <Text as='b' fontSize='2vh'>{props.data?.mcc_state[0] ?? "?"}</Text>
                        </Center>
                    </VStack>
                </GridItem>

                <GridItem
                    rowStart={4}
                    colStart={1}
                    colSpan={2}
                    pl='1'
                    pr='1'
                >
                    <Center
                        bg={props.data?.main_telem[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        borderWidth='2px'
                        lineHeight='1.6em'
                        h='71.4%'
                    >
                        <Text as='b' fontSize='xs' color={props.data?.main_telem[0] ? greenTxtCol : redTxtCol}>Motor {props.data?.main_telem[0] ? 'On' : 'Off'}</Text>
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={1}
                    colStart={3}
                    borderTopWidth='1px'
                    borderLeftWidth='1px'
                    borderRightWidth='1px'
                    borderColor={borderCol}
                >
                    <Center direction='row' pl='1' pr='1' h='100%'>
                        <Text fontSize='sm'>Accelerator</Text>
                        <Spacer/>
                        <Text fontSize='sm'>{props.data?.accelerator_pedal[0].toFixed(0) ?? -1.0} {CONSTANTS.accelerator.UNIT}</Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={2}
                    colStart={3}
                    borderTopWidth='1px'
                    borderLeftWidth='1px'
                    borderRightWidth='1px'
                    borderColor={borderCol}
                >
                    <Center direction='row' pl='1' pr='1' h='100%'>
                        <Text fontSize='sm'>Accelerator Out</Text>
                        <Spacer/>
                        {/*<Text fontSize='sm'>{props.data?.accelerator_out[0].toFixed(1) ?? -1.0} {CONSTANTS.accelerator_out.UNIT}</Text>*/}
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={3}
                    colStart={3}
                    borderTopWidth='1px'
                    borderLeftWidth='1px'
                    borderRightWidth='1px'
                    borderColor={borderCol}
                >
                    <Center direction='row' pl='1' pr='1' h='100%'>
                        <Text fontSize='sm'>Speed</Text>
                        <Spacer/>
                        <Text fontSize='sm'>{props.data?.speed[0].toFixed(0) ?? -1.0} {CONSTANTS.speed.UNIT}</Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={4}
                    colStart={3}
                    borderTopWidth='1px'
                    borderLeftWidth='1px'
                    borderRightWidth='1px'
                    borderColor={borderCol}
                    pl='1' 
                    pr='1'
                >
                    <RangeCell
                        fontSize='sm'
                        rangeBarH='1vh'
                        label='Motor Power'
                        data={props.data?.motor_power[0] ?? -1.0}
                        digits={0}
                        unit={CONSTANTS.motor_power.UNIT}
                        min={CONSTANTS.motor_power.MIN}
                        max={CONSTANTS.motor_power.MAX}
                    />
                </GridItem>
                <GridItem
                    rowStart={5}
                    colStart={3}
                    borderWidth='1px'
                    borderColor={borderCol}
                    pl='1' 
                    pr='1'
                >
                    <RangeCell
                        fontSize='sm'
                        rangeBarH='1vh'
                        label='Motor Current'
                        data={props.data?.motor_current[0] ?? -1.0}
                        digits={0}
                        unit={CONSTANTS.motor_current.UNIT}
                        min={CONSTANTS.motor_current.MIN}
                        max={CONSTANTS.motor_current.MAX}
                    />
                </GridItem>
                <GridItem
                    rowStart={2}
                    colStart={4}
                    pl='1'
                    pr='1'
                >
                    <Center
                        borderTopWidth='1px'
                        borderLeftWidth='1px'
                        borderRightWidth='1px'
                        borderColor={borderCol}
                        h='100%'
                    >
                        <Text fontSize='sm'>Setpoints</Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={3}
                    colStart={4}
                    pl='1'
                    pr='1'
                >
                    <Center
                        bg={props.data?.crz_spd_mode[0] ? greenBgCol : redBgCol}
                        borderTopWidth='1px'
                        borderLeftWidth='1px'
                        borderRightWidth='1px'
                        borderColor={borderCol}
                        h='100%'
                    >
                        <Text 
                            as='b' 
                            fontSize='xs'
                            color={props.data?.crz_spd_mode[0] ? greenTxtCol : redTxtCol}
                        >
                            {props.data?.crz_spd_setpt[0].toFixed(2) ?? -1.0} {CONSTANTS.crz_spd_setpt.UNIT}
                        </Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={4}
                    colStart={4}
                    pl='1'
                    pr='1'
                >
                    <Center
                        bg={props.data?.crz_pwr_mode[0] ? greenBgCol : redBgCol}
                        borderWidth='1px'
                        borderColor={borderCol}
                        h='71.4%'
                    >
                        <Text 
                            as='b' 
                            fontSize='xs'
                            color={props.data?.crz_pwr_mode[0] ? greenTxtCol : redTxtCol}
                        >
                            {props.data?.crz_pwr_setpt[0].toFixed(1) ?? -1.0} {CONSTANTS.crz_pwr_setpt.UNIT}
                        </Text>
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={5}
                    colStart={4}
                >
                    <Center>
                        {(props.data?.mcc_state[0] === 'C') ? <Image fit={fitType} boxSize='35px' src={Images.Cruise}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
            </Grid>
            
            <Grid
                flex='1'
                templateRows="1fr 1fr" 
                templateColumns="1fr 1fr 1fr 1fr 1fr"
                h='25%'
                pt = '1'
                pb = '0.25'
                pl = '1'
                pr = '1'
            >
                <GridItem 
                    rowStart={1}
                    colStart={1}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.park_brake[0] ? <Image fit={fitType} boxSize='35px' src={Images.ParkingBrake}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={1}
                    colStart={2}
                >
                    <Center h='100%' w='100%'>
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={1}
                    colStart={3}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.foot_brake[0] ? <Image fit={fitType} boxSize='35px' src={Images.MechanicalBrake}/> : <Box h='35px'/>}
                    </Center>                
                </GridItem>
                <GridItem 
                    rowStart={1}
                    colStart={4}
                >
                    <Center h='100%' w='100%'>
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={2}
                    colStart={1}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.l_turn_led_en[0] ? <Image fit={fitType} boxSize='35px' src={Images.Left}/> : <Box h='35px'/>}
                    </Center>                
                </GridItem>
                <GridItem 
                    rowStart={2}
                    colStart={2}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.r_turn_led_en[0] ? <Image fit={fitType} boxSize='35px' src={Images.Right}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={2}
                    colStart={3}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.headlights_led_en[0] ? <Image fit={fitType} boxSize='35px' src={Images.Headlights}/> : <Box h='35px'/> /*Does this mean the same as headlights on?*/}
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={2}
                    colStart={4}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.hazards[0] ? <Image fit={fitType} boxSize='35px' src={Images.Hazards}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={1}
                    rowSpan={2}
                    colStart={5}
                >
                    <Center h='100%'>
                        {props.data?.eco[0] ? <Image fit={fitType} boxSize='35px' src={Images.ECO}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
            </Grid>
        </Flex>
    );

}