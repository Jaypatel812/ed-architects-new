import React from "react";

export default function Switch({
  checked = true,
  onChange = () => {},
  disabled = false,
  ...props
}) {
  return (
    <label className="relative inline-block h-6 w-[44px] cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:transparent] has-checked:bg-blue-700">
      <input
        type="checkbox"
        id="AcceptConditions"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <span className="absolute inset-y-0 start-0 mx-1 my-1 size-4 rounded-full bg-white ring-[5px] ring-inset ring-white transition-all peer-checked:start-5"></span>
    </label>
  );
}
