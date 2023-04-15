import {Flex, GridItem, Spacer, Grid, Center, Text, Box, useColorMode} from "@chakra-ui/react";
import PPC_CELL from "./PPC_CELL";
import MPPT_CELL from "./MPPT_CELL";
import OutputCurrent from "./OutputCurrent";
import StringCell from "./StringCell";
import HeadingCell from "../Shared/HeadingCell";
import CONSTANTS from "../../data-constants.json";
import getColor from "../Shared/colors";


export default function PPC_MPPT(props) {
    const { colorMode } = useColorMode();

    const headerBg = getColor("header", colorMode);
    const borderCol = getColor("border", colorMode);

    return (
        <Flex flex='auto' direction='column' overflowY='scroll'>
            <Box borderRight='1px' h="100%">
                <HeadingCell fontSize='2vh' label='Power Path Controller'/>
                <Flex flex='2' p='1'>
                      <PPC_CELL
                          isCurrSource={props.data?.supplemental_valid[0]}
                          label='Supplemental'
                      />
                      <Spacer/>
                      <PPC_CELL
                          isCurrSource={props.data?.dcdc_valid[0]}
                          label='Main Pack'
                      />
                </Flex>
                <HeadingCell fontSize='2vh' label='Maximum Power Point Tracker'/>
                <Flex flex = '8' direction='column' pb='1' pl='2' pr='2'>
                    <Flex pt='1'>
                        <OutputCurrent
                            label='Output Current'
                            current={props.data?.mppt_current_out[0] ?? -1.0}
                            currentMin={CONSTANTS.mppt_current_out.MIN}
                            currentMax={CONSTANTS.mppt_current_out.MAX}
                        />
                        <Spacer/>
                        <Flex w='45%' direction='column'>
                            <MPPT_CELL
                                label='Tracking'
                                isCurrMode={props.data?.mppt_mode[0]}
                            />
                            <Spacer/>
                            <MPPT_CELL
                                label='Current Control'
                                isCurrMode={!props.data?.mppt_mode[0]}
                            />
                        </Flex>
                    </Flex>
                    <Grid
                        mt='1'
                    >
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderLeftWidth='2px'
                            colStart={2}
                            bg={headerBg}
                            fontWeight='bold'
                            height='2.5vh'
                            fontSize='0.7vw'
                            textAlign='center'
                        >
                            Temp ({CONSTANTS.string1_temp.UNIT})
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderLeftWidth='2px'
                            colStart={3}
                            bg={headerBg}
                            fontWeight='bold'
                            height='2.5vh'
                            fontSize='0.7vw'
                            textAlign='center'
                        >
                            Voltage ({CONSTANTS.string1_V_in.UNIT})
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderX={`2px solid ${borderCol}`}
                            colStart={4}
                            bg={headerBg}
                            fontWeight='bold'
                            height='2.5vh'
                            fontSize='0.7vw'
                            textAlign='center'
                        >
                            Current ({CONSTANTS.string1_I_in.UNIT})
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderLeftWidth='2px'
                            colStart={1}
                            rowStart={2}
                            bg={headerBg}
                        >
                            <Center h='100%' fontWeight='bold' fontSize='0.8vw'>String 1</Center>
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderLeftWidth='2px'
                            colStart={2}
                            rowStart={2}
                        >
                            <StringCell
                                data={props.data?.string1_temp[0] ?? -1.0}
                                min={CONSTANTS.string1_temp.MIN}
                                max={CONSTANTS.string1_temp.MAX}
                            />
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderLeftWidth='2px'
                            colStart={3}
                            rowStart={2}
                        >
                            <StringCell
                                data={props.data?.string1_V_in[0] ?? -1.0}
                                min={CONSTANTS.string1_V_in.MIN}
                                max={CONSTANTS.string1_V_in.MAX}
                            />
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderX={`2px solid ${borderCol}`}
                            colStart={4}
                            rowStart={2}
                        >
                            <StringCell
                                data={props.data?.string1_I_in[0] ?? -1.0}
                                min={CONSTANTS.string1_I_in.MIN}
                                max={CONSTANTS.string1_I_in.MAX}
                            />
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderLeftWidth='2px'
                            colStart={1}
                            rowStart={3}
                            bg={headerBg}
                        >
                            <Center h='100%' fontWeight='bold' fontSize='0.8vw'>String 2</Center>
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderLeftWidth='2px'
                            colStart={2}
                            rowStart={3}
                        >
                            <StringCell
                                data={props.data?.string2_temp[0] ?? -1.0}
                                min={CONSTANTS.string2_temp.MIN}
                                max={CONSTANTS.string2_temp.MAX}
                            />
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderLeftWidth='2px'
                            colStart={3}
                            rowStart={3}
                        >
                            <StringCell
                                data={props.data?.string2_V_in[0] ?? -1.0}
                                min={CONSTANTS.string2_V_in.MIN}
                                max={CONSTANTS.string2_V_in.MAX}
                            />
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderTopWidth='2px'
                            borderX={`2px solid ${borderCol}`}
                            colStart={4}
                            rowStart={3}
                        >
                            <StringCell
                                data={props.data?.string2_I_in[0] ?? -1.0}
                                min={CONSTANTS.string2_I_in.MIN}
                                max={CONSTANTS.string2_I_in.MAX}
                            />
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderY={`2px solid ${borderCol}`}
                            borderLeftWidth='2px'
                            colStart={1}
                            rowStart={4}
                            bg={headerBg}
                        >
                            <Center h='100%' fontWeight='bold' fontSize='0.8vw'>String 3</Center>
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderY={`2px solid ${borderCol}`}
                            borderLeftWidth='2px'
                            colStart={2}
                            rowStart={4}
                        >
                            <StringCell
                                data={props.data?.string3_temp[0] ?? -1.0}
                                min={CONSTANTS.string3_temp.MIN}
                                max={CONSTANTS.string3_temp.MAX}
                            />
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderY={`2px solid ${borderCol}`}
                            borderLeftWidth='2px'
                            colStart={3}
                            rowStart={4}
                        >
                            <StringCell
                                data={props.data?.string3_V_in[0] ?? -1.0}
                                min={CONSTANTS.string3_V_in.MIN}
                                max={CONSTANTS.string3_V_in.MAX}
                            />
                        </GridItem>
                        <GridItem
                            borderColor={borderCol}
                            borderWidth='2px'
                            colStart={4}
                            rowStart={4}
                        >
                            <StringCell
                                data={props.data?.string3_I_in[0] ?? -1.0}
                                min={CONSTANTS.string3_I_in.MIN}
                                max={CONSTANTS.string3_I_in.MAX}
                            />
                        </GridItem>
                    </Grid>
                </Flex>
            </Box>
        </Flex>
    )
}
