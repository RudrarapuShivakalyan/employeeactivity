import React from "react";

export const Button = React.forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";

    const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-lg",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
      danger: "bg-red-600 text-white hover:bg-red-700",
      success: "bg-green-600 text-white hover:bg-green-700",
      ghost: "text-gray-700 hover:bg-gray-100",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabled || loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const Input = React.forwardRef(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2 ${Icon ? "pl-10" : ""} border rounded-lg
              transition-all duration-200
              bg-white text-gray-900
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${error ? "border-red-500 focus:ring-red-500" : "border-gray-200 hover:border-gray-300"}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Card = ({ shadow = "md", className = "", children, ...props }) => {
  const shadowClasses = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  return (
    <div
      className={`
        bg-white rounded-xl
        ${shadowClasses[shadow]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const Badge = ({ variant = "primary", children, className = "" }) => {
  const variantClasses = {
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    error: "bg-red-50 text-red-700 border border-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    primary: "bg-blue-50 text-blue-700 border border-blue-200",
    gray: "bg-gray-100 text-gray-700 border border-gray-200",
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        text-xs font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card
        shadow="xl"
        className={`relative w-full max-w-md mx-4 animate-scale-in ${className}`}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </Card>
    </div>
  );
};

export const Table = ({ columns, data, loading = false }) => {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export const Tabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-4 py-3 font-medium text-sm transition-colors relative
              ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {Icon && <Icon size={48} className="text-gray-300 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-4">{description}</p>
      {action && <>{action}</>}
    </div>
  );
};

export const StatCard = ({ icon: Icon, label, value, change, changeType = "positive" }) => {
  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <Icon size={24} className="text-blue-600" />
            </div>
          )}
          <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      {change && (
        <p
          className={`text-sm font-medium ${
            changeType === "positive" ? "text-green-600" : "text-red-600"
          }`}
        >
          {changeType === "positive" ? "↑" : "↓"} {change}
        </p>
      )}
    </Card>
  );
};
