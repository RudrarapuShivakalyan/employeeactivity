import clsx from "clsx";

export const Table = ({ children, className, ...props }) => (
  <div className={clsx("w-full overflow-x-auto rounded-lg border border-gray-200", className)} {...props}>
    <table className="w-full">{children}</table>
  </div>
);

export const TableHead = ({ children, className, ...props }) => (
  <thead
    className={clsx("bg-blue-50 border-b-2 border-blue-200", className)}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody = ({ children, className, ...props }) => (
  <tbody className={clsx("divide-y divide-gray-200", className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className, hover = true, ...props }) => (
  <tr
    className={clsx(
      "bg-white",
      hover && "hover:bg-blue-50 transition-colors",
      className
    )}
    {...props}
  >
    {children}
  </tr>
);

export const TableHeader = ({ children, className, ...props }) => (
  <th
    className={clsx(
      "px-6 py-4 md:py-5 text-left text-sm md:text-base font-bold text-gray-900",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className, ...props }) => (
  <td
    className={clsx(
      "px-6 py-4 md:py-5 text-sm md:text-base text-gray-900",
      className
    )}
    {...props}
  >
    {children}
  </td>
);

export default {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
};
