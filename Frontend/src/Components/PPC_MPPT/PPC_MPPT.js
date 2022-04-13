import {Flex, Spacer, VStack} from "@chakra-ui/react";
import PPC_CELL from "./PPC_CELL";
import MPPT_CELL from "./MPPT_CELL";
import OutputCurrent from "./OutputCurrent";
import HeadingCell from "../GeneralData/HeadingCell";
import RangeCell from "../GeneralData/RangeCell";


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
                <HeadingCell fontSize='1.1vw' label='Power Path Controller'/>
                <Flex flex='2' p='1'>
                      <PPC_CELL
                          boolean={props.data?.supplemental_valid[0]}
                          label='Supplemental Battery Pack'
                      />
                      <Spacer/>
                      <PPC_CELL
                          boolean={props.data?.dcdc_valid[0]}
                          label='Main Battery Pack'
                      />
                </Flex>
                <HeadingCell fontSize='1.1vw' label='Maximum Power Point Tracker'/>
                <Flex flex = '8' direction='column' pb='1' pl='2' pr='2'>
                    <Flex pt='1'>
                        <OutputCurrent
                            label='Output Current'
                            current={props.data?.mppt_current_out[0] ?? -1.0}
                        />
                        <Spacer/>
                        <Flex w='45%' direction='column'>
                            <MPPT_CELL
                                label='Charge'
                                boolean={props.data?.mppt_mode[0]}
                            />
                            <Spacer/>
                            <MPPT_CELL
                                label='MPPT'
                                boolean={!props.data?.mppt_mode[0]}
                            />
                        </Flex>
                    </Flex>
                    <RangeCell
                        fontSize='1vw'
                        label='Cell String 1 Temp'
                        data={props.data?.string1_temp[0] ?? -1.0}
                        digits={3}
                        unit="&#8451;"
                    />
                    <RangeCell
                        fontSize='1vw'
                        label='Cell String 2 Temp'
                        data={props.data?.string2_temp[0] ?? -1.0}
                        digits={3}
                        unit="&#8451;"
                    />
                    <RangeCell
                        fontSize='1vw'
                        label='Cell String 2 Temp'
                        data={props.data?.string3_temp[0] ?? -1.0}
                        digits={3}
                        unit="&#8451;"
                    />
                </Flex>
            </VStack>
        </Flex>
    )
}
