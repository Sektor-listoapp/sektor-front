import { DatePicker as AntdDatePicker } from "antd";
import { DatePickerProps as AntDatePickerProps } from "antd/lib";
import React from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/class-name";
import locale from "antd/es/date-picker/locale/es_ES";

interface DatePickerProps extends AntDatePickerProps {
  wrapperClassName?: string;
  error?: boolean;
  errors?: string[];
  showIcon?: boolean;
}

const DatePicker = ({
  className,
  wrapperClassName,
  error = false,
  errors = [],
  showIcon = true,
  ...props
}: DatePickerProps) => {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <div className={"relative w-full"}>
        <AntdDatePicker
          locale={locale}
          className={cn(
            "w-full text-blue-500",
            styles.datePicker,
            className,
            error && styles.datePickerError,
            {
              "!ps-5": !showIcon,
            }
          )}
          {...props}
        />
        {showIcon && (
          <FontAwesomeIcon
            size="lg"
            icon={faCalendarDays}
            className={cn(
              "absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto transition-all bg-transparent",
              {
                "text-red-500": error,
              }
            )}
          />
        )}
      </div>
      {error && errors?.length && (
        <ul className="text-red-500 text-xs font-century-gothic mt-2">
          {errors?.map((error, index) => (
            <li key={index} className="list-disc list-inside">
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DatePicker;
