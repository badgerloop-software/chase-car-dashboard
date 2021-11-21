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
import FaultsView from "./FaultsView";

export default function DataView(props) {
    const callBackendAPI = async () => {
        const response = await fetch("/api");
        const body = await response.json();

        if (response.status !== 200) {
            console.error("api: error");
            throw Error(body.message);
        }

        return body;
    };

    const [state, setState] = useState({ data: null });
    useLayoutEffect(() => {
        callBackendAPI()
            .then((res) => {
                setState({ data: res.response });
                // console.log("api::", res.response);
            })
            .catch((err) => console.log(err));
    }, [state]);

    return (
        <div>

            <Heading>Data</Heading>
            <HStack>
                <Box>
                    <Text>Speed: {state.data?.speed}</Text>
                    <Text>Power: {state.data?.power}</Text>
                    <Text>Charge: {state.data?.charge}</Text>
                    <Text>netPower: {state.data?.netPower}</Text>
                    <Text>motorPower: {state.data?.motorPower}</Text>
                    <Text>milesLeft: {state.data?.milesLeft}</Text>
                    <Text>batteryTemp: {state.data?.batteryTemp}</Text>
                    <Text>motorTemp: {state.data?.motorTemp}</Text>
                    <Text>motorControllerTemp: {state.data?.motorControllerTemp}</Text>
                    <Text>state: {state.data?.state}</Text>
                </Box>
                <TirePressure
                    size={10}
                    borderWidth={1}
                    borderColor="black"
                    frontLeftTP={state.data?.frontLeftTP}
                    frontRightTP={state.data?.frontRightTP}
                    backLeftTP={state.data?.backLeftTP}
                    backRightTP={state.data?.backRightTP}
                />
            </HStack>
        </div>
    );
}


