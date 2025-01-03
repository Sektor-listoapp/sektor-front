import { FormEvent } from "react";

export interface SupplierFormInput {
  name: string;
  email: string;
  serviceType: string;
  password: string;
  confirmPassword: string;
}

export interface SupplierFormInputErrors {
  name: string[];
  email: string[];
  serviceType: string[];
  password: string[];
  confirmPassword: string[];
}

export interface HandleSupplierFormInputChangeParams {
  input: SupplierFormInput;
  event:
    | FormEvent<HTMLInputElement | HTMLSelectElement>
    | { currentTarget: { name: string; value: string } };
  setInput: (value: React.SetStateAction<SupplierFormInput>) => void;
  setErrors: (value: React.SetStateAction<SupplierFormInputErrors>) => void;
}

export interface ValidateFormFields {
  input: SupplierFormInput;
  errors: SupplierFormInputErrors;
  setErrors: (value: React.SetStateAction<SupplierFormInputErrors>) => void;
}
