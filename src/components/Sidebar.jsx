import React from "react";
import { Box, VStack, Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaHome, FaInfo, FaCog, FaUserCircle, FaEnvelope, FaChartBar, FaCalendarAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <Box w="200px" h="100vh" p={5} bg="brand.900" color="white">
      <VStack align="stretch" spacing={5}>
        <Button leftIcon={<FaHome />} colorScheme="teal" as={NavLink} to="/home">
          Home
        </Button>
        <Button leftIcon={<FaInfo />} colorScheme="teal">
          About
        </Button>
        <Button leftIcon={<FaCog />} colorScheme="teal">
          Settings
        </Button>
        <Button leftIcon={<FaUserCircle />} colorScheme="teal">
          Profile
        </Button>
        <Button leftIcon={<FaEnvelope />} colorScheme="teal">
          Contact
        </Button>
        <Button leftIcon={<FaChartBar />} colorScheme="teal" as={NavLink} to="/charts">
          Charts
        </Button>
        <Button leftIcon={<FaCalendarAlt />} colorScheme="teal" as={NavLink} to="/shift">
          Shift
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
