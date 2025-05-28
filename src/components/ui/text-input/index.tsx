import { cn } from "@/utils/class-name";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "antd";
import React, { useState } from "react";
import { TextInputProps } from "./types";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

interface ExtendedTextInputProps extends TextInputProps {
  showFloatingLabel?: boolean;
}

const TextInput = ({
  icon,
  iconPosition = "start",
  iconProps,
  wrapperClassName,
  error = false,
  errors = [],
  className,
  placeholder,
  popoverProps,
  showFloatingLabel = false, 
  ...props
}: ExtendedTextInputProps) => {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(props.value?.toString().length);
  const showLabel = focused || hasValue;

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
      {showFloatingLabel && placeholder && (
        <label
          className={cn(
            "absolute left-0 text-sm font-century-gothic text-blue-500 transition-all duration-200 bg-white px-1",
            showLabel ? "-top-2 -translate-y-3 opacity-100" : "top-1/2 -translate-y-1/2 opacity-0"
          )}
        >
          {placeholder}
        </label>
      )}

      <div className="relative w-full">
        <input
          type="text"
          autoComplete="off"
          spellCheck="false"
          className={cn(
            "py-3 px-5 block w-full bg-white border border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic",
            className,
            {
              "ps-12": icon && iconPosition === "start",
              "pe-12": icon && iconPosition === "end",
              "border-red-500 text-red-500 placeholder:text-red-500": error,
              "pe-8": Boolean(popoverContent),
            }
          )}
          placeholder={!showFloatingLabel || !showLabel ? placeholder : ""}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />

        {Boolean(popoverContent) && (
          <Popover
            className={cn("inset-y-0 absolute my-auto right-2", popoverClassName)}
            placement={popoverPlacement || "topRight"}
            title={popoverTitle}
            overlayStyle={popoverOverlayStyle || { width: "200px" }}
            color={popoverColor || "#1B475D"}
            content={popoverContent}
          >
            <FontAwesomeIcon size="lg" icon={popoverIcon || faExclamationCircle} />
          </Popover>
        )}

        {icon && (
          <FontAwesomeIcon
            size="lg"
            icon={icon}
            className={cn(
              "absolute inset-y-0 flex items-center pointer-events-none my-auto text-blue-500",
              iconPosition === "start" ? "start-0 ps-4" : "end-0 pe-4",
              iconClassName,
              { "text-red-500": error }
            )}
          />
        )}
      </div>

      {error && Boolean(errors?.length) && (
        <ul className="text-red-500 text-xs font-century-gothic mt-1 w-full">
          {errors.map((err, i) => (
            <li key={i} className="list-disc list-inside w-full">
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TextInput;
