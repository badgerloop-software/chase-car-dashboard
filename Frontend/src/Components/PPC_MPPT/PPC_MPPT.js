import { Box, Flex, Spacer, Text, Heading, VStack, SimpleGrid, Image} from "@chakra-ui/react";
import PPC_Cell from "./PPC_Cell";
import CellString from "./CellString";
import MPPT_Cell from "./MPPT_Cell";
import OutCurr_Cell from "./OutCurr_Cell";
import Heading_Cell from "./Heading_Cell";
import Headlights from "./DriverIcons/Headlights.png"
import Hazards from "./DriverIcons/Hazards.png"
import Cruise from "./DriverIcons/Cruise.png"
import Left from "./DriverIcons/Left Turn.png"
import Right from "./DriverIcons/Right Turn.png"

export default function PPC_MPPT(props) {
    return (
        <Flex h='100%' direction = 'row' flex='1'> 
            <VStack
                flex='1'
                align='stretch'
                spacing={0}
            >
                <Heading_Cell label='Driver / Cabin'/>
                <Flex flex='3' pt='1' pb='1'>
                    <Flex flex='1.5' direction='column'>
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
                    <SimpleGrid flex='1' columns={2} pl='1'>
                        <Box border='1px' borderRadius='md' textAlign='center' verticalAlign=''>
                            <Text>D</Text>
                        </Box>
                        <Image src={Headlights}/>
                        <Image src={Hazards}/>
                        <Image src={Cruise}/>
                        <Image src={Left}/>
                        <Image src={Right}/>

                    </SimpleGrid>
                </Flex>
                <Heading_Cell label='Communication'/>
                <Flex flex='3'>
                
                </Flex>
            </VStack>
            <VStack
                flex='1'
                align='stretch'
                spacing={0}
                borderLeft='1px'
            >
                <Heading_Cell label='Power Path Controller'/>
                <Flex flex='2' p='1'>
                      <PPC_Cell
                          boolean={props.data?.supplemental_valid[0]}
                          label='Supplemental Battery Pack'
                      />
                      <Spacer/>
                      <PPC_Cell
                          boolean={props.data?.dcdc_valid[0]}
                          label='Main Battery Pack'
                      />
                </Flex>
                <Heading_Cell label='Maximum Power Point Tracker'/>
                <Flex flex = '8' direction='column' pb='1'>
                    <Flex pl='2' pr='2' pt='1'>
                        <OutCurr_Cell
                            label='Output Current'
                            current={props.data?.mppt_current_out[0] ?? -1.0}
                        />
                        <Spacer/>
                        <Flex w='45%' direction='column'>
                            <MPPT_Cell
                                label='Charge'
                                boolean={props.data?.mppt_mode[0]}
                            />
                            <Spacer/>
                            <MPPT_Cell
                                label='MPPT'
                                boolean={!props.data?.mppt_mode[0]}
                            />
                        </Flex>
                    </Flex>
                    <CellString
                        fontSize='1vw'
                        label='Cell String 1 Temp'
                        dataType={props.data?.string1_temp[0] ?? -1.0}
                        digits={3}
                        unitType="&#8451;"
                    />
                    <CellString
                        fontSize='1vw'
                        label='Cell String 2 Temp'
                        dataType={props.data?.string2_temp[0] ?? -1.0}
                        digits={3}
                        unitType="&#8451;"
                    />
                    <CellString
                        fontSize='1vw'
                        label='Cell String 2 Temp'
                        dataType={props.data?.string3_temp[0] ?? -1.0}
                        digits={3}
                        unitType="&#8451;"
                    />
                </Flex>
            </VStack>
        </Flex>
    )
}
