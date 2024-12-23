import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  icon?: IconDefinition;
}

const TextInput = ({
  icon,
  wrapperClassName,
  className,
  ...props
}: TextInputProps) => {
  return (
    <div className={clsx("relative w-full", wrapperClassName)}>
      <input
        type="text"
        autoComplete="off"
        className={clsx(
          "py-3 px-5 ps-12 block w-full bg-white border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic",
          className
        )}
        {...props}
      />
      {icon && (
        <FontAwesomeIcon
          size="lg"
          icon={icon}
          className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto"
        />
      )}
    </div>
  );
};

export default TextInput;
