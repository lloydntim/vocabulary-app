import { useState, useEffect } from 'react';

/* eslint-disable  no-undef */
const useJoyride = (joyrideData) => {
  const [joyride, setJoyride] = useState(joyrideData);
  const { run, stepIndex, steps, callback, styles, locale } = joyride;
  useEffect(() => {}, []);
  return {
    run,
    steps,
    styles,
    locale,
    callback,
    stepIndex,
    updateJoyride: (props) => setJoyride({ ...joyride, ...props }),
  };
};

export default useJoyride;
