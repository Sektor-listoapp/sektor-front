import React, { FormEvent, useState } from "react";
import RegisterFormHeader from "../register-form-header";
import TextInput from "@/components/ui/text-input";
import PasswordInput from "@/components/ui/password-input";
import {
  faPerson,
  faUser,
  faPersonHalfDress,
} from "@fortawesome/free-solid-svg-icons";
import Select from "@/components/ui/select";
import DatePicker from "@/components/ui/date-picker";
import { REGISTER_AS_CUSTOMER } from "@/lib/sektor-api/mutations";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { CustomerFormInput, CustomerFormInputErrors } from "./types";
import { GENERIC_ERROR_MESSAGE, SELECT_GENRE_OPTIONS } from "./constants";
import { handleCustomerFormInputChange, validateFormFields } from "./helpers";
import { useRegistrationStore } from "@/store/registration";
import { REGISTER_STEPS } from "@/constants/register";

interface CustomerFormProps {
  formRef: React.RefObject<HTMLFormElement | null>;
  setIsSubmittingForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomerForm = ({ formRef, setIsSubmittingForm }: CustomerFormProps) => {
  const [registerAsCustomer, { loading }] = useMutation(REGISTER_AS_CUSTOMER);

  const setCurrentRegistrationStep = useRegistrationStore(
    (state) => state.setCurrentRegistrationStep
  );
  const setNewUser = useRegistrationStore((state) => state.setNewUser);

  const [input, setInput] = useState<CustomerFormInput>({
    name: "",
    email: "",
    sex: "",
    birthdate: null,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<CustomerFormInputErrors>({
    name: [],
    email: [],
    sex: [],
    birthdate: [],
    password: [],
    confirmPassword: [],
  });

  const handleInputChange = (
    event:
      | FormEvent<HTMLInputElement | HTMLSelectElement>
      | { currentTarget: { name: string; value: string } }
  ) => {
    handleCustomerFormInputChange({ input, event, setInput, setErrors });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValidForm = validateFormFields({ input, errors, setErrors });
    if (!isValidForm) return;

    setIsSubmittingForm(true);
    const { name, email, birthdate, password, sex } = input;
    registerAsCustomer({
      variables: {
        input: {
          name,
          email,
          password,
          birthdate,
          sex,
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
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-4 w-full xl:col-span-2 xl:grid-cols-2 xl:gap-x-8">
          <DatePicker
            name="birthdate"
            wrapperClassName="col-span-4 sm:col-span-2 w-full xl:col-span-1"
            placeholder="Fecha de nacimiento"
            disabled={loading}
            onChange={(_, dateString) =>
              handleInputChange({
                currentTarget: {
                  name: "birthdate",
                  value: dateString as string,
                },
              })
            }
            error={Boolean(errors.birthdate.length)}
            errors={errors.birthdate}
            maxDate={dayjs()}
            format="DD/MM/YYYY"
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
        </div>
      </form>
    </section>
  );
};

export default CustomerForm;
