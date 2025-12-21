import React, { useEffect, useRef, useState } from "react";

const TextArea = ({
  error,
  className = "",
  inputStyle,
  inputContainerStyle = "",
  ref,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    const handleGlobalClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };

    const input = inputRef.current;
    input.addEventListener("focus", handleFocus);
    input.addEventListener("blur", handleBlur);
    document.addEventListener("mousedown", handleGlobalClick);

    return () => {
      input.removeEventListener("focus", handleFocus);
      input.removeEventListener("blur", handleBlur);
      document.removeEventListener("mousedown", handleGlobalClick);
    };
  }, []);

  return (
    <div
      className={"" + (className ? className : "")}
      onClick={() => {
        inputRef.current.focus();
      }}
    >
      <div className="relative">
        <div
          className={`
                            flex items-center border border-slate-300 rounded-md bg-white 
                            ${
                              error
                                ? "border-red-500"
                                : isFocused
                                ? "border-blue-500!"
                                : ""
                            }
                            ${
                              props.disabled
                                ? " border-slate-300 bg-gray-100!"
                                : ""
                            }
                            ${inputContainerStyle}
                        `}
        >
          <textarea
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            className={`
                                w-full py-2 rounded-md focus:outline-none 
                                disabled:bg-gray-100 ml-2 px-1
                                ${inputStyle ? inputStyle : ""}
                            `}
            {...props}
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm pl-2 mt-0.5">{error}</p>}
    </div>
  );
};

TextArea.displayName = "InputField";

export default TextArea;
