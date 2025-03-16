import { cn } from "@/utils/class-name";
import {
  faChevronDown,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, SelectProps } from "antd";
import styles from "./index.module.css";

interface SelectMultipleProps {
  wrapperClassName?: string;
  selectProps: SelectProps;
  icon?: IconDefinition;
  error?: boolean;
  errors?: string[];
}

const SelectMultiple = ({
  icon,
  selectProps,
  error = false,
  errors = [],
  wrapperClassName,
}: SelectMultipleProps) => {
  const {
    className: selectClassName,
    options: selectOptions,
    ...restSelectProps
  } = selectProps;

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <div className={"relative w-full"}>
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
          className={cn(styles.selectMultiple, selectClassName, {
            "ps-12": icon,
            "border-red-500 placeholder:text-red-500 text-red-500": error,
          })}
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
