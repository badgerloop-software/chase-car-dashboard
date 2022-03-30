import { Box, Flex, Spacer, Grid, GridItem, Heading, Text} from "@chakra-ui/react";

export default function PPC_MPPT(props) {
    return (
        <Flex h='100%' direction = 'row'> 
            <Flex w='50%'> hi </Flex>
            <Grid
                templateRows='repeat(9, 1fr)'
                templateColumns='repeat(2, 1fr)'
                w='50%'
            >
                <GridItem colSpan={2} rowSpan={1}>
                    <Box w='100%' h='100%' bg='#DDDDDD' borderWidth='1px' borderColor='black'>
                            <Heading size = 'xs' textAlign = 'center'>Power Path Controller</Heading>
                    </Box>
                </GridItem>

                <GridItem colStart={1} rowStart={2} rowSpan={2}>
                    <Box w='100%' h='100%' bg='Tomato'> hi </Box>
                </GridItem>
                <GridItem colStart={2} rowStart={2} rowSpan={2}>
                    <Box w='100%' h='100%' bg='Green'> hi </Box>
                </GridItem>

                <GridItem colSpan={2} rowStart={4}>
                    <Box w='100%' h='100%' bg='#DDDDDD' borderWidth='1px' borderColor='black'>
                            <Heading size = 'xs' textAlign = 'center'>Maximum Power Point Tracker</Heading>
                    </Box>
                </GridItem>

                <GridItem colStart={1} rowStart={5} rowSpan={2}> 
                    <Box w='100%' h='100%' borderWidth='1px' borderColor='black'>
                        Output current
                    </Box>
                </GridItem>
                <GridItem colStart={2} rowStart={5} rowSpan={2}>
                    <Box w='100%' h='100%' borderWidth='1px' borderColor='black'>
                        Charge + MPPT
                    </Box>
                </GridItem>

                <GridItem colSpan={2} rowStart={7}>
                    <Box w='100%' h='100%' bg='Tomato' borderWidth='1px' borderColor='black'>
                        Cell String 1
                    </Box>
                </GridItem>
                <GridItem colSpan={2} rowStart={8}>
                    <Box w='100%' h='100%' bg='Tomato' borderWidth='1px' borderColor='black'>
                        Cell String 2
                    </Box>
                </GridItem>
                <GridItem colSpan={2} rowStart={9}>
                    <Box w='100%' h='100%' bg='Tomato' borderWidth='1px' borderColor='black'>
                        Cell String 3
                    </Box>
                </GridItem>
            </Grid>
        </Flex>
    )
}