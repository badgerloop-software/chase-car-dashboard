import { Box, VStack, Icon, Text, useColorMode, Tooltip } from "@chakra-ui/react";
import { IoHome, IoSpeedometer, IoSettings } from "react-icons/io5";
import getColor from "../Shared/colors";

/**
 * Sidebar navigation component
 * @param {object} props - Component props
 * @param {string} props.currentPage - The currently active page
 * @param {function} props.onPageChange - Callback function when page changes
 * @returns Sidebar component
 */
export default function Sidebar({ currentPage = "home", onPageChange }) {
  const { colorMode } = useColorMode();
  const borderCol = getColor("border", colorMode);
  const bgCol = colorMode === "light" ? "gray.100" : "gray.800";
  const hoverBg = colorMode === "light" ? "gray.200" : "gray.700";
  const activeBg = colorMode === "light" ? "#FFEAE9" : "#3D1514";
  const textCol = colorMode === "light" ? "gray.700" : "gray.200";
  const activeTextCol = "#C9302C";

  const navItems = [
    { id: "home", label: "Home", icon: IoHome },
    { id: "dashboard", label: "Dashboard", icon: IoSpeedometer },
    { id: "settings", label: "Settings", icon: IoSettings },
  ];

  const handleNavClick = (pageId) => {
    if (onPageChange) {
      onPageChange(pageId);
    }
  };

  return (
    <Box
      w="60px"
      h="100vh"
      bgColor={bgCol}
      borderRightWidth={1}
      borderRightColor={borderCol}
      display="flex"
      flexDirection="column"
      py={2}
    >
      <VStack spacing={2} align="stretch">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <Tooltip key={item.id} label={item.label} placement="right" hasArrow>
              <Box
                as="button"
                w="100%"
                py={3}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                cursor="pointer"
                bgColor={isActive ? activeBg : "transparent"}
                color={isActive ? activeTextCol : textCol}
                _hover={{ bgColor: isActive ? activeBg : hoverBg }}
                transition="all 0.2s"
                onClick={() => handleNavClick(item.id)}
              >
                <Icon as={item.icon} boxSize={6} />
                <Text fontSize="10px" mt={1} fontWeight={isActive ? "bold" : "normal"}>
                  {item.label}
                </Text>
              </Box>
            </Tooltip>
          );
        })}
      </VStack>
    </Box>
  );
}
