import { VStack, Image, Text } from "@chakra-ui/react";
import image from "./battery.png";

export default function BatteryCharge(props) {
    return (
        <>
            <VStack>
                <Image
                    src={image}
                    h="20vh"
                    css={{
                        background: "linear-gradient(to top, white 5%, "
                                    + ((props.charge <= 20) ? "red" : ((props.charge <= 60) ? "yellow" : "lime"))
                                    + " 5% " + (5+(props.charge/100)*87) + "%, white "
                                    + (5+(props.charge/100)*87) + "% 100%)"
                    }}
                />
                <Text>{props.charge}%</Text>
            </VStack>
        </>
    );
}
