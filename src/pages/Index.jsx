import React, { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, NumberInput, NumberInputField, Text, VStack, useToast } from "@chakra-ui/react";
import { FaTaxi } from "react-icons/fa";

const tariffRates = {
  tariff1: { startTime: 6, endTime: 20, startFee: 2.6, distanceYards: 168, distanceCost: 0.2 },
  tariff2: { startTime: 21, endTime: 24, startFee: 2.6, distanceYards: 130, distanceCost: 0.2 },
  tariff3: { startTime: 0, endTime: 6, startFee: 3.2, distanceYards: 130, distanceCost: 0.2 },
};

const Index = () => {
  const [dateTime, setDateTime] = useState("");
  const [miles, setMiles] = useState(0);
  const [cost, setCost] = useState(null);
  const [costPerMile, setCostPerMile] = useState(null);
  const toast = useToast();

  const calculateCost = () => {
    if (!dateTime || miles <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid date/time and miles",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const date = new Date(dateTime);
    const day = date.getDay();
    const hour = date.getHours();
    const yards = miles * 1760; // There are 1760 yards in a mile

    let tariff;
    if (hour >= tariffRates.tariff1.startTime && hour < tariffRates.tariff1.endTime && day >= 1 && day <= 5) {
      tariff = tariffRates.tariff1;
    } else if ((hour >= tariffRates.tariff2.startTime || day === 0 || day === 6) && hour < tariffRates.tariff2.endTime) {
      tariff = tariffRates.tariff2;
    } else {
      tariff = tariffRates.tariff3;
    }

    const remainingYards = yards - tariff.distanceYards;
    const additionalCost = Math.ceil(remainingYards / tariff.distanceYards) * tariff.distanceCost;
    const totalCost = tariff.startFee + additionalCost;
    const calculatedCostPerMile = totalCost / miles;

    setCost(totalCost.toFixed(2));
    setCostPerMile(calculatedCostPerMile.toFixed(2));
  };

  return (
    <Container centerContent>
      <Box p={6} borderWidth="1px" borderRadius="lg" w="100%" mt={4}>
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Taxi Fare Calculator <FaTaxi />
          </Text>
          <FormControl id="date-time">
            <FormLabel>Date and Time</FormLabel>
            <Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
          </FormControl>
          <FormControl id="miles">
            <FormLabel>Distance (miles)</FormLabel>
            <NumberInput min={0} onChange={(valueString) => setMiles(parseFloat(valueString))}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <Button colorScheme="blue" onClick={calculateCost}>
            Calculate Fare
          </Button>
          {cost !== null && (
            <Box pt={4}>
              <Text>Total Cost: £{cost}</Text>
              <Text>Cost per Mile: £{costPerMile}</Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Container>
  );
};

export default Index;
