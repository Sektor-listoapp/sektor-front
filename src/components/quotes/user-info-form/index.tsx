import React, { FormEvent, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { DEFAULT_PHONE_CODE, PHONE_CODE_OPTIONS } from "@/constants/forms";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import { useQuery } from "@apollo/client";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries";
import { getLocationOptions } from "@/utils/organizations";
import Select from "@/components/ui/select";
import { SEGMENT_OPTIONS } from "./constants";
import { useRouter } from "next/router";
import { UserInfoFormInput, UserInfoFormInputErrors } from "./types";
import {
  faPhone,
  faPerson,
  faSliders,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { handleUserInfoFormInputChange, validateFormFields } from "./helpers";
import { useQuoteStore } from "@/store/quotes";
import { ROUTES } from "@/constants/router";

const UserInfoForm = () => {
  const router = useRouter();
  const organizationQuery = (router?.query?.organization || "") as string;
  const setQuoteRequestCustomer = useQuoteStore(
    (state) => state.setQuoteRequestCustomer
  );
  const { data: countryData, loading: isLoadingCountryData } = useQuery<Query>(
    COUNTRY_BY_CODE_QUERY,
    { variables: { code: "VE" } }
  );
  const locationOptions = getLocationOptions(countryData?.getCountryByCode, true);

  const [input, setInput] = useState<UserInfoFormInput>({
    name: "",
    location: locationOptions[0].value,
    phone: "",
    phoneCode: DEFAULT_PHONE_CODE,
    segment: SEGMENT_OPTIONS[0].value,
  });

  const [errors, setErrors] = useState<UserInfoFormInputErrors>({
    name: [],
    location: [],
    phone: [],
    phoneCode: [],
    segment: [],
  });

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

    const { name, location, phone, phoneCode, segment } = input;
    const phoneWithCode = `${phoneCode}${phone}`;

    setQuoteRequestCustomer({
      name,
      location,
      segment,
      phone: phoneWithCode,
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
      className="w-full flex flex-col items-center gap-8 bg-blue-200 rounded-3xl px-2 p-8 max-w-md md:px-8"
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

      <Select
        name="location"
        wrapperClassName="w-full"
        options={locationOptions}
        error={Boolean(errors.location.length)}
        errors={errors.location}
        value={input.location}
        disabled={isLoadingCountryData}
        onChange={handleInputChange}
        icon={faLocationDot}
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

      <Button variant="solid-blue" className="w-full max-w-xs" type="submit">
        Continuar
      </Button>
    </form>
  );
};

export default UserInfoForm;
