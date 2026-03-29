import clsx from "clsx";

export const PageHeader = ({ 
  title, 
  description, 
  action, 
  className, 
  ...props 
}) => (
  <div
    className={clsx(
      "mb-10 md:mb-12",
      className
    )}
    {...props}
  >
    <div className="flex items-start justify-between gap-6 mb-4 flex-wrap">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{title}</h1>
        {description && (
          <p className="text-base md:text-lg text-gray-600">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  </div>
);

export const PageSection = ({ 
  title, 
  subtitle, 
  children, 
  className,
  spacing = true,
  ...props 
}) => (
  <div
    className={clsx(
      "bg-white rounded-xl overflow-hidden",
      "border border-gray-200",
      spacing && "p-8 md:p-10",
      className
    )}
    {...props}
  >
    {title && (
      <div className={clsx("mb-8 md:mb-10", spacing && "border-b border-gray-200 pb-8 md:pb-10")}>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-2 text-base md:text-lg text-gray-600">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

export const TabNavigation = ({ tabs, activeTab, onChange, className }) => (
  <div className={clsx("flex gap-1 border-b-4 border-gray-200 mb-8 md:mb-10 bg-white rounded-lg overflow-hidden shadow-md", className)}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={clsx(
          "px-6 md:px-8 py-4 md:py-5 font-semibold text-base md:text-lg transition-all flex-1",
          activeTab === tab.id
            ? "text-white bg-blue-600 shadow-md"
            : "text-gray-700 bg-gray-50 hover:bg-gray-100"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  trend, 
  change,
  className,
  ...props 
}) => (
  <div
    className={clsx(
      "bg-white rounded-xl border border-gray-200 p-8 md:p-10",
      "hover:shadow-xl transition-shadow",
      className
    )}
    {...props}
  >
    <div className="flex items-start justify-between mb-6">
      <div>
        <p className="text-gray-600 text-sm md:text-base font-medium">{label}</p>
        <p className="mt-3 text-4xl md:text-5xl font-bold text-gray-900">{value}</p>
      </div>
      {Icon && (
        <div className="p-3 md:p-4 bg-blue-100 rounded-lg">
          <Icon size={28} className="text-blue-600" />
        </div>
      )}
    </div>
    {(trend || change) && (
      <p className={clsx(
        "text-sm md:text-base font-medium",
        (trend?.positive !== false && change) ? "text-green-600" : "text-gray-600"
      )}>
        {(trend?.positive !== false && change) && "↑ "}{trend?.value || change}
      </p>
    )}
  </div>
);

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className,
  ...props 
}) => (
  <div
    className={clsx(
      "flex flex-col items-center justify-center py-16 md:py-20 px-4",
      className
    )}
    {...props}
  >
    {Icon && (
      <div className="mb-6 p-6 md:p-8 bg-gray-100 rounded-full">
        <Icon size={48} className="text-gray-400" />
      </div>
    )}
    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-base md:text-lg text-gray-600 text-center mb-8 max-w-sm">
      {description}
    </p>
    {action && action}
  </div>
);

export default {
  PageHeader,
  PageSection,
  TabNavigation,
  StatCard,
  EmptyState,
};
