import {Grid, GridItem, Box, Flex, Spacer, Text, Center, useColorMode, VStack, Image} from "@chakra-ui/react";
import getColor from "../Shared/colors";
import images from "./Icons/Images"

export default function Icons(props) {
    const { colorMode } = useColorMode();
    const Images = images[`${colorMode}`];
    
    return (
        <Center h='100%' w='100%'>
            {props.data?.parking_brake[0] ? <Image src={props.icon_image}/> : <Box h='35px'/>}
        </Center>
    );

}