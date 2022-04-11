import { Box, Flex, Center, VStack, SimpleGrid, Image, Text} from "@chakra-ui/react";
import CellString from "./CellString";
import Heading_Cell from "./Heading_Cell";
import Headlights from "./DriverIcons/Headlights.png"
import Hazards from "./DriverIcons/Hazards.png"
import Cruise from "./DriverIcons/Cruise.png"
import Left from "./DriverIcons/Left Turn.png"
import Right from "./DriverIcons/Right Turn.png"
import Check_Mark from "./DriverIcons/Check Mark.png"
import Cross_Mark from "./DriverIcons/Cross Mark.png"

export default function Driver_Comms(props) {
    return (
        <Flex h='100%'> 
            <VStack
                flex='1'
                align='stretch'
                spacing={0}
            >
                <Heading_Cell fontSize='2.2vh' label='Driver / Cabin'/>
                <Flex flex='3' pt='1' pb='1'>
                    <Flex flex='1.5' direction='column' pl='2' pr='2'>
                        <CellString
                            fontSize='0.85vw'
                            label='Speed'
                            dataType={props.data?.speed[0] ?? -1.0}
                            digits={0}
                            unitType=" mph"
                        />
                        <CellString
                            fontSize='0.85vw'
                            label='Accelerator'
                            dataType={props.data?.accelerator[0] ?? -1.0}
                            digits={0}
                            unitType="%"
                        />
                        <CellString
                            fontSize='0.85vw'
                            label='Cabin Temp'
                            dataType={props.data?.cabin_temp[0] ?? -1.0}
                            digits={0}
                            unitType="&#8451;"
                        />
                    </Flex>
                    <Center w='30%'>
                        <SimpleGrid columns={2} rows={3} alignItems='center' spacing={2}>
                            {props.data?.state[0] ?
                                <Center h='35px' w='35px' borderColor='black' borderWidth='2px' borderRadius='md' textAlign='center'>
                                    <Text as='b' fontSize='2.3vh'>{props.data?.state[0]}</Text>
                                </Center> 
                                : 
                                <Center h='35px'></Center>
                            }
                            {props.data?.headlights[0] ? <Image boxSize='35px' src={Headlights}/> : <Box h='35px'></Box>}
                            {props.data?.hazards[0] ? <Image boxSize='35px' src={Hazards}/> : <Center h='35px'></Center>}
                            {props.data?.cruise[0] ? <Image boxSize='35px' src={Cruise}/> : <Center h='35px'></Center>}
                            {props.data?.left_turn[0] ? <Image boxSize='35px' src={Left}/> : <Center h='35px'></Center>}
                            {props.data?.right_turn[0] ? <Image boxSize='35px' src={Right}/> : <Center h='35px'></Center>}
                        </SimpleGrid>
                    </Center>
                </Flex>
                <Heading_Cell fontSize='2.2vh' label='Communication'/>
                <Flex flex='3' direction='column' pt='1' pl='2' pb='1'>
                    <Flex flex='1' direction='column'>
                        <Flex alignItems='center'>
                            {props.data?.mainIO_heartbeat[0] ? <Image boxSize='2vh' src={Check_Mark}/> : <Image boxSize='2vh' src={Cross_Mark}/>}
                            <Text fontSize='2vh'>&#160;Solar Car</Text>
                        </Flex>
                        <Text fontSize='2vh' style={{ textIndent: 30 }}>&#160;Packet Delay: 00.00</Text>
                    </Flex>
                    <Flex flex='1' alignItems='center'>
                        {props.data?.mainIO_heartbeat[0] ? <Image boxSize='2vh' src={Check_Mark}/> : <Image boxSize='2vh' src={Cross_Mark}/>}
                        <Text fontSize='2vh'>&#160;Driver I/O - Main I/O</Text>
                    </Flex> 
                    <Flex flex='1' alignItems='center'>
                        {props.data?.bms_canbus_failure[0] ? <Image boxSize='2vh' src={Check_Mark}/> : <Image boxSize='2vh' src={Cross_Mark}/>}
                        <Text fontSize='2vh'>&#160;BMS CANBUS</Text>
                    </Flex>
                    
                
                </Flex>
            </VStack>
            <VStack
                flex='1'
                align='stretch'
                spacing={0}
                borderLeft='1px'
            >
            </VStack>
        </Flex>
    )
}
