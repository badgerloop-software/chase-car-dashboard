import Dashboard from "./Components/Dashboard/Dashboard.js";
import { Box, ChakraProvider } from "@chakra-ui/react";
import theme from "./styles/theme.js";

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
