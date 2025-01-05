import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import {
  HandleBrokerageSocietyFormInputChangeParams,
  ValidateFormFields,
} from "./types";

const { PASSWORD, GENERAL, EMAIL, PHONE, SCSMP } = INPUT_ERROR_MESSAGES;

export const handleBrokerageSocietyFormInputChange = ({
  input,
  event,
  setInput,
  setErrors,
}: HandleBrokerageSocietyFormInputChangeParams) => {
  const inputsToAvoidTrimming = ["name", "contactName", "contactPosition"];
  const { name, value } = event.currentTarget;
  const trimmedValue = inputsToAvoidTrimming.includes(name)
    ? value
    : value.trim();
  setInput((prev) => ({ ...prev, [name]: trimmedValue }));

  if (name === "email") {
    setErrors((prev) => ({
      ...prev,
      email: REGEX.EMAIL.test(trimmedValue) ? [] : [EMAIL.EXAMPLE],
    }));
    return;
  }
  if (name === "license") {
    const licenseCode = trimmedValue?.split("-")[1];
    const hasSixCharacters = licenseCode?.length === 6;
    const hasCorrectFormat = REGEX.SCSMP_CODE.test(trimmedValue);

    setErrors((prev) => ({
      ...prev,
      [name]: [
        hasSixCharacters ? "" : SCSMP.LENGTH,
        hasCorrectFormat ? "" : SCSMP.FORMAT,
      ].filter(Boolean),
    }));
    return;
  }
  if (name === "contactPhone") {
    setErrors((prev) => ({
      ...prev,
      [name]: REGEX.PHONE.test(trimmedValue) ? [] : [PHONE.LENGTH],
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
      contactName: !input.contactName.trim().length
        ? [GENERAL.REQUIRED]
        : prev.contactName,
      contactPosition: !input.contactPosition.trim().length
        ? [GENERAL.REQUIRED]
        : prev.contactPosition,
      rif: !input.rif.trim().length ? [GENERAL.REQUIRED] : prev.rif,
      contactPhone: !input.contactPhone.trim().length
        ? [GENERAL.REQUIRED]
        : prev.contactPhone,
      license: !REGEX.SCSMP_CODE.test(input.license)
        ? [SCSMP.FORMAT]
        : prev.license,
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
