import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import {
  HandleUserInfoFormInputChangeParams,
  ValidateFormFields,
} from "./types";

const { GENERAL, PHONE } = INPUT_ERROR_MESSAGES;

export const handleUserInfoFormInputChange = ({
  event,
  setInput,
  setErrors,
}: HandleUserInfoFormInputChangeParams) => {
  const inputsToAvoidTrimming = ["name"];
  const { name, value } = event.currentTarget;
  const trimmedValue = inputsToAvoidTrimming.includes(name)
    ? value
    : value.trim();
  setInput((prev) => ({ ...prev, [name]: trimmedValue }));

  if (name === "phone") {
    setErrors((prev) => ({
      ...prev,
      [name]: REGEX.PHONE.test(trimmedValue) ? [] : [PHONE.LENGTH],
    }));
    return;
  }

  setErrors((prev) => ({
    ...prev,
    [name]: trimmedValue.trim().length ? [] : [GENERAL.REQUIRED],
  }));
};

export const validateFormFields = ({
  input,
  errors,
  setErrors,
}: ValidateFormFields) => {
  const hasFieldsWithErrors = Object.values(errors)?.some(
    (error) => error.length > 0
  );
  const hasEmptyFields = Object.values(input).some(
    (value) => !Boolean(value?.trim()?.length)
  );
  if (!hasFieldsWithErrors && !hasEmptyFields) {
    return true;
  }

  if (hasEmptyFields) {
    setErrors((prev) => ({
      ...prev,
      name: !input.name?.trim()?.length ? [GENERAL.REQUIRED] : prev.name,
      phone: !input.phone?.trim()?.length ? [GENERAL.REQUIRED] : prev.phone,
      state: !input.state?.trim()?.length ? [GENERAL.REQUIRED] : prev.state,
      city: !input.city?.trim()?.length ? [GENERAL.REQUIRED] : prev.city,
      segment: !input.segment?.trim()?.length
        ? [GENERAL.REQUIRED]
        : prev.segment,
      email: !input.email?.trim()?.length ? [GENERAL.REQUIRED] : prev.segment,
    }));
  }

  return false;
};
