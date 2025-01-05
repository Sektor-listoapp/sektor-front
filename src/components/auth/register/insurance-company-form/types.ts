import { FormEvent } from "react";

export interface InsuranceCompanyFormInput {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  phoneCode: string;
  instagramUrl: string;
}

export interface InsuranceCompanyFormInputErrors {
  companyName: string[];
  contactName: string[];
  email: string[];
  phone: string[];
  phoneCode: string[];
  instagramUrl: string[];
}

export interface HandleInsuranceCompanyFormInputChangeParams {
  event: FormEvent<HTMLInputElement | HTMLSelectElement>;
  setInput: (value: React.SetStateAction<InsuranceCompanyFormInput>) => void;
  setErrors: (
    value: React.SetStateAction<InsuranceCompanyFormInputErrors>
  ) => void;
}

export interface ValidateFormFields {
  input: InsuranceCompanyFormInput;
  errors: InsuranceCompanyFormInputErrors;
  setErrors: (
    value: React.SetStateAction<InsuranceCompanyFormInputErrors>
  ) => void;
}
