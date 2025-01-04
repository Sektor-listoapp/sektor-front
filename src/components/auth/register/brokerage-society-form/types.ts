import { FormEvent } from "react";

export interface BrokerageSocietyFormInput {
  name: string;
  email: string;
  license: string;
  rif: string;
  password: string;
  confirmPassword: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactPhoneCode: string;
}

export interface BrokerageSocietyFormInputErrors {
  name: string[];
  email: string[];
  license: string[];
  rif: string[];
  password: string[];
  confirmPassword: string[];
  contactName: string[];
  contactPosition: string[];
  contactPhone: string[];
  contactPhoneCode: string[];
}

export interface HandleBrokerageSocietyFormInputChangeParams {
  input: BrokerageSocietyFormInput;
  event: FormEvent<HTMLInputElement | HTMLSelectElement>;
  setInput: (value: React.SetStateAction<BrokerageSocietyFormInput>) => void;
  setErrors: (
    value: React.SetStateAction<BrokerageSocietyFormInputErrors>
  ) => void;
}

export interface ValidateFormFields {
  input: BrokerageSocietyFormInput;
  errors: BrokerageSocietyFormInputErrors;
  setErrors: (
    value: React.SetStateAction<BrokerageSocietyFormInputErrors>
  ) => void;
}
