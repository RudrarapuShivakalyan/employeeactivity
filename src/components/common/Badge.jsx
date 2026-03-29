import clsx from "clsx";

const Badge = ({ variant = "default", size = "md", children, className, ...props }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    purple: "bg-blue-100 text-blue-800",
  };

  const sizes = {
    sm: "text-xs px-2 py-1 rounded-md",
    md: "text-sm px-2.5 py-1.5 rounded-lg",
    lg: "text-base px-3 py-2 rounded-lg",
  };

  const statusVariants = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-700",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const variantClass = statusVariants[variant] || variants[variant];

  return (
    <span
      className={clsx(
        "font-medium inline-block whitespace-nowrap",
        sizes[size],
        variantClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
