import Dashboard from "./Components/Dashboard/Dashboard";
import { Box, ChakraProvider } from "@chakra-ui/react";
function App() {
  return (
    <ChakraProvider>
      <Box minH="100vh">
        <Dashboard />
      </Box>
    </ChakraProvider>
  );
}

export default App;
