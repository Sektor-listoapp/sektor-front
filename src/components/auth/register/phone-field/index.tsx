import React, { FormEvent } from "react";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { PHONE_CODE_OPTIONS } from "@/constants/forms";

interface RegisterPhoneFieldProps {
  phone: string;
  phoneCode: string;
  errors: string[];
  disabled?: boolean;
  onChange: (event: FormEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

/** Teléfono obligatorio del registro: código de país + número (10 dígitos). */
const RegisterPhoneField = ({
  phone,
  phoneCode,
  errors,
  disabled,
  onChange,
}: RegisterPhoneFieldProps) => (
  <SelectWithTextInput
    errors={errors}
    selectProps={{
      name: "phoneCode",
      icon: faPhone,
      value: phoneCode,
      wrapperClassName: "w-60",
      className: "border-r-0",
      options: PHONE_CODE_OPTIONS,
      disabled,
      onChange,
    }}
    textInputProps={{
      name: "phone",
      placeholder: "Teléfono (ej. 4121234567)",
      type: "tel",
      inputMode: "numeric",
      error: Boolean(errors.length),
      disabled,
      onChange,
      maxLength: 10,
      value: phone,
    }}
  />
);

export default RegisterPhoneField;
