import React from "react";
import { Alert } from "@material-tailwind/react";

export function AlertCustomAnimation({
  children,
  color = "red",
  autoClose = true,
  duration = 5000,
  onClose,
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (children) {
      setOpen(true);

      // Auto close alert after specified duration
      if (autoClose && duration > 0) {
        const timer = setTimeout(() => {
          setOpen(false);
          if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      setOpen(false);
    }
  }, [children, autoClose, duration, onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  if (!children) return null;

  // Define custom styles based on color
  const getAlertStyles = (alertColor) => {
    switch (alertColor) {
      case "red":
        return "bg-red-50 border border-red-200 text-red-800 shadow-lg";
      case "green":
        return "bg-green-50 border border-green-200 text-green-800 shadow-lg";
      case "blue":
        return "bg-blue-50 border border-blue-200 text-blue-800 shadow-lg";
      case "yellow":
        return "bg-yellow-50 border border-yellow-200 text-yellow-800 shadow-lg";
      case "orange":
        return "bg-orange-50 border border-orange-200 text-orange-800 shadow-lg";
      default:
        return "bg-red-50 border border-red-200 text-red-800 shadow-lg";
    }
  };

  const getCloseButtonStyles = (alertColor) => {
    switch (alertColor) {
      case "red":
        return "text-red-600 hover:text-red-800 hover:bg-red-100";
      case "green":
        return "text-green-600 hover:text-green-800 hover:bg-green-100";
      case "blue":
        return "text-blue-600 hover:text-blue-800 hover:bg-blue-100";
      case "yellow":
        return "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100";
      case "orange":
        return "text-orange-600 hover:text-orange-800 hover:bg-orange-100";
      default:
        return "text-red-600 hover:text-red-800 hover:bg-red-100";
    }
  };

  return (
    <Alert
      open={open}
      onClose={handleClose}
      animate={{
        mount: { y: 0, opacity: 1 },
        unmount: { y: -100, opacity: 0 },
      }}
      className={`mb-4 rounded-lg p-4 ${getAlertStyles(color)}`}
      dismissible
      icon={false}
      action={
        <button
          onClick={handleClose}
          className={`ml-auto p-1 rounded-full transition-colors duration-200 ${getCloseButtonStyles(
            color
          )}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      }
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {color === "red" && (
            <svg
              className="h-5 w-5 text-red-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {color === "green" && (
            <svg
              className="h-5 w-5 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {color === "blue" && (
            <svg
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {(color === "yellow" || color === "orange") && (
            <svg
              className="h-5 w-5 text-yellow-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </Alert>
  );
}
