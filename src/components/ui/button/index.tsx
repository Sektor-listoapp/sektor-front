import { cn } from "@/utils/class-name";
import React from "react";
import Spinner from "../spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
  loading?: boolean;
}

const variants = {
  base: "py-2 px-6 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-3xl border border-transparent transition-all font-arial-rounded text-base shadow-xl focus:outline-0",
  solid:
    "bg-white text-blue-500 hover:bg-blue-100 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none",
  "solid-blue":
    "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-500 disabled:opacity-50 disabled:pointer-events-none",
  outline:
    "border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 focus:outline-none focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    "text-blue-600 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:bg-blue-100 focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none",
  soft: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none",
  white:
    "py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-3xl border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none",
  link: "text-white underline hover:text-gray-100 focus:outline-none focus:text-gray-300 disabled:opacity-50 disabled:pointer-events-none shadow-none bg-transparent px-0 py-0 font-century-gothic block",
  "link-blue":
    "text-blue-500 underline hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none shadow-none bg-transparent px-0 py-0 font-century-gothic block",
};

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
      className={cn(variants.base, variants[variant], className, {
        "cursor-not-allowed relative text-opacity-0": loading,
      })}
      {...props}
    >
      {loading && <Spinner className="absolute inset-0 m-auto" />}
      {children}
    </button>
  );
};

export default Button;
