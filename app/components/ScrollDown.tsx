// Option 1: Minimalist Arrow Button
import React from "react";

const ScrollToBottomArrow = ({ containerRef }: any) => {
  const handleScrollToBottom = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  return (
    <button
      onClick={handleScrollToBottom}
      className="fixed bottom-8 right-8  bg-transparent border text-white rounded-full p-3 shadow-lg transition-all duration-300 focus:outline-none"
      aria-label="Scroll to bottom"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
};

// Option 2: Text + Icon Button
const ScrollToBottomButton = ({ containerRef, text = "Scroll to Bottom" }) => {
  const scrollToBottom = () => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  return (
    <button
      onClick={scrollToBottom}
      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
    >
      <span>{text}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <polyline points="19 12 12 19 5 12"></polyline>
      </svg>
    </button>
  );
};

// Option 3: Floating Animated Button
const AnimatedScrollButton = ({ containerRef }) => {
  const scrollToBottom = () => {
    if (containerRef?.current) {
      // Adding smooth scroll behavior
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={scrollToBottom}
      className="group fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none focus:outline-none"
      aria-label="Scroll to bottom"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="group-hover:translate-y-1 transition-transform duration-300"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </button>
  );
};

// Usage Example:
const ScrollableContainer = () => {
  const containerRef = React.useRef(null);

  return (
    <div className="h-screen flex flex-col">
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4">
        {/* Your scrollable content here */}
        <div className="h-[2000px] bg-gray-100">Scrollable content</div>
      </div>

      {/* Choose one of the button components */}
      <ScrollToBottomArrow containerRef={containerRef} />
      {/* or */}
      {/* <ScrollToBottomButton containerRef={containerRef} /> */}
      {/* or */}
      {/* <AnimatedScrollButton containerRef={containerRef} /> */}
    </div>
  );
};

export { ScrollToBottomArrow, ScrollToBottomButton, AnimatedScrollButton };
