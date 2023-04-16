import {Grid, GridItem, Box, Flex, Spacer, Text, Center, useColorMode, VStack, Image} from "@chakra-ui/react";
import Icons from "./Icons";
import Motion from "./Motion";
import Motor from "./Motor"
import HeadingCell from "../Shared/HeadingCell";
import DataPack from "../BatteryCells/DataPack";
import CONSTANTS from "../../data-constants.json"
import getColor from "../Shared/colors";

export default function Motor_Motion(props) {
    const { colorMode } = useColorMode();
    const borderCol = getColor("border", colorMode);
    const greenBgCol = getColor("ppc_mppt_greenBg", colorMode);
    const greenTxtCol = getColor("ppc_mppt_txtGreenBg", colorMode);
    const redBgCol = getColor("ppc_mppt_redBg", colorMode);
    const redTxtCol = getColor("ppc_mppt_txtRedBg", colorMode);
    const headerBg = getColor("header", colorMode);
    
    return (
        <Flex flex='auto' direction='column'>
            <HeadingCell fontSize='2.2vh' label='Motor / Motion'/>
            <Grid 
                // margin={0.5} 
                // gap={1}
                flex='2'
                templateRows="1fr 1fr 1fr 1fr 1fr" 
                templateColumns="1fr 2fr 1fr"
            >
                <GridItem
                    rowStart={1}
                    rowSpan={2}
                    colStart={1}
                >
                    <Center p='1'>
                        <VStack lineHeight='1'>
                            <Text>F/R</Text>
                            <Center h='2.3vh' w='2.3vh' borderWidth='2px' borderRadius='md' textAlign='center'>
                                <Text as='b' fontSize='2.3vh'>{props.data?.fr_out[0] ? 'T' : 'F'}</Text>
                            </Center>
                        </VStack>
                        <Spacer/>
                        <VStack lineHeight='1'>
                            <Text>State</Text>
                            <Center h='2.3vh' w='2.3vh' borderWidth='2px' borderRadius='md' textAlign='center'>
                                <Text as='b' fontSize='2.3vh'>{props.data?.state[0] ?? "?"}</Text>
                            </Center>
                        </VStack>
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={4}
                    colStart={1}
                >
                    <Center
                        bg={props.data?.motor_controller_contactor[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        borderWidth='2px'
                        lineHeight='1.6em'
                        w='95%'
                    >
                        <Text as='b' fontSize='lg' color={props.data?.motor_controller_contactor[0] ? greenTxtCol : redTxtCol}>Motor {props.data?.motor_controller_contactor[0] ? 'True' : 'False'}</Text>
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={1}
                    colStart={2}
                >
                    <Flex flex='auto' direction='row' w='95%'>
                        <Text fontSize='sm'>Accelerator</Text>
                        <Spacer/>
                        <Text fontSize='sm'>{props.data?.accelerator[0].toFixed(0)} {CONSTANTS.accelerator.UNIT}</Text>
                    </Flex>
                </GridItem>
                <GridItem
                    rowStart={2}
                    colStart={2}
                >
                    <Flex flex='auto' direction='row' w='95%'>
                        <Text fontSize='sm'>Accelerator Out</Text>
                        <Spacer/>
                        <Text fontSize='sm'>{props.data?.accelerator_out[0].toFixed(1)} {CONSTANTS.accelerator_out.UNIT}</Text>
                    </Flex>
                </GridItem>
                <GridItem
                    rowStart={3}
                    colStart={2}
                >
                    <Flex flex='auto' direction='row' w='95%'>
                        <Text fontSize='sm'>Speed</Text>
                        <Spacer/>
                        <Text fontSize='sm'>{props.data?.speed[0].toFixed(0)} {CONSTANTS.speed.UNIT}</Text>
                    </Flex>
                </GridItem>
                <GridItem
                    rowStart={4}
                    colStart={2}
                >
                    <Flex flex='auto' direction='row' w='95%'>
                        <Text fontSize='sm'>Motor Power</Text>
                        <Spacer/>
                        <Text fontSize='sm'>{props.data?.motor_power[0].toFixed(0)} {CONSTANTS.accelerator.UNIT}</Text>
                    </Flex>                
                </GridItem>
                <GridItem
                    rowStart={5}
                    colStart={2}
                >
                    <Flex flex='auto' direction='row' w='95%'>
                        <Text fontSize='sm'>Motor Current</Text>
                        <Spacer/>
                        <Text fontSize='sm'>{props.data?.motor_current[0].toFixed(0)} {CONSTANTS.motor_current.UNIT}</Text>
                    </Flex>
                </GridItem>

                <GridItem
                    rowStart={2}
                    colStart={3}
                    rowSpan={3}
                >
                    <Center
                        borderColor={borderCol}
                        borderTop='1px'
                        borderLeft='1px'
                        borderRight='1px'
                        textAlign='center'
                    >
                        <Text fontSize='lg'>Setpoints</Text>
                    </Center>
                    <Center
                        bg={props.data?.crz_spd_setpt[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        border='1px'
                        textAlign='center'
                    >
                        <Text 
                            as='b' 
                            fontSize='lg'
                            color={props.data?.crz_spd_setpt[0] ? greenTxtCol : redTxtCol}
                        >
                            {props.data?.crz_spd_setpt[0].toFixed(2)} {CONSTANTS.crz_spd_setpt.UNIT}
                        </Text>
                    </Center>
                    <Center
                        bg={props.data?.crz_pwr_mode[0] ? greenBgCol : redBgCol}
                        borderColor={borderCol}
                        borderLeft='1px'
                        borderRight='1px'
                        borderBottom='1px'
                        textAlign='center'
                    >
                        <Text 
                            as='b' 
                            fontSize='lg'
                            color={props.data?.crz_pwr_mode[0] ? greenTxtCol : redTxtCol}
                        >
                            {props.data?.crz_pwr_setpt[0].toFixed(1)} {CONSTANTS.crz_pwr_setpt.UNIT}
                        </Text>
                    </Center>
                </GridItem>

                <GridItem
                    rowStart={5}
                    colStart={3}
                >
                    <Center>
                        <Image boxSize='35px' src={Icons.Cruise}/>
                        {/* {props.data?.crz_state[0] ? <Image boxSize='35px' src={Icons.Cruise}/> : <Box h='35px'/>} */}
                    </Center>
                </GridItem>

            </Grid>
            <Flex flex='1'>
                <Box bg='tomato' w='100%' h='100%'/>
            </Flex>
            <Flex flex='1'>
                <Box bg='blue' w='100%' h='100%'/>
            </Flex>
        </Flex>
    );

}