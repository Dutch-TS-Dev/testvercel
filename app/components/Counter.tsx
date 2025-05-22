import React, { useEffect, useRef, useState, useCallback } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  // Use a ref to store the interval ID to avoid unnecessary rerenders
  const intervalRef = useRef(null);

  // Use useCallback for better performance and readability
  const handleStopCounter = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  // dependency array blijft leeg (anders eeuwig re-render)

  useEffect(() => {
    // Use callback form of setCount to avoid stale closure on count
    const intervalId = setInterval(() => {
      setCount((currentCount) => currentCount + 1);
    }, 1000);

    intervalRef.current = intervalId;

    // Cleanup interval on unmount to avoid memory leaks
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array to ensure effect runs only once

  // Return multiple elements using a fragment
  return (
    <>
      <h2 className="text-white">Current count: {count}</h2>
      <button
        className="btn btn-danger" // Corrected from "class" to "className"
        onClick={handleStopCounter} // Function passed correctly
      >
        Stop counter
      </button>
    </>
  );
};

export default Counter;
