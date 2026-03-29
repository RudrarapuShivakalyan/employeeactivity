import clsx from "clsx";
import { X } from "lucide-react";

const Modal = ({ open = false, onClose, title, children, size = "md", className, ...props }) => {
  if (!open) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  };

  const paddingSizes = {
    sm: "p-4 md:p-5",
    md: "p-6 md:p-7",
    lg: "p-8 md:p-9",
    xl: "p-8 md:p-10",
    "2xl": "p-10 md:p-12",
    "3xl": "p-10 md:p-12",
    "4xl": "p-10 md:p-12",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      {...props}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className={clsx(
        "relative bg-white rounded-2xl shadow-2xl", 
        sizes[size], 
        paddingSizes[size],
        "max-h-[90vh] overflow-y-auto", 
        className
      )}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b-2 border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={28} className="text-gray-500" />
            </button>
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
