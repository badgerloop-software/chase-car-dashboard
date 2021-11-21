import {
    Box,
    Center,
    Grid,
    GridItem,
    Heading,
    HStack,
    Text,
    VStack,
} from "@chakra-ui/react";
import React, { useState, useLayoutEffect } from "react";
import TirePressure from "./TirePressure";

export default function DataView(props) {

    return (
        <div>

            <Heading>Data</Heading>
            <HStack>
                <Box>
                    <Text>Speed: {props.data?.speed}</Text>
                    <Text>Power: {props.data?.power}</Text>
                    <Text>Charge: {props.data?.charge}</Text>
                    <Text>netPower: {props.data?.netPower}</Text>
                    <Text>motorPower: {props.data?.motorPower}</Text>
                    <Text>milesLeft: {props.data?.milesLeft}</Text>
                    <Text>batteryTemp: {props.data?.batteryTemp}</Text>
                    <Text>motorTemp: {props.data?.motorTemp}</Text>
                    <Text>motorControllerTemp: {props.data?.motorControllerTemp}</Text>
                    <Text>state: {props.data?.state}</Text>
                </Box>
                <TirePressure
                    size={10}
                    borderWidth={1}
                    borderColor="black"
                    frontLeftTP={props.data?.frontLeftTP}
                    frontRightTP={props.data?.frontRightTP}
                    backLeftTP={props.data?.backLeftTP}
                    backRightTP={props.data?.backRightTP}
                />
            </HStack>
        </div>
    );
}


