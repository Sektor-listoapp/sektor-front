import React, { FormEvent, useState } from "react";
import { REGISTER_AS_INSURANCE_BROKER } from "@/lib/sektor-api/mutations";
import { useRegistrationStore } from "@/store/registration";
import { useMutation } from "@apollo/client";
import {
  handleInsuranceBrokerFormInputChange,
  validateFormFields,
} from "./helpers";
import { REGISTER_STEPS } from "@/constants/register";
import { GENERIC_ERROR_MESSAGE, LICENSE_TYPE_OPTIONS } from "./constants";
import { toast } from "react-toastify";
import RegisterFormHeader from "../register-form-header";
import TextInput from "@/components/ui/text-input";
import PasswordInput from "@/components/ui/password-input";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import { faHashtag, faPerson, faPersonHalfDress, faUser } from "@fortawesome/free-solid-svg-icons";
import {
  InsuranceBrokerFormInput,
  InsuranceBrokerFormInputErrors,
} from "./types";
import Select from "@/components/ui/select";
import { SELECT_GENRE_OPTIONS } from "@/constants/forms/options";

interface InsuranceBrokerFormProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  setIsSubmittingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const InsuranceBrokerForm = ({
  formRef,
  setIsSubmittingForm,
}: InsuranceBrokerFormProps) => {
  const [registerAsInsuranceBroker, { loading }] = useMutation(
    REGISTER_AS_INSURANCE_BROKER
  );

  const setCurrentRegistrationStep = useRegistrationStore(
    (state) => state.setCurrentRegistrationStep
  );

  const setNewUser = useRegistrationStore((state) => state.setNewUser);

  const [input, setInput] = useState<InsuranceBrokerFormInput>({
    name: "",
    email: "",
    sex: "",
    license: "",
    licenseType: LICENSE_TYPE_OPTIONS[0].value,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<InsuranceBrokerFormInputErrors>({
    name: [],
    email: [],
    sex: [],
    license: [],
    licenseType: [],
    password: [],
    confirmPassword: [],
  });

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleInsuranceBrokerFormInputChange({ input, event, setInput, setErrors });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidForm = validateFormFields({ input, errors, setErrors });
    if (!isValidForm) return;

    const { name, email, password, sex, license, licenseType } = input;
    const formattedLicense = `${licenseType}${license}`;

    setIsSubmittingForm(true);
    registerAsInsuranceBroker({
      variables: {
        input: {
          name,
          email,
          sex,
          password,
          license: formattedLicense,
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
        <SelectWithTextInput
          errors={errors.license}
          selectProps={{
            name: "licenseType",
            icon: faHashtag,
            value: input.licenseType,
            wrapperClassName: "w-56",
            className: "border-r-0",
            options: LICENSE_TYPE_OPTIONS,
            disabled: loading,
            onChange: handleInputChange,
            error: Boolean(errors.licenseType.length),
          }}
          textInputProps={{
            name: "license",
            placeholder: "123456",
            error: Boolean(errors.license.length),
            disabled: loading,
            onChange: handleInputChange,
            minLength: 6,
            maxLength: 6,
            value: input.license,
          }}
          popoverProps={{
            content: (
              <p className="text-xs max-w-xs text-white font-century-gothic">
                Ingresa tus credenciales como <b>corredor de seguros. </b>Con el
                formato <b>CAA-123456</b> o <b>AAA-123456</b>
              </p>
            ),
          }}
        />

        <Select
          name="sex"
          wrapperClassName="col-span-4 sm:col-span-2 xl:col-span-1 xl:w-3/4"
          icon={faPersonHalfDress}
          value={input.sex}
          options={SELECT_GENRE_OPTIONS}
          disabled={loading}
          onChange={handleInputChange}
          error={Boolean(errors.sex.length)}
          errors={errors.sex}
        />
      </form>
    </section>
  );
};

export default InsuranceBrokerForm;
