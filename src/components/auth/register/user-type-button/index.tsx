/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { HTMLAttributes } from "react";
import { useRegistrationStore } from "@/store/registration";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import clsx from "clsx";

interface UserTypeButtonProps extends HTMLAttributes<HTMLButtonElement> {
  selectedUserType: any;
  icon: IconDefinition;
  iconProps?: FontAwesomeIconProps;
  text: string;
  size?: "small" | "medium" | "large";
}

const UserTypeButton = ({
  size = "medium",
  icon,
  className = "",
  iconProps,
  text = "",
  selectedUserType,
  ...props
}: UserTypeButtonProps) => {
  const userType = useRegistrationStore((state) => state.userType);
  const setUserType = useRegistrationStore((state) => state.setUserType);

  const handleUserType = (selectedUserType: any) => {
    const newUserType = userType === selectedUserType ? null : selectedUserType;
    setUserType(newUserType);
  };

  return (
    <button
      className={clsx("flex flex-col items-center gap-3", className)}
      onClick={() => handleUserType(selectedUserType)}
      {...props}
    >
      <div
        className={clsx(
          `border-2 rounded-xl flex items-center justify-center transition-all ${
            userType === selectedUserType
              ? "border-blue-500 scale-105"
              : "border-gray-300"
          }`,
          {
            "size-20": size === "small",
            "size-24": size === "medium",
            "size-32": size === "large",
          }
        )}
      >
        <FontAwesomeIcon size="3x" icon={icon || faUser} {...iconProps} />
      </div>
      <span
        className={clsx("font-bold font-arial-rounded text-balance", {
          "text-sm": size === "small",
          "text-base": size === "medium",
          "text-lg": size === "large",
        })}
      >
        {text}
      </span>
    </button>
  );
};

export default UserTypeButton;
