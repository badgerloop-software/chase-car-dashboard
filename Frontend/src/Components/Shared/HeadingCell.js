import {Box, Heading, useColorMode} from "@chakra-ui/react";
import colors from "./colors";

export default function HeadingCell(props) {
    const { colorMode } = useColorMode();

    const headerBg = colorMode === "light" ? colors.light.header : colors.dark.header;
    const borderCol = colorMode === "light" ? colors.light.border : colors.dark.border;

    return (
        <Box w={props.w ?? "100%"} bg={headerBg} borderColor={borderCol} borderTopWidth='1px' borderBottomWidth='1px' textAlign='center' lineHeight='1'>
            <Heading as='b' fontSize={props.fontSize}>{props.label}</Heading>
        </Box>
    )
}
