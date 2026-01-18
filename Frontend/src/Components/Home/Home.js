import { Box, useColorMode, VStack, Stat, StatLabel, StatNumber, HStack, Icon, Text, Center } from "@chakra-ui/react";
import { IoSpeedometer } from "react-icons/io5";
import { FaLeaf } from "react-icons/fa";
import getColor from "../Shared/colors";
import FaultsView from "../Faults/FaultsView";

export default function Home({ render3D = true, data }) {
  const { colorMode } = useColorMode();
  const borderCol = getColor("border", colorMode);
  const bgCol = colorMode === "light" ? "white" : "gray.800";

  return (
    <Box
      h="100vh"
      w="100%"
      position="relative"
      bgColor={colorMode === "light" ? "gray.100" : "#1a1a1a"}
      overflow="hidden"
    >
      {/* Embed the car visualizer using iframe or show placeholder */}
      {render3D ? (
        <Box
          as="iframe"
          src="https://badgerloop-software.github.io/car-visualizer/"
          w="100%"
          h="100%"
          border="none"
          title="Car Visualizer"
        />
      ) : (
        <Center w="100%" h="100%" bgColor={colorMode === "light" ? "gray.200" : "gray.900"}>
          <VStack spacing={4}>
            <Text fontSize="4xl" fontWeight="bold" color={colorMode === "light" ? "gray.600" : "gray.400"}>
              3D Rendering Disabled
            </Text>
            <Text fontSize="lg" color={colorMode === "light" ? "gray.500" : "gray.500"}>
              Enable "Render 3D" in Settings to view the car visualization
            </Text>
          </VStack>
        </Center>
      )}
      
      {/* Title in top left corner */}
      <VStack
        position="absolute"
        top={4}
        left={4}
        align="flex-start"
        spacing={0}
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="#C9302C"
          letterSpacing="wide"
        >
          BADGER SOLAR RACING
        </Text>
        <Text
          fontSize="xl"
          fontWeight="medium"
          color="white"
          letterSpacing="wide"
        >
          SOLAR CAR 2 - SUNBURST
        </Text>
      </VStack>
      
      {/* Status Icons at top center */}
      <Box
        position="absolute"
        top={4}
        left="50%"
        transform="translateX(-50%)"
        p={4}
        bgColor={bgCol}
        borderRadius="lg"
        borderWidth={2}
        borderColor={borderCol}
        boxShadow="xl"
      >
        <FaultsView data={data} />
      </Box>
      
      {/* Stats box in top right corner */}
      <Box
        position="absolute"
        top={4}
        right={4}
        p={6}
        bgColor={bgCol}
        borderRadius="lg"
        borderWidth={2}
        borderColor={borderCol}
        boxShadow="xl"
        minW="250px"
      >
        <VStack spacing={4} align="stretch">
          <Stat>
            <HStack spacing={2} mb={1}>
              <Icon as={IoSpeedometer} boxSize={5} color="#C9302C" />
              <StatLabel fontWeight="semibold">Total Miles</StatLabel>
            </HStack>
            <StatNumber fontSize="3xl" color="#C9302C">15,248</StatNumber>
          </Stat>
          <Box h="1px" bgColor={borderCol} />
          <Stat>
            <HStack spacing={2} mb={1}>
              <Icon as={FaLeaf} boxSize={5} color="green.500" />
              <StatLabel fontWeight="semibold">CO₂ Saved</StatLabel>
            </HStack>
            <StatNumber fontSize="3xl" color="green.500">2,847 lbs</StatNumber>
          </Stat>
        </VStack>
      </Box>
    </Box>
  );
}
