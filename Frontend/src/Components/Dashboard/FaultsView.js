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

export default function Faults(props) {
    

    return (
        <VStack>
            <Heading size="md">Faults</Heading>
            <HStack flexWrap="wrap">
                <Text>A</Text>
                <Text>B</Text>
                <Text>C</Text>
            </HStack>
        </VStack>
    );
}
