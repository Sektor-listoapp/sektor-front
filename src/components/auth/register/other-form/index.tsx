import React, { FormEvent, useState } from "react";
import RegisterPhoneField from "../phone-field";
import { DEFAULT_PHONE_CODE } from "@/constants/forms";
import { REGISTER_AS_OTHER } from "@/lib/sektor-api/mutations";
import { useRegistrationStore } from "@/store/registration";
import { useMutation } from "@apollo/client";
import { handleOtherFormInputChange, validateOtherFormFields } from "./helpers";
import { REGISTER_STEPS } from "@/constants/register";
import { toast } from "react-toastify";
import RegisterFormHeader from "../register-form-header";
import TextInput from "@/components/ui/text-input";
import PasswordInput from "@/components/ui/password-input";
import Select from "@/components/ui/select";
import {
  faPerson,
  faPersonHalfDress,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { SELECT_GENRE_OPTIONS } from "@/constants/forms/options";
import { OtherFormInput, OtherFormInputErrors } from "./types";

const GENERIC_ERROR_MESSAGE =
  "Ocurrió un error al intentar crear tu cuenta, por favor intenta de nuevo más tarde.";

interface OtherFormProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  setIsSubmittingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const OtherForm = ({ formRef, setIsSubmittingForm }: OtherFormProps) => {
  const [registerAsOther, { loading }] = useMutation(REGISTER_AS_OTHER);

  const setCurrentRegistrationStep = useRegistrationStore(
    (state) => state.setCurrentRegistrationStep
  );
  const setNewUser = useRegistrationStore((state) => state.setNewUser);

  const [input, setInput] = useState<OtherFormInput>({
    name: "",
    email: "",
    phone: "",
    phoneCode: DEFAULT_PHONE_CODE,
    sex: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<OtherFormInputErrors>({
    name: [],
    email: [],
    phone: [],
    phoneCode: [],
    sex: [],
    password: [],
    confirmPassword: [],
  });

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleOtherFormInputChange({ input, event, setInput, setErrors });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidForm = validateOtherFormFields({ input, errors, setErrors });
    if (!isValidForm) return;

    const { name, email, password, sex, phone, phoneCode } = input;

    setIsSubmittingForm(true);
    registerAsOther({
      variables: {
        input: {
          name: name.trim(),
          email,
          phone: `${phoneCode}${phone}`,
          sex,
          password,
        },
      },
    })
      .then(() => {
        setNewUser({ email, name });
        formRef.current?.reset();
        setCurrentRegistrationStep(REGISTER_STEPS.SentEmailVerification);
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

      <p className="font-century-gothic text-sm text-center text-balance mt-3 lg:text-base">
        Registro para <b>personal técnico y comercial</b>, así como otros
        actores que hacen vida en el mercado asegurador y no tienen credencial.
      </p>

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
        <RegisterPhoneField
          phone={input.phone}
          phoneCode={input.phoneCode}
          errors={errors.phone}
          disabled={loading}
          onChange={handleInputChange}
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

export default OtherForm;
