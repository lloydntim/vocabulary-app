import { useState, useEffect } from 'react';

const useStopwatch = () => {
  const [ticker, setTicker] = useState(0);
  const [time, setTime] = useState(0);
  const [isActivated, setIsActivated] = useState(true);
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((ticker) => ticker + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      setTicker(0);
    };
  }, []);

  useEffect(() => {
    setTime((time) => time + (isActivated ? 1 : 0));
  }, [ticker, isActivated]);

  return {
    time,
    start: () => setIsActivated(true),
    stop: () => setIsActivated(false),
    reset: () => setTime(0),
  };
};

export default useStopwatch;
