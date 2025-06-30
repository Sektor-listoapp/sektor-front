import { FormEvent } from "react";

export interface ExclusiveAgentFormInput {
  name: string;
  email: string;
  sex: string;
  license: string;
  licenseType: string;
  password: string;
  confirmPassword: string;
}

export interface ExclusiveAgentFormInputErrors {
  name: string[];
  email: string[];
  sex: string[];
  license: string[];
  licenseType: string[];
  password: string[];
  confirmPassword: string[];
}

export interface HandleExclusiveAgentFormInputChangeParams {
  input: ExclusiveAgentFormInput;
  event: FormEvent<HTMLInputElement | HTMLSelectElement>;
  setInput: (value: React.SetStateAction<ExclusiveAgentFormInput>) => void;
  setErrors: (
    value: React.SetStateAction<ExclusiveAgentFormInputErrors>
  ) => void;
}

export interface ValidateFormFields {
  input: ExclusiveAgentFormInput;
  errors: ExclusiveAgentFormInputErrors;
  setErrors: (
    value: React.SetStateAction<ExclusiveAgentFormInputErrors>
  ) => void;
}
