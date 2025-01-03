import { cn } from "@/utils/class-name";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  icon?: IconDefinition;
  iconPosition?: "start" | "end";
  iconProps?: Omit<FontAwesomeIconProps, "icon">;
  error?: boolean;
  errors?: string[];
}

const TextInput = ({
  icon,
  iconPosition = "start",
  iconProps,
  wrapperClassName,
  error = false,
  errors = [],
  className,
  ...props
}: TextInputProps) => {
  const { className: iconClassName } = iconProps || {};
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <div className={"relative w-full"}>
        <input
          type="text"
          autoComplete="off"
          spellCheck="false"
          className={cn(
            "py-3 px-5 block w-full bg-white border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic",
            className,
            {
              "ps-12": icon && iconPosition === "start",
              "pe-12": icon && iconPosition === "end",
              "border-red-500 text-red-500 placeholder:text-red-500": error,
            }
          )}
          {...props}
        />
        {icon && (
          <FontAwesomeIcon
            size="lg"
            icon={icon}
            className={cn(
              "absolute inset-y-0 flex items-center pointer-events-none peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto text-blue-500",
              iconPosition === "start" ? "start-0 ps-4" : "end-0 pe-4",
              iconClassName,
              { "text-red-500": error }
            )}
          />
        )}
      </div>

      {error && Boolean(errors?.length) && (
        <ul className="text-red-500 text-xs font-century-gothic mt-1 w-full">
          {errors?.map((error, index) => (
            <li key={index} className="list-disc list-inside w-full">
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextInput;
