import React, { FormEvent, useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { DEFAULT_PHONE_CODE, PHONE_CODE_OPTIONS } from "@/constants/forms";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import { useQuery } from "@apollo/client";
import { Query, UserGroups } from "@/lib/sektor-api/__generated__/types";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries";
import Select from "@/components/ui/select";
import { SEGMENT_OPTIONS } from "./constants";
import { useRouter } from "next/router";
import { UserInfoFormInput, UserInfoFormInputErrors } from "./types";
import {
  faPhone,
  faPerson,
  faSliders,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { handleUserInfoFormInputChange, validateFormFields } from "./helpers";
import { useQuoteStore } from "@/store/quotes";
import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/router";
import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";

const { EMAIL } = INPUT_ERROR_MESSAGES;

const { Customer } = UserGroups;

const UserInfoForm = () => {
  const router = useRouter();
  const organizationQuery = (router?.query?.organization || "") as string;
  const loggedUser = useAuthStore((state) => state.user);
  const setQuoteRequestCustomer = useQuoteStore(
    (state) => state.setQuoteRequestCustomer
  );
  const { data: countryData, loading: isLoadingCountryData } = useQuery<Query>(
    COUNTRY_BY_CODE_QUERY,
    { variables: { code: "VE" } }
  );

  const countryStates = countryData?.getCountryByCode?.states || [];

  const stateOptions = useMemo(
    () => [
      { label: "Estado", value: "", disabled: true },
      ...countryStates
        .map((state) => ({
          label: state?.name || "",
          value: state?.id ? String(state.id) : "",
        }))
        .filter((option) => option.value)
        .sort((a, b) => a.label.localeCompare(b.label)),
    ],
    [countryStates]
  );

  const [selectedStateId, setSelectedStateId] = useState<string>("");

  const cityOptions = useMemo(() => {
    const selectedState = countryStates.find(
      (s) => String(s.id) === selectedStateId
    );

    if (!selectedState?.cities?.length) {
      return [{ label: "Ciudad", value: "", disabled: true }];
    }

    return [
      { label: "Ciudad", value: "", disabled: true },
      ...selectedState.cities
        .map((city) => ({
          label: city?.name || "",
          value: city?.id ? String(city.id) : "",
        }))
        .filter((option) => option.value)
        .sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [countryStates, selectedStateId]);

  const [input, setInput] = useState<UserInfoFormInput>({
    name: "",
    email: "",
    state: "",
    city: "",
    phone: "",
    phoneCode: DEFAULT_PHONE_CODE,
    segment: SEGMENT_OPTIONS[0].value,
  });

  const [errors, setErrors] = useState<UserInfoFormInputErrors>({
    name: [],
    email: [],
    state: [],
    city: [],
    phone: [],
    phoneCode: [],
    segment: [],
  });

 
  useEffect(() => {
    if (!loggedUser || loggedUser.group !== Customer) return;

    setInput((prev) => ({
      ...prev,
      name: loggedUser.name || prev.name,
      email: loggedUser.email || prev.email,
    }));
  }, [loggedUser]);

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleUserInfoFormInputChange({
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

    const { name, city, phone, phoneCode, segment, email } = input;
    const phoneWithCode = phone.startsWith('+') ? phone : `${phoneCode || DEFAULT_PHONE_CODE}${phone}`;

    setQuoteRequestCustomer({
      name,
      email,
      segment,
      phone: phoneWithCode,
    
      location: city,
    });

    router.push({
      pathname: `${ROUTES.QUOTES}/${organizationQuery}`,
      query: { segment },
    });
  };

  return (
    <form
      spellCheck="false"
      autoComplete="off"
      onSubmit={handleFormSubmit}
      className="w-11/12 flex flex-col items-center gap-4 max-w-lg mt-5"
    >
      <TextInput
        name="name"
        icon={faPerson}
        placeholder="Nombres y apellidos"
        error={Boolean(errors.name.length)}
        errors={errors.name}
        onChange={handleInputChange}
        value={input.name}
      />

      <TextInput
        name="email"
        icon={faUser}
        error={Boolean(errors?.email?.length)}
        errors={errors?.email}
        onChange={(e: FormEvent<HTMLInputElement>) => {
          const { value } = e.currentTarget;
          const trimmedValue = value.trim();
          setInput((prev) => ({ ...prev, email: trimmedValue }));
          const errors = REGEX.EMAIL.test(trimmedValue) ? [] : [EMAIL.EXAMPLE];
          setErrors((prev) => ({ ...prev, email: errors }));
        }}
        value={input.email}
        placeholder="Correo electrónico"
      />

      <div className="w-full flex flex-col gap-4">
        <Select
          name="state"
          wrapperClassName="w-full"
          options={stateOptions}
          error={Boolean(errors.state.length)}
          errors={errors.state}
          value={input.state}
          disabled={isLoadingCountryData}
          onChange={(event: FormEvent<HTMLSelectElement>) => {
            const { value } = event.currentTarget;
            setSelectedStateId(value);
            setInput((prev) => ({
              ...prev,
              state: value,
              city: "",
            }));
            setErrors((prev) => ({
              ...prev,
              state: [],
              city: [],
            }));
          }}
          icon={faLocationDot}
        />
        <Select
          name="city"
          wrapperClassName="w-full"
          options={cityOptions}
          error={Boolean(errors.city.length)}
          errors={errors.city}
          value={input.city}
          disabled={isLoadingCountryData || !selectedStateId}
          onChange={(event: FormEvent<HTMLSelectElement>) => {
            const { value } = event.currentTarget;
            setInput((prev) => ({
              ...prev,
              city: value,
            }));
            setErrors((prev) => ({
              ...prev,
              city: [],
            }));
          }}
          icon={faLocationDot}
        />
      </div>

      <SelectWithTextInput
        errors={errors.phone}
        selectProps={{
          name: "phoneCode",
          icon: faPhone,
          value: input.phoneCode,
          wrapperClassName: "w-60",
          className: "border-r-0",
          options: PHONE_CODE_OPTIONS,
          onChange: handleInputChange,
          error: Boolean(errors.phoneCode.length),
        }}
        textInputProps={{
          name: "phone",
          placeholder: "Teléfono",
          type: "tel",
          error: Boolean(errors.phone.length),
          onChange: handleInputChange,
          maxLength: 10,
          value: input.phone,
        }}
      />

      <Select
        name="segment"
        wrapperClassName="w-full"
        options={SEGMENT_OPTIONS}
        value={input.segment}
        error={Boolean(errors.segment.length)}
        errors={errors.segment}
        onChange={handleInputChange}
        icon={faSliders}
      />

      <Button variant="solid-blue" className="w-fit px-10 mt-5" type="submit">
        Siguiente
      </Button>
    </form>
  );
};

export default UserInfoForm;
