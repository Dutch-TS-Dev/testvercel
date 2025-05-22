import { useState, useEffect, useRef } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((count) => {
        return ++count;
      });
    }, 1000);

    intervalIdRef.current = intervalId;
  }, []);

  const handleStop = () => {
    clearInterval(intervalIdRef.current);
  };

  return (
    <>
      <h2>Current count: {count}</h2>
      <button
        className="btn btn-danger"
        onClick={() => {
          clearInterval(intervalIdRef.current);
        }}
      >
        Stop Counter
      </button>
    </>
  );
};

export default Counter;
