import {Text, Center, useColorMode} from "@chakra-ui/react";
import getColor from "../Shared/colors";

export default function PPC_CELL(props) {
    const { colorMode } = useColorMode();

    const borderCol = getColor("border", colorMode);
    const greenBgCol = getColor("greenBg", colorMode);
    const greenTxtCol = getColor("txtGreenBg", colorMode);
    const redBgCol = getColor("redBg", colorMode);
    const redTxtCol = getColor("txtRedBg", colorMode);

    return (
        <Center
            w='47%'
            bg={props.isCurrSource ? greenBgCol : redBgCol}
            borderColor={borderCol}
            borderWidth='2px'
            textAlign='center'
            lineHeight='2.25vh'
        >
            <Text as='b' fontSize='1vw' color={props.isCurrSource ? greenTxtCol : redTxtCol}>{props.label}</Text>
        </Center>
    )
}
