import { cn } from "@/utils/class-name";
import {
  faChevronDown,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, SelectProps } from "antd";
import styles from "./index.module.css";
import { useState } from "react";

interface SelectMultipleProps {
  wrapperClassName?: string;
  subWrapperClassName?: string;
  selectProps: SelectProps;
  icon?: IconDefinition;
  error?: boolean;
  errors?: string[];
  label?: string;
  showFloatingLabel?: boolean;
}

const SelectMultiple = ({
  icon,
  selectProps,
  error = false,
  errors = [],
  wrapperClassName,
  subWrapperClassName,
  label,
  showFloatingLabel = false,
}: SelectMultipleProps) => {
  const [focused, setFocused] = useState(false);
  const {
    className: selectClassName,
    options: selectOptions,
    value,
    onFocus,
    onBlur,
    ...restSelectProps
  } = selectProps;

  const hasValue =
    Array.isArray(value) ? value.length > 0 : Boolean(value);
  const showLabel = focused || hasValue;

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      {showFloatingLabel && label && (
        <label
          className={cn(
            "absolute left-0 text-sm font-century-gothic text-blue-500 transition-all duration-200 bg-white px-1 z-10",
            showLabel ? "-top-2 -translate-y-3 opacity-100" : "top-1/2 -translate-y-1/2 opacity-0"
          )}
        >
          {label}
        </label>
      )}

      <div className={cn("relative w-full", subWrapperClassName)}>
        {icon && (
          <FontAwesomeIcon
            size="lg"
            icon={icon}
            className={cn(
              "absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto",
              { "text-red-500": error }
            )}
          />
        )}

        <Select
          mode="multiple"
          options={selectOptions || []}
          suffixIcon={
            <FontAwesomeIcon size="xl" icon={faChevronDown} color="#182f48" />
          }
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          value={value}
          className={cn(
            styles.selectMultiple,
            selectClassName,
            error && styles.selectWithErrors,
            {
              "ps-12": icon,
              "border-red-500 placeholder:text-red-500 text-red-500": error,
            }
          )}
          showSearch={true}
          optionFilterProp="label"
          {...restSelectProps}
        />
      </div>

      {error && Boolean(errors?.length) && (
        <ul className="text-red-500 text-xs font-century-gothic mt-2">
          {errors?.map((error, index) => (
            <li key={index} className="list-disc list-inside text-balance">
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectMultiple;
