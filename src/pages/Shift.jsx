import React, { useState, useEffect, useMemo, useRef } from "react";
import { Box, Button, VStack, Text, Table, Thead, Tbody, Tr, Th, Td, Input, HStack, NumberInput, NumberInputField } from "@chakra-ui/react";

const JobPriceInput = ({ onAddJobPrice }) => {
  const [jobPrice, setJobPrice] = useState("");
  const inputRef = useRef();

  const handleAddClick = () => {
    const price = parseFloat(jobPrice);
    if (!isNaN(price) && price > 0) {
      onAddJobPrice(price);
      setJobPrice("");
      inputRef.current.focus();
    }
  };

  return (
    <HStack>
      <NumberInput value={jobPrice} onChange={setJobPrice} min={0}>
        <NumberInputField ref={inputRef} placeholder="Enter job price" />
      </NumberInput>
      <Button onClick={handleAddClick}>Add Job</Button>
    </HStack>
  );
};

const ShiftChart = ({ shifts }) => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (
    <Table variant="striped" colorScheme="teal" size="sm" overflowX="auto">
      <Thead>
        <Tr>
          <Th>Day</Th>
          <Th>Start Time</Th>
          <Th>End Time</Th>
          <Th>Duration</Th>
        </Tr>
      </Thead>
      <Tbody>
        {daysOfWeek.map((day, index) => (
          <Tr key={day}>
            <Td>{day}</Td>
            <Td>{shifts[index]?.startTime || "---"}</Td>
            <Td>{shifts[index]?.endTime || "---"}</Td>
            <Td>{shifts[index]?.duration || "---"}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const Shift = () => {
  const [currentShift, setCurrentShift] = useState({ startTime: "", endTime: "", duration: "", totalEarnings: 0, jobs: [] });
  const [shifts, setShifts] = useState(Array(7).fill(null)); // Array for 7 days of the week
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    if (timerOn) {
      const interval = setInterval(() => {
        setCurrentShift((prevShift) => ({
          ...prevShift,
          endTime: new Date().toLocaleTimeString(),
          duration: new Date(new Date() - new Date(prevShift.startTime)).toISOString().substr(11, 8),
        }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerOn]);

  const startShift = () => {
    const startTime = new Date();
    setCurrentShift({
      startTime: startTime.toLocaleTimeString(),
      endTime: "",
      duration: "",
    });
    const dayIndex = startTime.getDay();
    setShifts((prevShifts) => prevShifts.map((shift, i) => (i === dayIndex ? { ...shift, startTime: startTime.toLocaleTimeString() } : shift)));
    setTimerOn(true);
  };

  const pauseShift = () => {
    const endTime = new Date();
    setCurrentShift((prevShift) => ({
      ...prevShift,
      endTime: endTime.toLocaleTimeString(),
      duration: new Date(endTime - new Date(prevShift.startTime)).toISOString().substr(11, 8),
    }));
    setTimerOn(false);
  };

  const addJobPrice = (price) => {
    setCurrentShift((prevShift) => {
      const newJobs = [...prevShift.jobs, price];
      const newTotalEarnings = newJobs.reduce((sum, jobPrice) => sum + jobPrice, 0);
      return { ...prevShift, jobs: newJobs, totalEarnings: newTotalEarnings };
    });
  };

  const calculateEarningsPerHour = (totalEarnings, duration) => {
    const durationInSeconds = duration.split(":").reduce((acc, time) => 60 * acc + +time, 0);
    const durationInHours = durationInSeconds / 3600;
    return durationInHours > 0 ? (totalEarnings / durationInHours).toFixed(2) : "0.00";
  };

  const stopShift = () => {
    const endTime = new Date();
    setCurrentShift((prevShift) => {
      const newDuration = new Date(endTime - new Date(prevShift.startTime)).toISOString().substr(11, 8);
      const earningsPerHour = calculateEarningsPerHour(prevShift.totalEarnings, newDuration);
      return {
        ...prevShift,
        endTime: endTime.toLocaleTimeString(),
        duration: newDuration,
        earningsPerHour: earningsPerHour,
      };
    });
    setTimerOn(false);
  };
  // This block is removed as it was a duplicate caused by incorrect merge in the previous edit

  const shiftChart = useMemo(() => <ShiftChart shifts={shifts} />, [shifts]);

  return (
    <VStack spacing={10} p={8}>
      <Box>
        <VStack spacing={4}>
          <Text fontSize="3xl" fontWeight="bold">
            Shift Timer
          </Text>
          <Text fontSize="xl">{currentShift.duration || "00:00:00"}</Text>
          <Button size="md" colorScheme="green" onClick={startShift} isDisabled={timerOn}>
            Start
          </Button>
          <Button size="md" colorScheme="yellow" onClick={pauseShift} isDisabled={!timerOn}>
            Pause
          </Button>
          <Button size="md" colorScheme="red" onClick={stopShift} isDisabled={!currentShift.startTime}>
            Stop
          </Button>
        </VStack>
      </Box>
      <Box w="100%" p={4} shadow="md">
        {shiftChart}
        <JobPriceInput onAddJobPrice={addJobPrice} />
        <Text fontSize="xl" fontWeight="bold">
          Total Earnings: £{currentShift.totalEarnings.toFixed(2)}
        </Text>
        <Text>Earnings Per Hour: £{currentShift.earningsPerHour || "0.00"}</Text>
      </Box>
    </VStack>
  );
};

export default Shift;
