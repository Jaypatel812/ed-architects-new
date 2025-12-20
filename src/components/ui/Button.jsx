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
    primary: "bg-green-500 hover:bg-green-500 text-white border-green-500",
    secondary: "bg-punc-bg text-primary-100 border-transparent font-bold",
    tertiary: "bg-white text-primary-100 border",
    custom: "",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-md",
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
