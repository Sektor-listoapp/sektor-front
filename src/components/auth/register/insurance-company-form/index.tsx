import { REGISTER_AS_INSURANCE_COMPANY } from "@/lib/sektor-api/mutations";
import { useRegistrationStore } from "@/store/registration";
import { useMutation } from "@apollo/client";
import { FormEvent, useState } from "react";
import {
  InsuranceCompanyFormInput,
  InsuranceCompanyFormInputErrors,
} from "./types";
import {
  handleInsuranceCompanyFormInputChange,
  validateFormFields,
} from "./helpers";
import { REGISTER_STEPS } from "@/constants/register";
import {
  DEFAULT_PHONE_CODE,
  GENERIC_ERROR_MESSAGE,
  PHONE_CODE_OPTIONS,
} from "./constants";
import { toast } from "react-toastify";
import TextInput from "@/components/ui/text-input";
import {
  faBuilding,
  faPerson,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import SelectWithTextInput from "@/components/ui/select-with-text-input";

interface InsuranceCompanyFormProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  setIsSubmittingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const InsuranceCompanyForm = ({
  formRef,
  setIsSubmittingForm,
}: InsuranceCompanyFormProps) => {
  const [registerAsInsuranceCompany, { loading }] = useMutation(
    REGISTER_AS_INSURANCE_COMPANY
  );

  const setCurrentRegistrationStep = useRegistrationStore(
    (state) => state.setCurrentRegistrationStep
  );

  const setNewUser = useRegistrationStore((state) => state.setNewUser);

  const [input, setInput] = useState<InsuranceCompanyFormInput>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    phoneCode: DEFAULT_PHONE_CODE,
    instagramUrl: "",
  });

  const [errors, setErrors] = useState<InsuranceCompanyFormInputErrors>({
    contactName: [],
    email: [],
    phone: [],
    instagramUrl: [],
    phoneCode: [],
    companyName: [],
  });

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleInsuranceCompanyFormInputChange({
      event,
      setInput,
      setErrors,
    });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidForm = validateFormFields({ input, errors, setErrors });
    if (!isValidForm) return;

    const { contactName, email, companyName, instagramUrl, phone, phoneCode } =
      input;
    const phoneWithCode = `${phoneCode}${phone}`;

    setIsSubmittingForm(true);
    registerAsInsuranceCompany({
      variables: {
        input: {
          companyName,
          contactName,
          email,
          phone: phoneWithCode,
          instagramUrl,
        },
      },
    })
      .then(() => {
        setNewUser({ email, name: contactName });
        e?.currentTarget?.reset();
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
      <header className="w-full text-center text-balance flex flex-col items-center gap-2 justify-center md:my-4 lg:gap-4">
        <h1 className="text-2xl lg:text-4xl">¡Eres una compañía de seguros!</h1>
        <p className="font-century-gothic">
          Por favor, dejame los siguientes datos, te contactare en la brevedad
          posible para tu registro
        </p>
      </header>

      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        autoComplete="off"
        spellCheck="false"
        className="flex flex-col gap-4 items-start justify-center mt-6 max-w-sm mx-auto lg:my-8"
      >
        <TextInput
          name="companyName"
          icon={faBuilding}
          placeholder="Nombre de la compañía"
          error={Boolean(errors.companyName.length)}
          errors={errors.companyName}
          disabled={loading}
          onChange={handleInputChange}
          value={input.companyName}
        />
        <TextInput
          name="contactName"
          icon={faPerson}
          placeholder="Nombre de la persona de contacto"
          error={Boolean(errors.contactName.length)}
          errors={errors.contactName}
          disabled={loading}
          onChange={handleInputChange}
          value={input.contactName}
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
        <SelectWithTextInput
          errors={errors.phone}
          selectProps={{
            name: "phoneCode",
            icon: faPhone,
            value: input.phoneCode,
            wrapperClassName: "w-60",
            className: "border-r-0",
            options: PHONE_CODE_OPTIONS,
            disabled: loading,
            onChange: handleInputChange,
            error: Boolean(errors.phoneCode.length),
          }}
          textInputProps={{
            name: "phone",
            placeholder: "Teléfono",
            type: "tel",
            error: Boolean(errors.phone.length),
            disabled: loading,
            onChange: handleInputChange,
            maxLength: 10,
            value: input.phone,
          }}
        />
        <TextInput
          name="instagramUrl"
          icon={faInstagram}
          placeholder="Instagram"
          error={Boolean(errors.instagramUrl.length)}
          errors={errors.instagramUrl}
          disabled={loading}
          onChange={handleInputChange}
          value={input.instagramUrl}
        />
      </form>
    </section>
  );
};

export default InsuranceCompanyForm;
