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

export default function BatteryGraph(props) {
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
            BatteryGraph
        </div>
    );
}
