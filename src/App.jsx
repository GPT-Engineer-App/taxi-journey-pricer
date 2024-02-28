import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import Index from "./pages/Index";
import Sidebar from "./components/Sidebar";
import ChartsDashboard from "./pages/ChartsDashboard";
import Shift from "./pages/Shift";

function App() {
  return (
    <Router>
      <Flex>
        <Sidebar />
        <Box flex="1">
          <Routes>
            <Route exact path="/" element={<Index />} />
            <Route path="/charts" element={<ChartsDashboard />} />
            <Route path="/shift" element={<Shift />} />
          </Routes>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;
