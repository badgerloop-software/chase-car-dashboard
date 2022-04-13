import {Text, Center} from "@chakra-ui/react"

export default function MPPT_CELL(props){
    return (
        <Center
            h='45%'
            bg={props.boolean? '#05FF00':'#FF010140'}
            border='2px'
            lineHeight='1.6em'
        >
            <Text as='b' fontSize='1.3vw'>{props.label}</Text>
        </Center>
    )

}
