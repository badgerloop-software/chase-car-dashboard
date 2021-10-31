import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4001";

export default function ClientComponent() {
    const [response, setResponse] = useState("");

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            setResponse(data);
        });

        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        //

    }, []);

    return (
        <p>
            It's {response}
        </p>
    );
}
