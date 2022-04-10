import { Flex, Spacer, VStack} from "@chakra-ui/react";
import PPC_Cell from "./PPC_Cell";
import CellString from "./CellString";
import MPPT_Cell from "./MPPT_Cell";
import OutCurr_Cell from "./OutCurr_Cell";
import Heading_Cell from "./Heading_Cell";

export default function PPC_MPPT(props) {
    return (
        <Flex h='100%' direction = 'row' flex='1'>
            <Flex flex='1'>Placeholder</Flex>
            <VStack
                flex='1'
                align='stretch'
                spacing={0}
                borderLeft='1px'
            >
                <Heading_Cell label='Power Path Controller'/>
                <Flex flex='2' direction='column' p='1'>
                    <Flex flex='1' direction='row'>
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
                </Flex>
                <Heading_Cell label='Maximum Power Point Tracker'/>
                <Flex flex = '8' direction='column' pb='1'>
                    <Flex flex='1' direction='row' pl='2' pr='2' pt='1'>
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
                        label='Cell String 1 Temp'
                        temperature={props.data?.string1_temp[0] ?? -1.0}
                    />
                    <CellString
                        label='Cell String 2 Temp'
                        temperature={props.data?.string2_temp[0] ?? -1.0}
                    />
                    <CellString
                        label='Cell String 2 Temp'
                        temperature={props.data?.string3_temp[0] ?? -1.0}
                    />
                </Flex>
            </VStack>
        </Flex>
    )
}
