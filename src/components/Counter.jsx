"use client";

import React, { useEffect, useState } from "react";

const Counter = ({ count, title, duration = 1000 }) => {
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = count;
    const incrementTime = 10; // ms
    const steps = duration / incrementTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCurrentCount(end);
        clearInterval(timer);
      } else {
        setCurrentCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [count, duration]);

  // Format number with commas
  const formatted = new Intl.NumberFormat("en-US").format(currentCount);

  return (
    <div className="flex flex-col gap-1 items-center w-full">
      <div className="font-bold text-neutral-500 text-2xl">{formatted}</div>
      <div className="text-xl font-semibold text-neutral-500">{title}</div>
    </div>
  );
};

export default Counter;
