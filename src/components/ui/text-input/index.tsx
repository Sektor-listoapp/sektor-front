import { cn } from "@/utils/class-name";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "antd";
import React from "react";
import { TextInputProps } from "./types";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const TextInput = ({
  icon,
  iconPosition = "start",
  iconProps,
  wrapperClassName,
  error = false,
  errors = [],
  className,
  popoverProps,
  ...props
}: TextInputProps) => {
  const { className: iconClassName } = iconProps || {};

  const {
    icon: popoverIcon,
    title: popoverTitle,
    color: popoverColor,
    content: popoverContent,
    className: popoverClassName,
    overlayStyle: popoverOverlayStyle,
    placement: popoverPlacement,
  } = popoverProps || {};

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
              "pe-8": Boolean(popoverContent),
            }
          )}
          {...props}
        />
        {Boolean(popoverContent) && (
          <Popover
            className={cn("inset-y-0 absolute my-auto right-2", popoverClassName)}
            placement={popoverPlacement || "topRight"}
            title={popoverTitle || undefined}
            overlayStyle={popoverOverlayStyle || { width: "200px" }}
            color={popoverColor || "#1B475D"}
            content={popoverContent}
          >
            <FontAwesomeIcon
              size="lg"
              icon={popoverIcon || faExclamationCircle}
            />
          </Popover>
        )}
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
