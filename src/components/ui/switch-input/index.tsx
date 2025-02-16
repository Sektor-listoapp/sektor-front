import React from "react";
import { cn } from "@/utils/class-name";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "antd";
import { SwitchInputProps } from "./types";
import styles from "./styles.module.css";

const SwitchInput = ({
  icon,
  iconProps,
  wrapperClassName,
  error = false,
  errors = [],
  switchProps,
  label = "",
  ...props
}: SwitchInputProps) => {
  const { className: iconClassName } = iconProps || {};

  return (
    <div className="w-full">
      <div
        className={cn(
          "w-full flex justify-between items-center gap-4 bg-white p-2 px-4 border-blue-500 border rounded-xl",
          wrapperClassName,

          {
            "border-red-500 text-red-500 placeholder:text-red-500": error,
          }
        )}
        {...props}
      >
        <div className="font-century-gothic flex justify-start items-center gap-2 text-sm md:text-base">
          {icon && (
            <FontAwesomeIcon
              size="lg"
              icon={icon}
              className={cn(iconClassName, { "text-red-500": error })}
            />
          )}
          <span>{label}</span>
        </div>
        <Switch
          {...switchProps}
          className={cn(styles.switch, switchProps?.className)}
        />
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

export default SwitchInput;
