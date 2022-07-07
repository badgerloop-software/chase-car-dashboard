import {Text, Center, useColorMode} from "@chakra-ui/react"
import colors from "../Shared/colors";

export default function MPPT_CELL(props){
    const { colorMode } = useColorMode();

    const borderCol = colorMode === "light" ? colors.light.border : colors.dark.border;
    const greenTxtCol = colorMode === "light" ? colors.light.ppc_mppt_txtGreenBg : colors.dark.ppc_mppt_txtGreenBg;
    const redTxtCol = colorMode === "light" ? colors.light.ppc_mppt_txtRedBg : colors.dark.ppc_mppt_txtRedBg;

    return (
        <Center
            h='45%'
            bg={props.boolean ? '#05FF00' : '#FF010140'}
            borderColor={borderCol}
            borderWidth='2px'
            lineHeight='1.6em'
        >
            <Text as='b' fontSize='1.3vw' color={props.boolean ? greenTxtCol : redTxtCol}>{props.label}</Text>
        </Center>
    )

}
