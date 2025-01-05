import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { TooltipPlacement } from "antd/es/tooltip";
import { CSSProperties, ReactNode } from "react";

interface PopoverProps {
  content: ReactNode;
  color?: string;
  icon?: IconDefinition;
  title?: ReactNode;
  className?: string;
  overlayStyle?: CSSProperties;
  placement?: TooltipPlacement;
}

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  icon?: IconDefinition;
  iconPosition?: "start" | "end";
  iconProps?: Omit<FontAwesomeIconProps, "icon">;
  error?: boolean;
  errors?: string[];
  popoverProps?: PopoverProps;
}
