import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, VStack, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const ShiftChart = ({ shifts }) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return (
    <Table variant="striped" colorScheme="teal">
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
  const [currentShift, setCurrentShift] = useState({ startTime: "", endTime: "", duration: "" });
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

  const stopShift = () => {
    const endTime = new Date();
    setCurrentShift((prevShift) => ({
      startTime: prevShift.startTime,
      endTime: endTime.toLocaleTimeString(),
      duration: new Date(endTime - new Date(prevShift.startTime)).toISOString().substr(11, 8),
    }));
    const dayIndex = endTime.getDay();
    setShifts((prevShifts) => prevShifts.map((shift, i) => (i === dayIndex ? {
      ...shift,
      endTime: endTime.toLocaleTimeString(),
      duration: new Date(endTime - new Date(currentShift.startTime)).toISOString().substr(11, 8)
    } : shift)));
    setTimerOn(false);
  };

  const shiftChart = useMemo(() => <ShiftChart shifts={shifts} />, [shifts]);

  return (
    <VStack spacing={8} p={8}>
      <Box>
        <VStack spacing={4}>
          <Text fontSize="2xl">Shift Timer</Text>
          <Text fontSize="xl">{currentShift.duration || "00:00:00"}</Text>
          <Button colorScheme="green" onClick={startShift} isDisabled={timerOn}>
            Start
          </Button>
          <Button colorScheme="orange" onClick={pauseShift} isDisabled={!timerOn}>
            Pause
          </Button>
          <Button colorScheme="red" onClick={stopShift} isDisabled={!currentShift.startTime}>
            Stop
          </Button>
        </VStack>
      </Box>
      <Box w="100%">{shiftChart}</Box>
    </VStack>
  );
};

export default Shift;
