import React, { FormEvent, useState } from "react";
import RegisterFormHeader from "../register-form-header";
import TextInput from "@/components/ui/text-input";
import PasswordInput from "@/components/ui/password-input";
import Select from "@/components/ui/select";
import {
  faBriefcase,
  faPerson,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { GENERIC_ERROR_MESSAGE, SUPPLIER_TYPE_OPTIONS } from "./constants";
import { REGISTER_AS_SUPPLIER } from "@/lib/sektor-api/mutations";
import { useMutation } from "@apollo/client";
import { useRegistrationStore } from "@/store/registration";
import { SupplierFormInput, SupplierFormInputErrors } from "./types";
import { REGISTER_STEPS } from "@/constants/register";
import { toast } from "react-toastify";
import { handleSupplierFormInputChange, validateFormFields } from "./helpers";

interface SupplierFormProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  setIsSubmittingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SupplierForm = ({ formRef, setIsSubmittingForm }: SupplierFormProps) => {
  const [registerAsSupplier, { loading }] = useMutation(REGISTER_AS_SUPPLIER);

  const setCurrentRegistrationStep = useRegistrationStore(
    (state) => state.setCurrentRegistrationStep
  );
  const setNewUser = useRegistrationStore((state) => state.setNewUser);

  const [input, setInput] = useState<SupplierFormInput>({
    name: "",
    email: "",
    serviceType: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<SupplierFormInputErrors>({
    name: [],
    email: [],
    serviceType: [],
    password: [],
    confirmPassword: [],
  });

  const handleInputChange = (
    event:
      | FormEvent<HTMLInputElement | HTMLSelectElement>
      | { currentTarget: { name: string; value: string } }
  ) => {
    handleSupplierFormInputChange({ input, event, setInput, setErrors });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidForm = validateFormFields({ input, errors, setErrors });
    if (!isValidForm) return;

    setIsSubmittingForm(true);
    const { name, email, password, serviceType } = input;
    registerAsSupplier({
      variables: {
        input: {
          name,
          email,
          password,
          serviceType,
        },
      },
    })
      .then(() => {
        setNewUser({ email, name });
        formRef.current?.reset();
        const nextRegistrationStep = REGISTER_STEPS.SentEmailVerification;
        setCurrentRegistrationStep(nextRegistrationStep);
      })
      .catch((error) => {
        toast.error(error?.message || GENERIC_ERROR_MESSAGE);
      })
      .finally(() => {
        setIsSubmittingForm(false);
      });
  };

  return (
    <section>
      <RegisterFormHeader />

      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        autoComplete="off"
        spellCheck="false"
        className="flex flex-col gap-4 items-start justify-center mt-4 lg:my-8 xl:grid xl:grid-cols-2 xl:gap-y-8 xl:gap-x-8"
      >
        <TextInput
          name="name"
          icon={faPerson}
          placeholder="Nombres y apellidos"
          error={Boolean(errors.name.length)}
          errors={errors.name}
          disabled={loading}
          onChange={handleInputChange}
          value={input.name}
        />
        <TextInput
          name="email"
          icon={faUser}
          placeholder="Correo electrónico"
          error={Boolean(errors.email.length)}
          errors={errors.email}
          disabled={loading}
          onChange={handleInputChange}
          value={input.email}
        />
        <PasswordInput
          name="password"
          placeholder="Contraseña"
          autoComplete="new-password"
          error={Boolean(errors.password.length)}
          errors={errors.password}
          disabled={loading}
          onChange={handleInputChange}
          value={input.password}
        />
        <PasswordInput
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirmar contraseña"
          error={Boolean(errors.confirmPassword.length)}
          errors={errors.confirmPassword}
          disabled={loading}
          onChange={handleInputChange}
          value={input.confirmPassword}
        />
        <Select
          name="serviceType"
          icon={faBriefcase}
          value={input.serviceType}
          options={SUPPLIER_TYPE_OPTIONS}
          disabled={loading}
          onChange={handleInputChange}
          error={Boolean(errors.serviceType.length)}
          errors={errors.serviceType}
        />
      </form>
    </section>
  );
};

export default SupplierForm;
