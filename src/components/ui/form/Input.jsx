import React, { useEffect, useRef, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const InputField = ({
  icon: Icon,
  error,
  type = "text",
  className = "",
  inputStyle,
  inputContainerStyle = "",
  rightIcon,
  onChange,
  ref,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const inputType = (type) => {
    switch (type) {
      case "password":
        return showPassword ? "text" : "password";
      case "date":
        return isFocused ? "date" : "text";
      case "time":
        return isFocused ? "time" : "text";
      default:
        return type;
    }
  };

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

  // Add specific handler for date/time change events
  const handleChange = (e) => {
    onChange(e);

    // If date or time type and a value was selected, blur the input
    if ((type === "date" || type === "time") && e.target.value) {
      inputRef.current.blur();
    }
  };

  return (
    <div
      className={"" + (className ? className : "")}
      onClick={() => {
        inputRef.current.focus();
        // open the date picker when the user clicks on the input field
        if (type === "date") {
          inputRef.current.showPicker();
        } else if (type === "time") {
          inputRef.current.showPicker();
        }
      }}
    >
      <div className="relative">
        <div
          className={`
                            flex items-center border border-slate-300 rounded-md bg-white ${
                              Icon ? "pl-2" : ""
                            }
                            ${
                              error
                                ? "border-red-500"
                                : isFocused
                                ? "border-blue-500!"
                                : ""
                            }
                            ${
                              props.disabled
                                ? " border-slate-300 bg-gray-100"
                                : ""
                            }
                            ${inputContainerStyle}
                        `}
        >
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type={inputType(type)}
            className={`
                                w-full py-2 rounded-md focus:outline-none 
                                disabled:bg-gray-100 pl-2
                                ${type === "password" ? "pr-1" : ""}
                                ${inputStyle ? inputStyle : ""}
                            `}
            onChange={handleChange}
            {...props}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <LuEyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <LuEye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm pl-2 mt-0.5">{error}</p>}
    </div>
  );
};

InputField.displayName = "InputField";

export default InputField;
