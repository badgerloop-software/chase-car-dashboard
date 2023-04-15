import {Text, Center, useColorMode} from "@chakra-ui/react"
import getColor from "../Shared/colors";

export default function MPPT_CELL(props){
    const { colorMode } = useColorMode();

    const borderCol = getColor("border", colorMode);
    const greenBgCol = getColor("greenBg", colorMode);
    const greenTxtCol = getColor("txtGreenBg", colorMode);
    const redBgCol = getColor("redBg", colorMode);
    const redTxtCol = getColor("txtRedBg", colorMode);

    return (
        <Center
            h='45%'
            bg={props.isCurrMode ? greenBgCol : redBgCol}
            borderColor={borderCol}
            borderWidth='2px'
            textAlign='center'
            lineHeight='1vh'
        >
            <Text as='b' fontSize='1.7vh' color={props.isCurrMode ? greenTxtCol : redTxtCol}>{props.label}</Text>
        </Center>
    )
}
