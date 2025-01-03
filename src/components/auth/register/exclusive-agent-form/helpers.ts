import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import {
  HandleExclusiveAgentFormInputChangeParams,
  ValidateFormFields,
} from "./types";

const { PASSWORD, GENERAL, EMAIL, LICENSE } = INPUT_ERROR_MESSAGES;

export const handleExclusiveAgentFormInputChange = ({
  input,
  event,
  setInput,
  setErrors,
}: HandleExclusiveAgentFormInputChangeParams) => {
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

  if (name === "license") {
    setErrors((prev) => ({
      ...prev,
      license: REGEX.LICENSE.test(trimmedValue) ? [] : [LICENSE.LENGTH],
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

export const validateFormFields = ({
  input,
  errors,
  setErrors,
}: ValidateFormFields) => {
  const hasFieldsWithErrors = Object.values(errors)?.some(
    (error) => error.length > 0
  );
  const hasEmptyFields = Object.values(input).some(
    (value) => !value?.trim()?.length
  );
  if (!hasFieldsWithErrors && !hasEmptyFields) {
    return true;
  }

  if (hasEmptyFields) {
    setErrors((prev) => ({
      ...prev,
      name: !input.name.trim().length ? [GENERAL.REQUIRED] : prev.name,
      email: !input.email.trim().length ? [GENERAL.REQUIRED] : prev.email,
      license: !input.license.trim().length ? [GENERAL.REQUIRED] : prev.license,
      password: !input.password.trim().length
        ? [GENERAL.REQUIRED]
        : prev.password,
      confirmPassword: !input.confirmPassword.trim().length
        ? [GENERAL.REQUIRED]
        : prev.confirmPassword,
    }));
  }

  return false;
};
