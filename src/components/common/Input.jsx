import clsx from "clsx";
import React from "react";

const Input = React.forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconPosition = "left",
      placeholder,
      disabled = false,
      required = false,
      type = "text",
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-4 py-3 text-base",
      xl: "px-5 py-3.5 text-base",
      "2xl": "px-6 py-4 text-lg",
    };

    const labelSizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
      xl: "text-base",
      "2xl": "text-base",
    };

    const baseStyles = `
      w-full bg-white border-2 border-gray-200
      rounded-lg transition-all
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
      placeholder:text-gray-400
      disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
    `;

    const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "";

    const inputWrapper = Icon ? "relative" : "";

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label className={clsx("block font-medium text-gray-700 mb-2 md:mb-2.5", labelSizes[size])}>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className={inputWrapper}>
          {Icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/3 -translate-y-1/3 text-gray-400 pointer-events-none">
              <Icon size={20} />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(baseStyles, sizes[size], errorStyles, Icon && iconPosition === "left" && "pl-10")}
            {...props}
          />

          {Icon && iconPosition === "right" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <Icon size={20} />
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
