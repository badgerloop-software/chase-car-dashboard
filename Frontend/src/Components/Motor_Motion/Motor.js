import {Grid, Box, GridItem} from "@chakra-ui/react";

export default function Motor(props) {
    return (
        <Grid 
            margin={0.5} 
            gap={1} flex="1 1 0" 
            templateRows="1fr 1fr 1fr 1fr 1fr" 
            templateColumns="1fr 2fr 1fr">
            <GridItem
                rowStart={1}
                rowSpan={5}
                colStart={1}
            >
                <Box bg='green' w='100%' h='100%'></Box>
            </GridItem>
            <GridItem
                rowStart={1}
                rowSpan={5}
                colStart={2}
            >
                <Box bg='blue' w='100%' h='100%'></Box>
            </GridItem>
            <GridItem
                rowStart={1}
                rowSpan={5}
                colStart={3}
            >
                <Box bg='tomato' w='100%' h='100%'></Box>
            </GridItem>

        </Grid>
    );
}