import Dashboard from "./Components/Dashboard/Dashboard";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./styles/theme";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh">
        <Dashboard />
      </Box>
    </ChakraProvider>
  );
}

export default App;
