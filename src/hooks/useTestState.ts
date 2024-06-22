import React, { useEffect, useState } from "react";

const useTestState = <T>(
  origin?: T,
  testData?: typeof origin
): [typeof origin, React.Dispatch<React.SetStateAction<typeof origin>>] => {
  const [testStates, setTestStates] = useState(origin);

  useEffect(() => {
    if (!testData || process.env.NODE_ENV !== "development") return;
    setTestStates(testData);
  }, [testData]);

  return [testStates, setTestStates];
};

export { useTestState };
