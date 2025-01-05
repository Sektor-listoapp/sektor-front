import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import {
  HandleInsuranceCompanyFormInputChangeParams,
  ValidateFormFields,
} from "./types";

const { GENERAL, EMAIL, PHONE } = INPUT_ERROR_MESSAGES;

export const handleInsuranceCompanyFormInputChange = ({
  event,
  setInput,
  setErrors,
}: HandleInsuranceCompanyFormInputChangeParams) => {
  const inputsToAvoidTrimming = ["companyName", "contactName"];
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

  if (name === "phone") {
    setErrors((prev) => ({
      ...prev,
      phone: REGEX.PHONE.test(trimmedValue) ? [] : [PHONE.LENGTH],
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
      companyName: !input.companyName.trim().length
        ? [GENERAL.REQUIRED]
        : prev.companyName,
      contactName: !input.contactName.trim().length
        ? [GENERAL.REQUIRED]
        : prev.companyName,
      email: !input.email.trim().length ? [GENERAL.REQUIRED] : prev.email,
      phone: !input.phone.trim().length ? [GENERAL.REQUIRED] : prev.phone,
      instagramUrl: !input.instagramUrl.trim().length
        ? [GENERAL.REQUIRED]
        : prev.instagramUrl,
    }));
  }

  return false;
};
