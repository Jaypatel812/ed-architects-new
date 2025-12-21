const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className,
}) => {
  const classes = {
    primary: "bg-blue-700 hover:bg-blue-600 text-white border-transparent",
    secondary: "bg-blue-100 text-blue-700 border-transparent",
    tertiary: "bg-gray-200 text-primary-100 border-transparent",
    custom: "",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes[variant]} ${
        sizes[size]
      } rounded cursor-pointer border font-medium transition duration-300 justify-center inline-flex items-center gap-2 ease-in-out w-fit ${
        className ? className : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
