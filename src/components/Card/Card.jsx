import { Card as MTCard } from "@material-tailwind/react";

const Card = ({ children, className = "", shadow = "lg", ...props }) => {
  return (
    <MTCard
      className={`w-full bg-white rounded-xl ${
        shadow === "lg"
          ? "shadow-lg"
          : shadow === "xl"
          ? "shadow-xl"
          : "shadow-md"
      } ${className}`}
      {...props}
    >
      {children}
    </MTCard>
  );
};

// Card Header Component
const CardHeader = ({ children, className = "", bordered = false }) => {
  return (
    <div
      className={`px-6 py-4 ${
        bordered ? "border-b border-gray-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Card Body Component
const CardBody = ({ children, className = "" }) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};

// Card Footer Component
const CardFooter = ({ children, className = "", bordered = false }) => {
  return (
    <div
      className={`px-6 py-4 ${
        bordered ? "border-t border-gray-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card, CardHeader, CardBody, CardFooter };
export default Card;
