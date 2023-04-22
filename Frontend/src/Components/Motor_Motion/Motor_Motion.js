import {Grid, GridItem, Box, Flex, Spacer, Text, Center, useColorMode, VStack, Image, SimpleGrid} from "@chakra-ui/react";
import HeadingCell from "../Shared/HeadingCell";
import CONSTANTS from "../../data-constants.json"
import getColor from "../Shared/colors";
import images from "../Motor_Motion/Icons/Images"
import RangeCell from "../Shared/RangeCell";

export default function Motor_Motion(props) {
    const { colorMode } = useColorMode();
    const borderCol = getColor("border", colorMode);
    const greenBgCol = getColor("ppc_mppt_greenBg", colorMode);
    const greenTxtCol = getColor("ppc_mppt_txtGreenBg", colorMode);
    const redBgCol = getColor("ppc_mppt_redBg", colorMode);
    const redTxtCol = getColor("ppc_mppt_txtRedBg", colorMode);
    const headerBg = getColor("header", colorMode);

    const icon_height = '100%'
    const icon_width = '100%%'
    const fitType = "scale-down";


    const Images = images[`${colorMode}`];
    
    return (
        <Flex flex='auto' direction='column'>
            <HeadingCell fontSize='2.2vh' label='Motor / Motion'/>
            <Grid 
                flex='2'
                templateRows="1fr 1fr 1fr 1.4fr 1.4fr" 
                templateColumns="1fr 2fr 1fr"
                h='25%'
                pt='1'
                pb='1'
            >
                <GridItem
                    rowStart={1}
                    rowSpan={2}
                    colStart={1}
                    pl='0.5'
                    pr='0.5'
                >
                    <Center w='100%'>
                        <VStack lineHeight='1'>
                            <Text>F/R</Text>
                            <Center h='35px' w='35px' borderWidth='2px' borderRadius='md' textAlign='center'>
                                <Text as='b' fontSize='2.3vh'>{props.data?.fr_out[0] ? 'T' : 'F'}</Text>
                            </Center>
                        </VStack>
                        <Spacer/>
                        <VStack lineHeight='1'>
                            <Text>State</Text>
                            <Center h='35px' w='35px' borderWidth='2px' borderRadius='md' textAlign='center'>
                                <Text as='b' fontSize='2.3vh'>{props.data?.state[0] ?? "?"}</Text>
                            </Center>
                        </VStack>
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={4}
                    colStart={1}
                    pl='0.5'
                    pr='0.5'
                >
                    <Center
                        bg={props.data?.motor_controller_contactor[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        borderWidth='2px'
                        lineHeight='1.6em'
                    >
                        <Text as='b' fontSize='xs' color={props.data?.motor_controller_contactor[0] ? greenTxtCol : redTxtCol}>Motor {props.data?.motor_controller_contactor[0] ? 'On' : 'Off'}</Text>
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={1}
                    colStart={2}
                    borderTop='1px'
                    borderLeft='1px'
                    borderRight='1px'
                >
                    <Center direction='row' pl='1' pr='1' h='100%'>
                        <Text fontSize='xs'>Accelerator</Text>
                        <Spacer/>
                        <Text fontSize='xs'>{props.data?.accelerator[0].toFixed(0) ?? -1.0} {CONSTANTS.accelerator.UNIT}</Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={2}
                    colStart={2}
                    borderTop='1px'
                    borderLeft='1px'
                    borderRight='1px'
                >
                    <Center direction='row' pl='1' pr='1' h='100%'>
                        <Text fontSize='xs'>Accelerator Out</Text>
                        <Spacer/>
                        <Text fontSize='xs'>{props.data?.accelerator_out[0].toFixed(1) ?? -1.0} {CONSTANTS.accelerator_out.UNIT}</Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={3}
                    colStart={2}
                    borderTop='1px'
                    borderLeft='1px'
                    borderRight='1px'
                >
                    <Center direction='row' pl='1' pr='1' h='100%'>
                        <Text fontSize='xs'>Speed</Text>
                        <Spacer/>
                        <Text fontSize='xs'>{props.data?.speed[0].toFixed(0) ?? -1.0} {CONSTANTS.speed.UNIT}</Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={4}
                    colStart={2}
                    borderTop='1px'
                    borderLeft='1px'
                    borderRight='1px'
                    pl='1' 
                    pr='1'
                    pb='1'
                >
                    <RangeCell
                        fontSize='xs'
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
                    colStart={2}
                    borderTop='1px'
                    borderLeft='1px'
                    borderRight='1px'
                    borderBottom='1px'
                    pl='1' 
                    pr='1'
                    pb='1'
                >
                    <RangeCell
                        fontSize='xs'
                        label='Motor Current'
                        data={props.data?.motor_current[0] ?? -1.0}
                        digits={0}
                        unit={CONSTANTS.motor_current.UNIT}
                        min={CONSTANTS.motor_current.MIN}
                        max={CONSTANTS.motor_current.MAX}
                    />
                </GridItem>

                {/* <GridItem
                    rowStart={2}
                    colStart={3}
                    rowSpan={3}
                    pl='0.5'
                    pr='0.5'
                >
                    <Center
                        borderColor={borderCol}
                        borderTop='1px'
                        borderLeft='1px'
                        borderRight='1px'
                        h='25%'
                    >
                        <Text fontSize='sm'>Setpoints</Text>
                    </Center>
                    <Center
                        bg={props.data?.crz_spd_setpt[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        border='1px'
                        h='25%'
                    >
                        <Text 
                            as='b' 
                            fontSize='xs'
                            color={props.data?.crz_spd_setpt[0] ? greenTxtCol : redTxtCol}
                        >
                            {props.data?.crz_spd_setpt[0].toFixed(2) ?? -1.0} {CONSTANTS.crz_spd_setpt.UNIT}
                        </Text>
                    </Center>
                    <Center
                        bg={props.data?.crz_pwr_mode[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        borderLeft='1px'
                        borderRight='1px'
                        borderBottom='1px'
                        h='25%'
                    >
                        <Text 
                            as='b' 
                            fontSize='xs'
                            color={props.data?.crz_pwr_mode[0] ? greenTxtCol : redTxtCol}
                        >
                            {props.data?.crz_pwr_setpt[0].toFixed(1) ?? -1.0} {CONSTANTS.crz_pwr_setpt.UNIT}
                        </Text>
                    </Center>
                </GridItem> */}
                <GridItem
                    rowStart={2}
                    colStart={3}
                    pl='0.5'
                    pr='0.5'
                >
                    <Center
                        borderColor={borderCol}
                        borderTop='1px'
                        borderLeft='1px'
                        borderRight='1px'
                        h='100%'
                    >
                        <Text fontSize='sm'>Setpoints</Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={3}
                    colStart={3}
                    pl='0.5'
                    pr='0.5'
                >
                    <Center
                        bg={props.data?.crz_spd_setpt[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        // border='1px'
                        borderTop='1px'
                        borderLeft='1px'
                        borderRight='1px'
                        h='100%'
                    >
                        <Text 
                            as='b' 
                            fontSize='xs'
                            color={props.data?.crz_spd_setpt[0] ? greenTxtCol : redTxtCol}
                        >
                            {props.data?.crz_spd_setpt[0].toFixed(2) ?? -1.0} {CONSTANTS.crz_spd_setpt.UNIT}
                        </Text>
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={4}
                    colStart={3}
                    pl='0.5'
                    pr='0.5'
                >
                    <Center
                        bg={props.data?.crz_pwr_mode[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        borderTop='1px'
                        borderLeft='1px'
                        borderRight='1px'
                        borderBottom='1px'
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
                    colStart={3}
                >
                    <Center>
                        {(props.data?.state[0] == '4') ? <Image fit={fitType} boxSize='35px' src={Images.Cruise}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
            </Grid>

            <Grid
                flex='1'
                templateRows='1fr 1fr 1fr'
                templateColumns='3fr 1fr 1fr 1fr'
                h='25%'
            >
                <GridItem
                    rowStart={1}
                    colStart={2}
                    borderTop='1px'
                    borderLeft='1px'
                    bg={headerBg}
                >
                    <Center fontSize='xs' h='100%'>
                        X / Roll
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={1}
                    colStart={3}
                    borderTop='1px'
                    borderLeft='1px'
                    bg={headerBg}
                >
                    <Center fontSize='xs' h='100%'>
                        Y / Pitch
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={1}
                    colStart={4}
                    borderTop='1px'
                    borderLeft='1px'
                    bg={headerBg}
                    h='100%'
                >
                    <Center fontSize='xs' h='100%'>
                        Z / Yaw
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={2}
                    colStart={1}
                    borderTop='1px'
                >
                    <Center fontSize='xs' h='100%'>
                        Linear Acceleration (m/s^2)
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={3}
                    colStart={1}
                    borderTop='1px'
                    borderBottom='1px'
                >
                    <Center fontSize='xs' h='100%'>
                        Angular Rate (deg/s)
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={2}
                    colStart={2}
                    borderTop='1px'
                    borderLeft='1px'
                >
                    <Center as='b' fontSize='xs' h='100%'>
                        {props.data?.linear_accel_x[0].toFixed(0) ?? -1.0}
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={2}
                    colStart={3}
                    borderTop='1px'
                    borderLeft='1px'
                >
                    <Center as='b' fontSize='xs' h='100%'>
                        {props.data?.linear_accel_y[0].toFixed(0) ?? -1.0}
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={2}
                    colStart={4}
                    borderTop='1px'
                    borderLeft='1px'
                >
                    <Center as='b' fontSize='xs' h='100%'>
                        {props.data?.linear_accel_z[0].toFixed(0) ?? -1.0}
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={3}
                    colStart={2}
                    borderTop='1px'
                    borderLeft='1px'
                    borderBottom='1px'
                >
                    <Center as='b' fontSize='xs' h='100%'>
                        {props.data?.angular_rate_roll[0].toFixed(0) ?? -1.0}
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={3}
                    colStart={3}
                    borderTop='1px'
                    borderLeft='1px'
                    borderBottom='1px'
                >
                    <Center as='b' fontSize='xs' h='100%'>
                        {props.data?.angular_rate_pitch[0].toFixed(0) ?? -1.0}
                    </Center>
                </GridItem>
                <GridItem
                    rowStart={3}
                    colStart={4}
                    borderTop='1px'
                    borderLeft='1px'
                    borderBottom='1px'
                >
                    <Center as='b' fontSize='xs' h='100%'>
                        {props.data?.angular_rate_yaw[0].toFixed(0) ?? -1.0}
                    </Center>      
                </GridItem>
            </Grid>
            
            <Grid
                flex='1'
                templateRows="1fr 1fr" 
                templateColumns="1fr 1fr 1fr 1fr 1fr"
                h='25%'
            >
                <GridItem 
                    rowStart={1}
                    colStart={1}
                    h={icon_height}
                    w={icon_width}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.parking_brake[0] ? <Image fit={fitType} boxSize='35px' src={Images.ParkingBrake}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={1}
                    colStart={2}
                    h={icon_height}
                    w={icon_width}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.brake_status[0] ? <Image fit={fitType} boxSize='35px' src={Images.Brake}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={1}
                    colStart={3}
                    h={icon_height}
                    w={icon_width}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.mech_brake_status[0] ? <Image fit={fitType} boxSize='35px' src={Images.MechanicalBrake}/> : <Box h='35px'/>}
                    </Center>                
                </GridItem>
                <GridItem 
                    rowStart={1}
                    colStart={4}
                    h={icon_height}
                    w={icon_width}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.horn_status[0] ? <Image fit={fitType} boxSize='35px' src={Images.Horn}/> : <Box h='35px'/>}
                    </Center>                
                </GridItem>
                <GridItem 
                    rowStart={2}
                    colStart={1}
                    h={icon_height}
                    w={icon_width}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.left_turn[0] ? <Image fit={fitType} boxSize='35px' src={Images.Left}/> : <Box h='35px'/>}
                    </Center>                
                </GridItem>
                <GridItem 
                    rowStart={2}
                    colStart={2}
                    h={icon_height}
                    w={icon_width}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.right_turn[0] ? <Image fit={fitType} boxSize='35px' src={Images.Right}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={2}
                    colStart={3}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.headlights[0] ? <Image fit={fitType} boxSize='35px' src={Images.Headlights}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
                <GridItem 
                    rowStart={2}
                    colStart={4}
                    h={icon_height}
                    w={icon_width}
                >
                    <Center h='100%' w='100%'>
                        {props.data?.hazards[0] ? <Image fit={fitType} boxSize='35px' src={Images.Hazards}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={1}
                    rowSpan={2}
                    colStart={5}
                    h={icon_height}
                    w={icon_width}
                >
                    <Center h='100%'>
                        {props.data?.eco[0] ? <Image fit={fitType} boxSize='35px' src={Images.ECO}/> : <Box h='35px'/>}
                    </Center>
                </GridItem>
            </Grid>
        </Flex>
    );

}