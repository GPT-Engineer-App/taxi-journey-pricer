import React, { useState } from "react";
import { Box, Container, FormControl, FormLabel, Input, Button, VStack, useToast } from "@chakra-ui/react";

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    if (username === "admin" && password === "admin") {
      onLoginSuccess();
    } else {
      toast({
        title: "Login Error",
        description: "Incorrect username or password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent>
      <Box borderWidth="1px" borderRadius="lg" p={8} m={4} w="100%" maxWidth="sm">
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button colorScheme="teal" onClick={handleSubmit}>
            Login
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default LoginPage;
