"use client";

import React, { useEffect, useState } from "react";

const Counter = ({ count, title, duration = 1000 }) => {
  const [currentCount, setCurrentCount] = useState(0);

  // Parse prefix, number, and suffix from the count prop
  const countString = String(count || "0");
  const match = countString.match(/^([^0-9]*)([0-9,.]+)([^0-9]*)$/);
  const prefix = match ? match[1] : "";
  const numberValue = match ? parseFloat(match[2].replace(/,/g, "")) : 0;
  const suffix = match ? match[3] : "";

  useEffect(() => {
    let start = 0;
    const end = numberValue;

    if (end === 0) {
      setCurrentCount(0);
      return;
    }

    const incrementTime = 10; // ms
    const steps = duration / incrementTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCurrentCount(end);
        clearInterval(timer);
      } else {
        setCurrentCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [numberValue, duration]);

  // Format number with commas
  const formatted = new Intl.NumberFormat("en-US").format(
    Math.floor(currentCount)
  );

  return (
    <div className="flex flex-col gap-1 items-center w-full">
      <div className="font-bold text-neutral-500 text-2xl">
        {prefix}
        {formatted}
        {suffix}
      </div>
      <div className="text-xl font-semibold text-neutral-500">{title}</div>
    </div>
  );
};

export default Counter;
