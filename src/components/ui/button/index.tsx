import { cn } from "@/utils/class-name";
import React from "react";
import Spinner from "../spinner";
import { BUTTON_VARIANTS } from "./constants";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BUTTON_VARIANTS;
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children = "",
  className = "",
  variant = "solid",
  loading = false,
  ...props
}) => {
  return (
    <button
      type="button"
      className={cn(BUTTON_VARIANTS.base, BUTTON_VARIANTS[variant], className, {
        "cursor-not-allowed relative": loading,
      })}
      {...props}
    >
      {loading && <Spinner className="absolute inset-0 m-auto" />}
      <span
        className={cn({
          "opacity-0": loading,
        })}
      >
        {children}
      </span>
    </button>
  );
};

export default Button;
