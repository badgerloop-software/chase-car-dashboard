import {Text, Center, useColorMode} from "@chakra-ui/react";
import getColor from "../Shared/colors";

export default function PPC_CELL(props) {
    const { colorMode } = useColorMode();

    const borderCol = getColor("border", colorMode);
    const greenBgCol = getColor("ppc_mppt_greenBg", colorMode);
    const greenTxtCol = getColor("ppc_mppt_txtGreenBg", colorMode);
    const redBgCol = getColor("ppc_mppt_redBg", colorMode);
    const redTxtCol = getColor("ppc_mppt_txtRedBg", colorMode);

    return (
        <Center
            w='47%'
            bg={props.isCurrSource ? greenBgCol : redBgCol}
            borderColor={borderCol}
            borderWidth='2px'
            textAlign='center'
            lineHeight='2vh'
        >
            <Text as='b' fontSize='1vw' color={props.isCurrSource ? greenTxtCol : redTxtCol}>{props.label}</Text>
        </Center>
    )
}
