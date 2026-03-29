import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import React from "react";

const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      error,
      helperText,
      placeholder = "Select an option",
      disabled = false,
      required = false,
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
      rounded-lg transition-all appearance-none cursor-pointer
      focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
      disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
    `;

    const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "";

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label className={clsx("block font-medium text-gray-700 mb-2 md:mb-2.5", labelSizes[size])}>
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={clsx(
              baseStyles,
              sizes[size],
              errorStyles,
              "pr-12"
            )}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={size === "2xl" ? 24 : size === "xl" ? 22 : 20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {error && <p className="mt-1 text-sm text-red-500 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
