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

export default function PowerGraph(props) {

    return (
        <HStack h="100%" align="stretch">
            <Text
                css={{ writingMode: "vertical-lr" }}
                transform="rotate(180deg)"
                borderLeftColor="grey.300"
                borderLeftWidth={1}
                textAlign="center"
            >
                Power
            </Text>
            <Center flex={1}>Power Graph</Center>
        </HStack>
    );
}
