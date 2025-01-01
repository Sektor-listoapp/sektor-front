import { cn } from "@/utils/class-name";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  hideLeftIcon?: boolean;
  hideRightIcon?: boolean;
  isPasswordConfirmationInput?: boolean;
  passwordToMatch?: string;
  error?: boolean;
  errors?: string[];
}

const PasswordInput = ({
  wrapperClassName,
  className,
  hideLeftIcon = false,
  error = false,
  errors = [],
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <div className={"relative w-full"}>
        <input
          autoComplete="off"
          type={showPassword ? "text" : "password"}
          className={cn(
            "py-3 px-5 ps-12 pe-12 block w-full bg-white border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic",
            className,
            { "ps-5": hideLeftIcon },
            { "border-red-500 text-red-500 placeholder:text-red-500": error }
          )}
          {...props}
        />
        {!hideLeftIcon && (
          <FontAwesomeIcon
            size="lg"
            icon={faLock}
            className={cn(
              "absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto",
              {
                "text-red-500": error,
              }
            )}
          />
        )}
        <FontAwesomeIcon
          size="lg"
          icon={showPassword ? faEyeSlash : faEye}
          className="absolute inset-y-0 end-0 flex items-center pointer-events-auto pe-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto cursor-pointer opacity-50"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>
      {error && errors?.length && (
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

export default PasswordInput;
