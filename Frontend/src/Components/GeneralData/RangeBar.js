import { Box } from "@chakra-ui/react";

export default function BatteryCharge(props) {
    return (
        <>
            <Box
                border="2px"
                w={props.w ?? "10vh"}
                h="2vh"
                css={{
                    background: "linear-gradient(to right, green " + props.val + "%, white " + props.val + "% 100%)"
                }}
             />
        </>
    );
}
