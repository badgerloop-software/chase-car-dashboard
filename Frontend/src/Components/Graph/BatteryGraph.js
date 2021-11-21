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

export default function BatteryGraph(props) {

    return (
        <HStack h="100%" align="stretch">
            <Text
                css={{ writingMode: "vertical-lr" }}
                transform="rotate(180deg)"
                borderLeftColor="grey.300"
                borderLeftWidth={1}
                textAlign="center"
            >
                Battery
            </Text>
            <Center flex={1}>Battery Graph</Center>
        </HStack>
    );
}
