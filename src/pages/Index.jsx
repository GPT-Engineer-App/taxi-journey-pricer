import React, { useState } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, NumberInput, NumberInputField, Text, VStack, useToast, Grid, Select } from "@chakra-ui/react";
import { FaTaxi } from "react-icons/fa";
import FareChart from "../components/FareChart.jsx";

const tariffRates = {
  tariff1: { startTime: 6, endTime: 20, startFee: 2.6, distanceYards: 168, distanceCost: 0.2 },
  // Tariff 2: Monday to Friday 9.00pm to 12.00am, Saturdays, Sundays
  tariff2: { startTime: 21, endTime: 24, startFee: 2.6, distanceYards: 130, distanceCost: 0.2 },
  tariff3: { startTime: 0, endTime: 6, startFee: 3.2, distanceYards: 130, distanceCost: 0.2 },
};

const Index = () => {
  const [dateTime, setDateTime] = useState("");
  const [miles, setMiles] = useState(0);
  const [cost, setCost] = useState(null);
  const [costPerMile, setCostPerMile] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const toast = useToast();

  const [selectedTariff, setSelectedTariff] = useState("");
  const [priceSpread, setPriceSpread] = useState({});
  let tariff = selectedTariff ? tariffRates[selectedTariff] : null;
  const calculatePriceSpread = (totalCost, startFee, distanceYards, distanceCost) => {
    const yardsPerMile = 1760;
    const remainingYardsFirstMile = yardsPerMile - distanceYards;
    const additionalSegmentsFirstMile = Math.ceil(remainingYardsFirstMile / distanceYards);
    const costFirstMile = startFee + additionalSegmentsFirstMile * distanceCost;
    const oneMileCost = costFirstMile.toFixed(2);
    return {
      upToOneMile: oneMileCost,
    };
  };
  const calculateCost = () => {
    if (!dateTime || miles <= 0) {
      // ... existing code ...
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

    // Removed the time-based tariff selection logic and replaced it with selection based on the `selectedTariff` state.

    const remainingYards = yards - tariff.distanceYards;
    const initialDistanceCost = tariff.startFee;
    const additionalYards = Math.ceil(remainingYards / tariff.distanceYards);
    const additionalCost = additionalYards * tariff.distanceCost;
    let breakdownDetails = `Start Fee: £${tariff.startFee.toFixed(2)} (for the first ${tariff.distanceYards} yards)\n`;
    breakdownDetails += `Yard Breakdown: £${initialDistanceCost.toFixed(2)} + ${additionalYards} x £${tariff.distanceCost.toFixed(2)} (per additional ${tariff.distanceYards} yards) = £${additionalCost.toFixed(2)}\n`;
    const totalCost = tariff.startFee + additionalCost;
    // Passing the start fee to the calculatePriceSpread function
    setPriceSpread(calculatePriceSpread(totalCost, tariff.startFee));
    const calculatedCostPerMile = (miles > 1 ? (totalCost - tariff.startFee) / (miles - 1) : totalCost / miles).toFixed(2);

    setCost(totalCost.toFixed(2));
    setCostPerMile(calculatedCostPerMile);
    setBreakdown(breakdownDetails);
  };

  return (
    <Container maxW="container.xl" p={6}>
      <Grid templateColumns="1fr 2fr" gap={6}>
        <FareChart tariffRates={tariffRates} />
        <Box borderWidth="1px" borderRadius="lg" p={6} w="100%">
          <VStack spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Taxi Fare Calculator <FaTaxi />
            </Text>
            <FormControl id="date-time" w="100%">
              <FormLabel>Date and Time</FormLabel>
              <Input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
            </FormControl>
            <FormControl id="miles" w="100%">
              <FormLabel>Distance (miles)</FormLabel>
              <NumberInput min={0} onChange={(valueString) => setMiles(parseFloat(valueString))}>
                <NumberInputField />
              </NumberInput>
              <FormLabel mt={4}>Select Tariff</FormLabel>
              <Select placeholder="Select tariff" onChange={(e) => setSelectedTariff(e.target.value)}>
                {Object.keys(tariffRates).map((tariffKey) => (
                  <option value={tariffKey} key={tariffKey}>
                    Tariff {tariffKey.slice(-1)}
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button colorScheme="blue" onClick={calculateCost}>
              Calculate Fare
            </Button>
            {/* Incremental Pricing Scale section has been removed as per the update request */}
            <VStack spacing={4} pt={4}>
              <Text>Total Cost: £{selectedTariff && cost ? cost : "0.00"}</Text>
              <Text>Cost per Mile: £{costPerMile || "0.00"}</Text>
              <Box p={4} borderWidth="1px" borderRadius="lg">
                <Text>Cost Breakdown:</Text>
                <Text whiteSpace="pre-wrap">{breakdown || "No calculation yet."}</Text>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Grid>
    </Container>
  );
};

export default Index;
