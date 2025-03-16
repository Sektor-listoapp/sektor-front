/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { TooltipPlacement } from "antd/es/tooltip";
import { CSSProperties, ReactNode } from "react";

type SelectOption = {
  label: string;
  value: string | number | any;
  disabled?: boolean;
  hidden?: boolean;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  wrapperClassName?: string;
  arrowClassName?: string;
  className?: string;
  icon?: IconDefinition;
  error?: boolean;
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  error?: boolean;
}

interface PopoverProps {
  content: ReactNode;
  color?: string;
  icon?: IconDefinition;
  title?: ReactNode;
  className?: string;
  overlayStyle?: CSSProperties;
  placement?: TooltipPlacement;
}

export interface SelectWithTextInputProps {
  selectProps: SelectProps;
  textInputProps: TextInputProps;
  popoverProps?: PopoverProps;
  wrapperClassName?: string;
  errors?: string[];
}
