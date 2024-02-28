import React, { useState, useEffect } from "react";
import { Box, Button, VStack, Text } from "@chakra-ui/react";

const Shift = () => {
  const [shiftTime, setShiftTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  useEffect(() => {
    let interval = null;

    if (timerOn && !timerPaused) {
      interval = setInterval(() => {
        setShiftTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerOn, timerPaused]);

  const startShift = () => {
    setTimerOn(true);
    setTimerPaused(false);
  };

  const pauseShift = () => {
    setTimerPaused(!timerPaused);
  };

  const stopShift = () => {
    setTimerOn(false);
    setShiftTime(0);
  };

  return (
    <Box p={5}>
      <VStack spacing={4}>
        <Text fontSize="2xl">Shift Timer</Text>
        <Text fontSize="xl">{new Date(shiftTime * 1000).toISOString().substr(11, 8)}</Text>
        <Button colorScheme="green" onClick={startShift} isDisabled={timerOn && !timerPaused}>
          Start
        </Button>
        <Button colorScheme="orange" onClick={pauseShift} isDisabled={!timerOn}>
          Pause
        </Button>
        <Button colorScheme="red" onClick={stopShift}>
          Stop
        </Button>
      </VStack>
    </Box>
  );
};

export default Shift;
