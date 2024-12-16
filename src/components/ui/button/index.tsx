import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost" | "soft" | "white" | "link";
  size?: "small" | "medium" | "large";
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children = "",
  className = "",
  variant = "solid",
  ...props
}) => {
  const variants = {
    base: "py-2 px-6 inline-flex items-center justify-center gap-x-2 text-sm font-medium rounded-3xl border border-transparent transition-all",
    solid:
      "bg-white text-blue-500 hover:bg-blue-100 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none",
    outline:
      "border-gray-200 text-gray-500 hover:border-blue-600 hover:text-blue-600 focus:outline-none focus:border-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:pointer-events-none",
    ghost:
      "text-blue-600 hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus:bg-blue-100 focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none",
    soft: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-none focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none",
    white:
      "py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-3xl border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none",
    link: "text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none",
  };

  return (
    <button
      type="button"
      className={`${variants.base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
