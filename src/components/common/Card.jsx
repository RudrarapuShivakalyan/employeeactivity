import clsx from "clsx";

const Card = ({ className, children, shadow = "md", border = false, ...props }) => {
  const shadowStyles = {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <div
      className={clsx(
        "bg-white rounded-xl overflow-hidden transition-all",
        shadowStyles[shadow],
        border && "border border-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
