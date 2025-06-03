import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

interface AlertMessageProps {
  message: string;
  type?: "error" | "success" | "warning" | "info";
  duration?: number;
  onDismiss?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  message,
  type = "info",
  duration = 5000,
  onDismiss,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onDismiss]);

  if (!isVisible || !message) {
    return null;
  }

  const positionClasses = "fixed top-5 right-5 z-50";

  const baseToastStyle =
    "max-w-sm w-full bg-white shadow-xl rounded-lg p-4 ring-1 ring-gray-400";

  let typeSpecificClasses = "";
  let IconComponent: React.ReactNode = null;

  switch (type) {
    case "error":
      typeSpecificClasses = "border-l-4 border-red-500";
      IconComponent = (
        <XCircle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
      );
      break;
    case "success":
      typeSpecificClasses = "border-l-4 border-green-500";
      IconComponent = (
        <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
      );
      break;
    case "warning":
      typeSpecificClasses = "border-l-4 border-yellow-500";
      IconComponent = (
        <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0" />
      );
      break;
    case "info":
    default:
      typeSpecificClasses = "border-l-4 border-blue-500";
      IconComponent = (
        <Info className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
      );
      break;
  }

  return (
    <div
      className={`${positionClasses} ${baseToastStyle} ${typeSpecificClasses}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-center">
        {IconComponent && <div className="flex-shrink-0">{IconComponent}</div>}
        <div
          className={`flex-1 text-sm ${IconComponent ? "ml-3" : ""} ${
            type === "error"
              ? "text-red-700"
              : type === "success"
              ? "text-green-700"
              : type === "warning"
              ? "text-yellow-700"
              : "text-gray-700"
          }`}
        >
          {message}
        </div>
        {onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              if (onDismiss) onDismiss();
            }}
            className="ml-3 flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <span className="sr-only">Đóng</span>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;
