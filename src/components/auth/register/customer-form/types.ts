import { Dayjs } from "dayjs";
import { FormEvent } from "react";

export interface CustomerFormInput {
  name: string;
  email: string;
  sex: string;
  birthdate: Dayjs | null;
  password: string;
  confirmPassword: string;
}

export interface CustomerFormInputErrors {
  name: string[];
  email: string[];
  sex: string[];
  birthdate: string[];
  password: string[];
  confirmPassword: string[];
}

export interface HandleCustomerFormInputChangeParams {
  input: CustomerFormInput;
  event:
    | FormEvent<HTMLInputElement | HTMLSelectElement>
    | { currentTarget: { name: string; value: string } };
  setInput: (value: React.SetStateAction<CustomerFormInput>) => void;
  setErrors: (value: React.SetStateAction<CustomerFormInputErrors>) => void;
}

export interface ValidateFormFields {
  input: CustomerFormInput;
  errors: CustomerFormInputErrors;
  setErrors: (value: React.SetStateAction<CustomerFormInputErrors>) => void;
}
