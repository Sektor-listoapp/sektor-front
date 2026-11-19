import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import {
  HandleOtherFormInputChangeParams,
  OtherFormInput,
  ValidateOtherFormFields,
} from "./types";

const { PASSWORD, GENERAL, EMAIL, PHONE } = INPUT_ERROR_MESSAGES;

export const handleOtherFormInputChange = ({
  input,
  event,
  setInput,
  setErrors,
}: HandleOtherFormInputChangeParams) => {
  const { name, value } = event.currentTarget;
  const trimmedValue = name === "name" ? value : value.trim();
  setInput((prev) => ({ ...prev, [name]: trimmedValue }));

  if (name === "email") {
    setErrors((prev) => ({
      ...prev,
      email: REGEX.EMAIL.test(trimmedValue) ? [] : [EMAIL.EXAMPLE],
    }));
    return;
  }

  if (name === "password") {
    const hasCapitalLetter = REGEX.CAPITAL_LETTER.test(trimmedValue);
    const hasSpecialCharacter = REGEX.SPECIAL_CHARACTER.test(trimmedValue);
    const hasEightCharacters = REGEX.EIGHT_CHARACTERS.test(trimmedValue);

    setErrors((prev) => ({
      ...prev,
      password: [
        !hasEightCharacters ? PASSWORD.MIN_LENGTH_SHORT : "",
        !hasSpecialCharacter ? PASSWORD.MIN_SPECIAL_CHARACTERS : "",
        !hasCapitalLetter ? PASSWORD.CAPITAL_LETTER : "",
      ].filter(Boolean),
      confirmPassword:
        trimmedValue === input.confirmPassword ? [] : [PASSWORD.MATCH],
    }));
    return;
  }

  if (name === "phone") {
    setErrors((prev) => ({
      ...prev,
      phone: REGEX.PHONE.test(trimmedValue) ? [] : [PHONE.LENGTH],
    }));
    return;
  }

  if (name === "confirmPassword") {
    setErrors((prev) => ({
      ...prev,
      confirmPassword: trimmedValue === input.password ? [] : [PASSWORD.MATCH],
    }));
    return;
  }

  setErrors((prev) => ({
    ...prev,
    [name]: trimmedValue.trim().length ? [] : [GENERAL.REQUIRED],
  }));
};

export const validateOtherFormFields = ({
  input,
  errors,
  setErrors,
}: ValidateOtherFormFields) => {
  const hasFieldsWithErrors = Object.values(errors).some(
    (error) => error.length > 0
  );
  const emptyFields = (Object.keys(input) as (keyof OtherFormInput)[]).filter(
    (key) => !input[key]?.trim()?.length
  );

  if (!hasFieldsWithErrors && !emptyFields.length) return true;

  if (emptyFields.length) {
    setErrors((prev) => {
      const next = { ...prev };
      emptyFields.forEach((key) => {
        next[key] = [GENERAL.REQUIRED];
      });
      return next;
    });
  }

  return false;
};
