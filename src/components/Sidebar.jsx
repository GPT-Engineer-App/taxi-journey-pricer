import React from "react";
import { Box, VStack, Button, IconButton, useDisclosure, useBreakpointValue } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { FaHome, FaInfo, FaCog, FaUserCircle, FaEnvelope, FaChartBar, FaCalendarAlt, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const displaySidebar = useBreakpointValue({ base: isOpen ? "block" : "none", md: "block" });

  return (
    <Box w={{ base: "full", md: "200px" }} h="100vh" p={5} bg="brand.900" color="white" position={{ base: "fixed", md: "static" }} zIndex="overlay" display={displaySidebar} left={isOpen ? "0" : "-100%"}>
      <IconButton aria-label="Open Menu" size="lg" mr={2} icon={<FaBars />} onClick={onToggle} display={{ base: "inherit", md: "none" }} position="absolute" top="1rem" left="1rem" />
      <VStack align="stretch" spacing={5}>
        <Button leftIcon={<FaHome />} colorScheme="teal" as={NavLink} to="/">
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
