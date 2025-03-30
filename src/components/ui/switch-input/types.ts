import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { SwitchProps } from "antd";

export interface SwitchInputProps
  extends React.InputHTMLAttributes<HTMLDivElement> {
  wrapperClassName?: string;
  icon: IconDefinition;
  iconProps?: Omit<FontAwesomeIconProps, "icon">;
  error?: boolean;
  readOnly?: boolean;
  label: string;
  errors?: string[];
  switchProps?: SwitchProps & React.RefAttributes<HTMLButtonElement>;
}
