import React from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, VStack, Text } from "@chakra-ui/react";

const calculateFareForMile = (tariff, miles) => {
  const yards = miles * 1760; // There are 1760 yards in a mile
  const remainingYards = yards - tariff.distanceYards;
  const additionalYards = Math.ceil(remainingYards / tariff.distanceYards);
  return tariff.startFee + additionalYards * tariff.distanceCost;
};

const FareChart = ({ tariffRates }) => {
  const milesRange = Array.from({ length: 50 }, (_, i) => i + 1);

  return (
    <Box borderWidth="1px" borderRadius="lg" p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Fare Chart
      </Text>
      <Table variant="simple" size="sm" overflowX="auto">
        <Thead>
          <Tr>
            <Th>Miles</Th>
            {Object.keys(tariffRates).map((tariffKey) => {
              const tariff = tariffRates[tariffKey];
              const costPerMile = (tariff.distanceCost / (tariff.distanceYards / 1760)).toFixed(2);
              return (
                <Th key={tariffKey}>
                  <Text as="span" display="block">
                    Tariff {tariffKey.replace("tariff1New", "1 NEW").replace("tariff2New", "2 NEW").replace("tariff3New", "3 NEW")}
                  </Text>
                  <Text as="span" display="block">
                    (£{costPerMile}/mile)
                  </Text>
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {milesRange.map((miles) => (
            <Tr key={miles}>
              <Td>{miles}</Td>
              {Object.values(tariffRates).map((tariff, index) => (
                <Td key={index}>{calculateFareForMile(tariff, miles).toFixed(2)}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default FareChart;
