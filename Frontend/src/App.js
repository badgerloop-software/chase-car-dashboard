import React, { useState } from "react";
import Dashboard from "./Components/Dashboard/Dashboard";
import { ChakraProvider } from "@chakra-ui/react"
function App() {
    return (
        <ChakraProvider>
          <Dashboard/>
        </ChakraProvider>
    );
}

export default App;
