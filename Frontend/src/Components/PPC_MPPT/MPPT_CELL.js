import {Text, Center, useColorMode} from "@chakra-ui/react"
import getColor from "../Shared/colors";

export default function MPPT_CELL(props){
    const { colorMode } = useColorMode();

    const borderCol = getColor("border", colorMode);
    const greenBgCol = getColor("ppc_mppt_greenBg", colorMode);
    const greenTxtCol = getColor("ppc_mppt_txtGreenBg", colorMode);
    const redBgCol = getColor("ppc_mppt_redBg", colorMode);
    const redTxtCol = getColor("ppc_mppt_txtRedBg", colorMode);

    return (
        <Center
            h='45%'
            bg={props.boolean ? greenBgCol : redBgCol}
            borderColor={borderCol}
            borderWidth='2px'
            lineHeight='1.6em'
        >
            <Text as='b' fontSize='1.3vw' color={props.boolean ? greenTxtCol : redTxtCol}>{props.label}</Text>
        </Center>
    )

}
