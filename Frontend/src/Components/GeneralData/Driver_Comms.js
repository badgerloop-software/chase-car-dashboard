import {Flex, Center, VStack, SimpleGrid, Text} from "@chakra-ui/react";
import Range_Cell from "./Range_Cell";
import Heading_Cell from "./Heading_Cell";
import IconCell from "./IconCell";
import Comms_Cell from "./Comms_Cell";
import Headlights from "./DriverIcons/Headlights.png"
import Hazards from "./DriverIcons/Hazards.png"
import Cruise from "./DriverIcons/Cruise.png"
import Left from "./DriverIcons/Left Turn.png"
import Right from "./DriverIcons/Right Turn.png"

export default function DriverComms(props) {
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
                        <Range_Cell
                            fontSize='2vh'
                            label='Speed'
                            dataType={props.data?.speed[0] ?? -1.0}
                            digits={0}
                            unitType=" mph"
                        />
                        <Range_Cell
                            fontSize='2vh'
                            label='Accelerator'
                            dataType={props.data?.accelerator[0] ?? -1.0}
                            digits={0}
                            unitType="%"
                        />
                        <Range_Cell
                            fontSize='2vh'
                            label='Cabin Temp'
                            dataType={props.data?.cabin_temp[0] ?? -1.0}
                            digits={1}
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
                            <IconCell
                                boolean={props.data?.headlights[0]}
                                boxSize='35px'
                                image={Headlights}
                            />
                            <IconCell
                                boolean={props.data?.hazards[0]}
                                boxSize='35px'
                                image={Hazards}
                            />
                            <IconCell
                                boolean={props.data?.cruise[0]}
                                boxSize='35px'
                                image={Cruise}
                            />
                            <IconCell
                                boolean={props.data?.left_turn[0]}
                                boxSize='35px'
                                image={Left}
                            />
                            <IconCell
                                boolean={props.data?.right_turn[0]}
                                boxSize='35px'
                                image={Right}
                            />
                        </SimpleGrid>
                    </Center>
                </Flex>
                <Heading_Cell fontSize='2.2vh' label='Communication'/>
                <Flex flex='3' direction='column' pt='1' pl='2' pb='1'>
                    <Flex flex='1' direction='column'>
                        <Comms_Cell
                            boolean={true}
                            label='Solar Car'
                        />
                        <Text fontSize='2vh' style={{ textIndent: 30 }}>&#160;Packet Delay: 00.00</Text>
                    </Flex>
                    <Comms_Cell
                        boolean={props.data?.mainIO_heartbeat[0]}
                        label='Driver I/O - Main I/O'
                    />
                    <Comms_Cell
                        boolean={props.data?.bms_canbus_failure[0]}
                        label='BMS CANBUS'
                    />
                </Flex>
            </VStack>
        </Flex>
    )
}
