import React, { useState, useMemo } from "react";
import { Box, Button, Container, FormControl, FormLabel, Input, NumberInput, NumberInputField, Text, VStack, useToast, Grid, Select, useBreakpointValue } from "@chakra-ui/react";
import { FaTaxi } from "react-icons/fa";
import FareChart from "../components/FareChart.jsx";

const calculateAdditionalMileCost = (tariffRates) => {
  const costPerAdditionalMile = Object.entries(tariffRates).reduce((acc, [key, tariff]) => {
    const additionalMileCost = (tariff.distanceCost / (tariff.distanceYards / 1760)).toFixed(2);
    acc[key] = additionalMileCost;
    return acc;
  }, {});
  return costPerAdditionalMile;
};

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
    breakdownDetails += `Yard Breakdown: £${initialDistanceCost.toFixed(2)} + ${additionalYards} x £${tariff.distanceCost.toFixed(2)} (per additional ${tariff.distanceYards} yards)\n`;
    const totalCost = tariff.startFee + additionalCost;
    breakdownDetails += `Total Cost: £${totalCost.toFixed(2)}\n`;
    // Passing the start fee to the calculatePriceSpread function
    setPriceSpread(calculatePriceSpread(totalCost, tariff.startFee));
    const calculatedCostPerMile = (miles > 1 ? (totalCost - tariff.startFee) / (miles - 1) : totalCost / miles).toFixed(2);

    setCost(totalCost.toFixed(2));
    setCostPerMile(calculatedCostPerMile);
    setBreakdown(breakdownDetails);
  };

  return (
    <Container maxW="container.xl" p={10}>
      <Grid templateColumns={useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" })} gap={6}>
        <FareChart tariffRates={tariffRates} />
        <Box borderWidth="1px" borderRadius="lg" p={8} w="100%" bg="gray.50">
          <VStack spacing={4}>
            {/* Header section removed to revert the site to its previous state */}
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

            <Button colorScheme="teal" size="lg" onClick={calculateCost}>
              Calculate Fare
            </Button>
            {/* Incremental Pricing Scale section has been removed as per the update request */}
            <VStack spacing={6} pt={6} align="stretch">
              <Text fontSize="lg">Total Cost: £{selectedTariff && cost ? cost : "0.00"}</Text>
              <Text fontSize="lg">Cost per Mile: £{costPerMile || "0.00"}</Text>
              <Box p={6} borderWidth="1px" borderRadius="lg" bg="gray.50">
                <Text fontSize="lg" fontWeight="semibold">
                  Cost Breakdown:
                </Text>
                <Text fontSize="md" whiteSpace="pre-wrap">
                  {breakdown || "No calculation yet."}
                </Text>
              </Box>
              <Box p={6} borderWidth="1px" borderRadius="lg" bg="gray.50">
                <Text fontSize="lg" fontWeight="semibold">
                  Cost per Additional Mile After the First Mile:
                </Text>
                <VStack spacing={2}>
                  {useMemo(
                    () =>
                      Object.entries(calculateAdditionalMileCost(tariffRates)).map(([key, cost]) => (
                        <Text fontSize="md" key={key}>
                          Tariff {key.slice(-1)}: £{cost}
                        </Text>
                      )),
                    [tariffRates],
                  )}
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </Box>
      </Grid>
    </Container>
  );
};

export default Index;
