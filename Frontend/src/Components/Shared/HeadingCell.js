import {Box, Heading, useColorMode} from "@chakra-ui/react";
import getColor from "./colors.js";

export default function HeadingCell(props) {
    const { colorMode } = useColorMode();

    const headerBg = getColor("header", colorMode);
    const borderCol = getColor("border", colorMode);

    return (
        <Box w={props.w ?? "100%"} bg={headerBg} borderColor={borderCol} borderTopWidth='1px' borderBottomWidth='1px' textAlign='center' lineHeight='1'>
            <Heading as='b' fontSize={props.fontSize}>{props.label}</Heading>
        </Box>
    )
}
