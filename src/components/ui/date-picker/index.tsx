import { DatePicker as AntdDatePicker } from "antd";
import { DatePickerProps as AntDatePickerProps } from "antd/lib";
import clsx from "clsx";
import React from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";

interface DatePickerProps extends AntDatePickerProps {
  wrapperClassName?: string;
}

const DatePicker = ({
  className,
  wrapperClassName,
  ...props
}: DatePickerProps) => {
  return (
    <div className={clsx("relative w-full", wrapperClassName)}>
      <AntdDatePicker
        className={clsx("w-full text-blue-500", styles.datePicker, className)}
        {...props}
      />
      <FontAwesomeIcon
        size="lg"
        icon={faCalendarDays}
        className={clsx(
          "absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto transition-all bg-white"
        )}
      />
    </div>
  );
};

export default DatePicker;
