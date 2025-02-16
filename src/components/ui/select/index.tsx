import { UserType } from "@/types/shared";
import { cn } from "@/utils/class-name";
import {
  faChevronDown,
  faChevronUp,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

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
  error?: boolean;
  errors?: string[];
  arrowClassName?: string;
  showArrow?: boolean;
}

const Select = ({
  icon,
  options = [],
  className,
  error = false,
  errors = [],
  wrapperClassName,
  arrowClassName,
  showArrow = true,
  ...props
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <div className={"relative w-full"}>
        {icon && (
          <FontAwesomeIcon
            size="lg"
            icon={icon}
            className={cn(
              "absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto",
              {
                "text-red-500": error,
              }
            )}
          />
        )}
        <select
          className={cn(
            "py-3 px-5 pe-9 block w-full border-blue-500 rounded-xl text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic appearance-none",
            className,
            {
              "ps-12": icon,
              "border-red-500 placeholder:text-red-500 text-red-500": error,
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
              className={cn("w-full p-4 appearance-none text-blue-500", {
                hidden: hidden,
              })}
            >
              {label}
            </option>
          ))}
        </select>
        {showArrow && (
          <FontAwesomeIcon
            size="lg"
            icon={isOpen ? faChevronUp : faChevronDown}
            className={cn(
              "absolute inset-y-0 end-[10px] flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto transition-all bg-white",
              arrowClassName
            )}
          />
        )}
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

export default Select;
