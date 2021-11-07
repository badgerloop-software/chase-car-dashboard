import React, { useState } from "react";
import ClientComponent from "./Components/ClientComponent";
import Dashboard from "./Components/Dashboard/Dashboard";

function App() {
    const [loadClient, setLoadClient] = useState(true);
    return (
        <>
          <Dashboard/>
        </>
    );
}

export default App;
