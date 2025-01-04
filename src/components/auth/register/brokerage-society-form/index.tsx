import { REGISTER_AS_BROKERAGE_SOCIETY } from "@/lib/sektor-api/mutations";
import { useRegistrationStore } from "@/store/registration";
import { useMutation } from "@apollo/client";
import React, { FormEvent, useState } from "react";
import {
  BrokerageSocietyFormInput,
  BrokerageSocietyFormInputErrors,
} from "./types";
import {
  handleBrokerageSocietyFormInputChange,
  validateFormFields,
} from "./helpers";
import { GENERIC_ERROR_MESSAGE } from "./constants";
import { toast } from "react-toastify";
import RegisterFormHeader from "../register-form-header";
import TextInput from "@/components/ui/text-input";
import PasswordInput from "@/components/ui/password-input";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import { REGISTER_STEPS } from "@/constants/register";
import {
  faAddressCard,
  faBuilding,
  faHashtag,
  faPerson,
  faPhone,
  faUser,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { DEFAULT_PHONE_CODE, PHONE_CODE_OPTIONS } from "@/constants/forms";

interface BrokerageSocietyFormProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  setIsSubmittingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const BrokerageSocietyForm = ({
  formRef,
  setIsSubmittingForm,
}: BrokerageSocietyFormProps) => {
  const [registerAsBrokerageSociety, { loading }] = useMutation(
    REGISTER_AS_BROKERAGE_SOCIETY
  );

  const setNewUser = useRegistrationStore((state) => state.setNewUser);
  const setCurrentRegistrationStep = useRegistrationStore(
    (state) => state.setCurrentRegistrationStep
  );

  const [input, setInput] = useState<BrokerageSocietyFormInput>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    license: "SCSMP-",
    rif: "",
    contactName: "",
    contactPhone: "",
    contactPhoneCode: DEFAULT_PHONE_CODE,
    contactPosition: "",
  });

  const [errors, setErrors] = useState<BrokerageSocietyFormInputErrors>({
    name: [],
    email: [],
    password: [],
    confirmPassword: [],
    license: [],
    rif: [],
    contactName: [],
    contactPhone: [],
    contactPhoneCode: [],
    contactPosition: [],
  });

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleBrokerageSocietyFormInputChange({
      input,
      event,
      setInput,
      setErrors,
    });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidForm = validateFormFields({ input, errors, setErrors });
    if (!isValidForm) return;

    const {
      rif,
      name,
      email,
      license,
      password,
      contactName,
      contactPhone,
      contactPosition,
      contactPhoneCode,
    } = input;
    const phoneWithCode = `${contactPhoneCode}${contactPhone}`;

    setIsSubmittingForm(true);
    registerAsBrokerageSociety({
      variables: {
        input: {
          rif,
          name,
          email,
          license,
          password,
          contact: {
            name: contactName,
            phone: phoneWithCode,
            position: contactPosition,
          },
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
      >
        <div className="flex flex-col gap-4 items-start justify-center mt-4 lg:my-8 xl:grid xl:grid-cols-2 xl:gap-y-8 xl:gap-x-8">
          <TextInput
            name="name"
            icon={faBuilding}
            placeholder="Nombre de la empresa"
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
          <TextInput
            name="contactName"
            icon={faPerson}
            placeholder="Nombre persona contacto"
            error={Boolean(errors.contactName.length)}
            errors={errors.contactName}
            disabled={loading}
            onChange={handleInputChange}
            value={input.contactName}
          />
          <TextInput
            name="contactPosition"
            icon={faUserTie}
            placeholder="Cargo"
            error={Boolean(errors.contactPosition.length)}
            errors={errors.contactPosition}
            disabled={loading}
            onChange={handleInputChange}
            value={input.contactPosition}
          />
        </div>
        <div className="flex flex-col gap-4 items-start justify-center mt-4 lg:mb-8 xl:grid xl:grid-cols-2 xl:gap-y-8 xl:gap-x-8">
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
            errors={errors.contactPhone}
            selectProps={{
              name: "contactPhoneCode",
              icon: faPhone,
              value: input.contactPhoneCode,
              wrapperClassName: "w-64",
              className: "border-r-0",
              options: PHONE_CODE_OPTIONS,
              disabled: loading,
              onChange: handleInputChange,
              error: Boolean(errors.contactPhoneCode.length),
            }}
            textInputProps={{
              name: "contactPhone",
              placeholder: "Teléfono",
              type: "tel",
              error: Boolean(errors.contactPhone.length),
              disabled: loading,
              onChange: handleInputChange,
              maxLength: 10,
              value: input.contactPhone,
            }}
          />
          <TextInput
            name="rif"
            icon={faAddressCard}
            placeholder="RIF-"
            error={Boolean(errors.rif.length)}
            errors={errors.rif}
            maxLength={15}
            disabled={loading}
            onChange={handleInputChange}
            value={input.rif}
          />
          <TextInput
            name="license"
            icon={faHashtag}
            placeholder="SCSMP-"
            maxLength={12}
            error={Boolean(errors.license.length)}
            errors={errors.license}
            disabled={loading}
            onChange={handleInputChange}
            value={input.license}
            popoverProps={{
              content: (
                <p className="text-xs max-w-xs text-white font-century-gothic">
                  Ingresa tus credenciales como<b> sociedad de corretaje. </b>
                  Con el formato<b> SCSMP-123456</b>
                </p>
              ),
            }}
          />
        </div>
      </form>
    </section>
  );
};

export default BrokerageSocietyForm;
