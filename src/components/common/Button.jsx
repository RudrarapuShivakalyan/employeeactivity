import clsx from "clsx";
import { colors, spacing, borderRadius, transitions } from "../styles/design-tokens";

const Button = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-blue-600 text-white hover:bg-blue-700
      focus:ring-blue-500
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-gray-200 text-gray-900 hover:bg-gray-300
      focus:ring-gray-400
    `,
    outline: `
      border-2 border-blue-600 text-blue-600
      hover:bg-blue-50
      focus:ring-blue-500
    `,
    danger: `
      bg-red-600 text-white hover:bg-red-700
      focus:ring-red-500
      shadow-md hover:shadow-lg
    `,
    success: `
      bg-green-600 text-white hover:bg-green-700
      focus:ring-green-500
      shadow-md hover:shadow-lg
    `,
    ghost: `
      text-gray-700 hover:bg-gray-100
      focus:ring-gray-300
    `,
  };

  const sizes = {
    xs: "px-2.5 py-1.5 text-xs rounded-md",
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-lg",
    lg: "px-5 py-3 text-base rounded-lg",
    xl: "px-6 py-3.5 text-base rounded-xl",
    "2xl": "px-8 py-4 text-lg rounded-xl",
  };

  return (
    <button
      disabled={disabled || loading}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={20} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={20} />}
        </>
      )}
    </button>
  );
};

export default Button;
