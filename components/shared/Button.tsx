import React from "react";
import { clsx } from "./clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, size, onClick, ...rest }) => {
  const getVariant = (variant: string) => {
    switch (variant) {
      case "primary":
        return "bg-sky-700 border-2 border-sky-300 text-white";
      case "secondary":
        return "bg-sky-300 border-2 border-sky-700 text-sky-700";
      default:
        return "bg-sky-700 border-2 border-sky-300 text-white";
    }
  };

  return (
    <button
      className={clsx(
        "rounded-lg px-4 py-2 font-semibold",
        getVariant(variant || "primary"),
        {
          "text-sm": size === "small",
          "text-md": size === "medium",
          "text-lg": size === "large",
        }
      )}
      onClick={onClick}
      {...rest} // Spread the rest of the props to the button element
    >
      {rest.children}
    </button>
  );
};

export default Button;
