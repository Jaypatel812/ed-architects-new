const InputLabelFormatWrapper = ({
  children,
  label,
  error,
  required,
  labelStyle,
  orientation = "vertical",
}) => {
  return (
    <div
      className={`flex items-baseline w-full justify-stretch  ${
        orientation === "vertical" ? "flex-col" : "gap-3"
      }`}
    >
      <label
        className={`block text-base font-medium text-gray-950 ${labelStyle} ${
          orientation === "vertical" ? "w-full" : "w-1/3"
        }`}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`flex-col ${
          orientation === "vertical" ? "flex-col w-full" : "w-2/3"
        }`}
      >
        {children}
        {error && <span className="text-red-600 text-sm mt-2">{error}</span>}
      </div>
    </div>
  );
};
export default InputLabelFormatWrapper;
