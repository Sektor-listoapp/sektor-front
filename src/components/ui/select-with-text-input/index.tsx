import { cn } from "@/utils/class-name";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "../select";
import TextInput from "../text-input";
import { Popover } from "antd";
import type { SelectWithTextInputProps } from "./types";

const SelectWithTextInput = ({
  errors = [],
  selectProps,
  popoverProps,
  textInputProps,
  wrapperClassName,
}: SelectWithTextInputProps) => {
  const {
    icon: selectIcon,
    wrapperClassName: selectWrapperClassName,
    className: selectClassName,
    arrowClassName: selectArrowClassName,
    options: selectOptions,
    error: selectError,
    ...restSelectProps
  } = selectProps || {};

  const {
    wrapperClassName: textInputWrapperClassName,
    className: textInputClassName,
    error: textInputError,
    ...restTextInputProps
  } = textInputProps || {};

  const {
    icon: popoverIcon,
    title: popoverTitle,
    color: popoverColor,
    content: popoverContent,
    className: popoverClassName,
    overlayStyle: popoverOverlayStyle,
    placement: popoverPlacement,
  } = popoverProps || {};

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <div className="w-full flex items-center justify-between relative">
        <Select
          icon={selectIcon}
          wrapperClassName={selectWrapperClassName}
          arrowClassName={cn("ps-0", selectArrowClassName)}
          className={cn("rounded-e-none pr-2", selectClassName)}
          options={selectOptions}
          error={selectError}
          {...restSelectProps}
        />
        <TextInput
          error={textInputError}
          className={cn("rounded-s-none ps-2", textInputClassName, {
            "pe-8": Boolean(popoverContent),
          })}
          wrapperClassName={textInputWrapperClassName}
          {...restTextInputProps}
        />

        {Boolean(popoverContent) && (
          <Popover
            className={cn("my-auto absolute right-2", popoverClassName)}
            placement={popoverPlacement || "topRight"}
            title={popoverTitle || undefined}
            overlayStyle={popoverOverlayStyle || { width: "200px" }}
            color={popoverColor || "#1B475D"}
            content={popoverContent}
          >
            <FontAwesomeIcon
              size="lg"
              icon={popoverIcon || faExclamationCircle}
            />
          </Popover>
        )}
      </div>
      {Boolean(errors?.length) && (
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

export default SelectWithTextInput;
