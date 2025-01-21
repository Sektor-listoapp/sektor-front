import React from "react";
import { cn } from "@/utils/class-name";
import { Slider } from "antd";
import { SliderRangeProps } from "antd/es/slider";
import styles from "./styles.module.css";

interface RangeProps extends Omit<SliderRangeProps, "range"> {
  label: string;
  minRangeLabel?: string;
  maxRangeLabel?: string;
  wrapperClassName?: string;
}

const Range = ({
  label,
  wrapperClassName,
  className,
  ...props
}: RangeProps) => {
  return (
    <div
      className={cn(
        "py-1 pb-2 px-5 w-full border border-blue-500 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic appearance-none flex flex-col items-start justify-between md:gap-2 md:flex-row md:items-center",
        wrapperClassName
      )}
    >
      <span>{label}</span>
      <div className="max-w-56 w-full">
        <Slider
          className={cn("w-full", className, styles.slider)}
          min={20}
          max={100}
          step={5}
          range
          {...props}
        />
        <div className="w-full flex justify-evenly items-center text-blue-500 font-century-gothic -mt-3 text-xs">
          <strong>
            {props.minRangeLabel || props.value?.[0] || props.defaultValue?.[0]}
          </strong>
          <span> a </span>
          <strong>
            {props.maxRangeLabel || props.value?.[1] || props.defaultValue?.[1]}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default Range;
