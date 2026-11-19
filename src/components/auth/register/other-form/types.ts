import { FormEvent } from "react";

export interface OtherFormInput {
  name: string;
  email: string;
  phone: string;
  phoneCode: string;
  sex: string;
  password: string;
  confirmPassword: string;
}

export type OtherFormInputErrors = Record<keyof OtherFormInput, string[]>;

export interface HandleOtherFormInputChangeParams {
  input: OtherFormInput;
  event: FormEvent<HTMLInputElement | HTMLSelectElement>;
  setInput: (value: React.SetStateAction<OtherFormInput>) => void;
  setErrors: (value: React.SetStateAction<OtherFormInputErrors>) => void;
}

export interface ValidateOtherFormFields {
  input: OtherFormInput;
  errors: OtherFormInputErrors;
  setErrors: (value: React.SetStateAction<OtherFormInputErrors>) => void;
}
