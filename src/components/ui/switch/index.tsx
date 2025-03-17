import React from "react";
import { cn } from "@/utils/class-name";
import { Switch as AntSwitch, SwitchProps } from "antd";
import styles from "./styles.module.css";

const Switch = ({
  className,
  ...switchProps
}: SwitchProps & React.RefAttributes<HTMLButtonElement>) => {
  return (
    <AntSwitch {...switchProps} className={cn(styles.switch, className)} />
  );
};

export default Switch;
