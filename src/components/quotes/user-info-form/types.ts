import { FormEvent } from "react";

export interface UserInfoFormInput {
  name: string;
  email: string;
  state: string;
  city: string;
  phone: string;
  phoneCode: string;
  segment: string;
}

export interface UserInfoFormInputErrors {
  name: string[];
  email: string[];
  state: string[];
  city: string[];
  phone: string[];
  phoneCode: string[];
  segment: string[];
}

export interface HandleUserInfoFormInputChangeParams {
  input: UserInfoFormInput;
  event: FormEvent<HTMLInputElement | HTMLSelectElement>;
  setInput: (value: React.SetStateAction<UserInfoFormInput>) => void;
  setErrors: (value: React.SetStateAction<UserInfoFormInputErrors>) => void;
}

export interface ValidateFormFields {
  input: UserInfoFormInput;
  errors: UserInfoFormInputErrors;
  setErrors: (value: React.SetStateAction<UserInfoFormInputErrors>) => void;
}
