import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import React from "react";
interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const PasswordInput = ({
  wrapperClassName,
  className,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={clsx("relative w-full", wrapperClassName)}>
      <input
        autoComplete="off"
        type={showPassword ? "text" : "password"}
        className={clsx(
          "py-3 px-5 ps-12 pe-12 block w-full bg-white border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic",
          className
        )}
        {...props}
      />
      <FontAwesomeIcon
        size="lg"
        icon={faLock}
        className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto"
      />
      <FontAwesomeIcon
        size="lg"
        icon={showPassword ? faEyeSlash : faEye}
        className="absolute inset-y-0 end-0 flex items-center pointer-events-auto pe-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none my-auto cursor-pointer opacity-50"
        onClick={() => setShowPassword(!showPassword)}
      />
    </div>
  );
};

export default PasswordInput;
