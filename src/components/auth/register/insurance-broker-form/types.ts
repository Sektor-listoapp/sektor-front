import { FormEvent } from "react";

export interface InsuranceBrokerFormInput {
  name: string;
  email: string;
  license: string;
  licenseType: string;
  password: string;
  confirmPassword: string;
}

export interface InsuranceBrokerFormInputErrors {
  name: string[];
  email: string[];
  license: string[];
  licenseType: string[];
  password: string[];
  confirmPassword: string[];
}

export interface HandleInsuranceBrokerFormInputChangeParams {
  input: InsuranceBrokerFormInput;
  event: FormEvent<HTMLInputElement | HTMLSelectElement>;
  setInput: (value: React.SetStateAction<InsuranceBrokerFormInput>) => void;
  setErrors: (
    value: React.SetStateAction<InsuranceBrokerFormInputErrors>
  ) => void;
}

export interface ValidateFormFields {
  input: InsuranceBrokerFormInput;
  errors: InsuranceBrokerFormInputErrors;
  setErrors: (
    value: React.SetStateAction<InsuranceBrokerFormInputErrors>
  ) => void;
}
