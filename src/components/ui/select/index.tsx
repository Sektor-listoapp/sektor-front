import { UserType } from "@/types/shared";
import {
  faChevronDown,
  faChevronUp,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";

type SelectOption = {
  label: string;
  value: string | number | UserType;
  disabled?: boolean;
  hidden?: boolean;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
  options: SelectOption[];
  icon?: IconDefinition;
}

const Select = ({
  icon,
  options = [],
  className,
  wrapperClassName,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={clsx("relative w-full", wrapperClassName)}>
      {icon && (
        <FontAwesomeIcon
          size="xl"
          icon={icon}
          className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto"
        />
      )}
      <select
        className={clsx(
          "py-3 px-5 pe-9 block w-full border-blue-500 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic appearance-none",
          className,
          {
            "ps-12": icon,
          }
        )}
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setIsOpen(false)}
        {...props}
      >
        {options?.map(({ label, value, disabled, hidden }, key) => (
          <option
            key={`${value}-${key}`}
            value={value as string}
            disabled={disabled}
            className={clsx("w-full p-4 appearance-none", { hidden: hidden })}
          >
            {label}
          </option>
        ))}
      </select>
      <FontAwesomeIcon
        size="lg"
        icon={isOpen ? faChevronUp : faChevronDown}
        className={clsx(
          "absolute inset-y-0 end-[10px] flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto transition-all bg-white"
        )}
      />
    </div>
  );
};

export default Select;
