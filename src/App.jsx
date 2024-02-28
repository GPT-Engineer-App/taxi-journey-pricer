import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { Box, Flex } from "@chakra-ui/react";
import Index from "./pages/Index";
import Sidebar from "./components/Sidebar";
import ChartsDashboard from "./pages/ChartsDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Flex>
        <Sidebar />
        <Box flex="1">
          <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route exact path="/" element={isAuthenticated ? <Index /> : <Navigate to="/login" />} />
            <Route path="/charts" element={isAuthenticated ? <ChartsDashboard /> : <Navigate to="/login" />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;
