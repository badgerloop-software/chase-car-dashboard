import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  IconButton,
  Switch,
  Button,
  Select,
  Divider,
  useColorMode,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdPerson, MdCamera, MdNotifications, MdSecurity, MdInfo, MdChevronRight } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import { FaLeaf } from "react-icons/fa";
import getColor from "../Shared/colors";

export default function Settings() {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const borderCol = getColor("border", colorMode);
  const bgCol = colorMode === "light" ? "white" : "gray.800";
  const cardBg = colorMode === "light" ? "gray.50" : "gray.700";

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [dataMode, setDataMode] = useState("normal");
  const [render3D, setRender3D] = useState(true);

  const handleAccountSettings = () => {
    toast({
      title: "Account Settings",
      description: "Account settings would open here",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSecuritySettings = () => {
    toast({
      title: "Security & Privacy",
      description: "Security settings would open here",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAboutBSR = () => {
    window.open("https://badgersolarracing.org/", "_blank");
  };

  const handleProfileImageEdit = () => {
    toast({
      title: "Edit Profile Picture",
      description: "Profile picture editor would open here",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      h="100vh"
      w="100%"
      overflowY="auto"
      p={6}
      bgColor={colorMode === "light" ? "gray.100" : "gray.900"}
    >
      <VStack spacing={6} align="stretch" maxW="800px" mx="auto">
        {/* Header */}
        <Text fontSize="3xl" fontWeight="bold">
          Settings
        </Text>

        {/* Profile Section */}
        <Box
          p={6}
          bgColor={bgCol}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderCol}
        >
          <VStack spacing={4}>
            <Box position="relative">
              <Avatar
                size="2xl"
                icon={<Icon as={MdPerson} boxSize={16} />}
                bg="#C9302C"
                color="white"
              />
              <IconButton
                icon={<MdCamera />}
                size="sm"
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                bottom={0}
                right={0}
                onClick={handleProfileImageEdit}
                aria-label="Edit profile picture"
              />
            </Box>
            <VStack spacing={1}>
              <Text fontSize="2xl" fontWeight="bold">
                Bucky Badger
              </Text>
              <Text color="gray.500">bucky.badger@email.com</Text>
              <Text fontSize="sm" color="gray.500">
                Solar Car Owner since 2023
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Stats Section */}
        <Box
          p={6}
          bgColor={bgCol}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderCol}
        >
          <StatGroup>
            <Stat>
              <HStack>
                <Icon as={IoSpeedometer} boxSize={5} color="#C9302C" />
                <StatLabel>Total Miles</StatLabel>
              </HStack>
              <StatNumber>15,248</StatNumber>
            </Stat>
            <Stat>
              <HStack>
                <Icon as={FaLeaf} boxSize={5} color="green.500" />
                <StatLabel>CO₂ Saved</StatLabel>
              </HStack>
              <StatNumber>2,847 lbs</StatNumber>
            </Stat>
          </StatGroup>
        </Box>

        {/* Settings Toggles */}
        <Box
          p={6}
          bgColor={bgCol}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderCol}
        >
          <VStack spacing={4} align="stretch">
            <Text fontSize="xl" fontWeight="semibold" mb={2}>
              Preferences
            </Text>

            {/* Notifications */}
            <HStack justify="space-between">
              <HStack>
                <Icon as={MdNotifications} boxSize={5} color="gray.500" />
                <Text>Notifications</Text>
              </HStack>
              <Switch
                colorScheme="red"
                isChecked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </HStack>

            <Divider />

            {/* Data Mode */}
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text>Data Mode</Text>
                <Text fontSize="sm" color="gray.500">
                  Control data usage/refresh rates
                </Text>
              </VStack>
              <Select
                value={dataMode}
                onChange={(e) => setDataMode(e.target.value)}
                width="120px"
                size="sm"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </Select>
            </HStack>

            <Divider />

            {/* Render 3D */}
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text>Render 3D</Text>
                <Text fontSize="sm" color="gray.500">
                  Toggle 3D model rendering
                </Text>
              </VStack>
              <Switch
                colorScheme="red"
                isChecked={render3D}
                onChange={(e) => setRender3D(e.target.checked)}
              />
            </HStack>

            <Divider />

            {/* Theme Mode */}
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text>Theme Mode</Text>
                <Text fontSize="sm" color="gray.500">
                  {colorMode === "light" ? "Light" : "Dark"} mode
                </Text>
              </VStack>
              <Switch
                colorScheme="red"
                isChecked={colorMode === "dark"}
                onChange={toggleColorMode}
              />
            </HStack>
          </VStack>
        </Box>

        {/* Menu Items */}
        <Box
          bgColor={bgCol}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderCol}
          overflow="hidden"
        >
          <VStack spacing={0} align="stretch">
            <Button
              justifyContent="space-between"
              variant="ghost"
              borderRadius={0}
              p={6}
              h="auto"
              onClick={handleAccountSettings}
              rightIcon={<MdChevronRight />}
            >
              <HStack>
                <Icon as={MdPerson} boxSize={5} color="gray.500" />
                <Text>Account Settings</Text>
              </HStack>
            </Button>

            <Divider />

            <Button
              justifyContent="space-between"
              variant="ghost"
              borderRadius={0}
              p={6}
              h="auto"
              onClick={handleSecuritySettings}
              rightIcon={<MdChevronRight />}
            >
              <HStack>
                <Icon as={MdSecurity} boxSize={5} color="gray.500" />
                <Text>Security & Privacy</Text>
              </HStack>
            </Button>

            <Divider />

            <Button
              justifyContent="space-between"
              variant="ghost"
              borderRadius={0}
              p={6}
              h="auto"
              onClick={handleAboutBSR}
              rightIcon={<MdChevronRight />}
            >
              <HStack>
                <Icon as={MdInfo} boxSize={5} color="gray.500" />
                <Text>About Badger Solar Racing</Text>
              </HStack>
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
