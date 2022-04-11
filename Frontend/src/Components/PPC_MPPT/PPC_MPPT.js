import {Flex, Spacer, VStack} from "@chakra-ui/react";
import PPC_Cell from "./PPC_Cell";
import MPPT_Cell from "./MPPT_Cell";
import OutCurr_Cell from "./OutCurr_Cell";
import Heading_Cell from "./Heading_Cell";
import Range_Cell from "../GeneralData/Range_Cell";


export default function PPC_MPPT(props) {
    return (
        <Flex h='100%'> 
            <VStack
                flex='1'
                align='stretch'
                spacing={0}
            >
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
                    <Range_Cell
                        fontSize='1vw'
                        label='Cell String 1 Temp'
                        dataType={props.data?.string1_temp[0] ?? -1.0}
                        digits={3}
                        unitType="&#8451;"
                    />
                    <Range_Cell
                        fontSize='1vw'
                        label='Cell String 2 Temp'
                        dataType={props.data?.string2_temp[0] ?? -1.0}
                        digits={3}
                        unitType="&#8451;"
                    />
                    <Range_Cell
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
