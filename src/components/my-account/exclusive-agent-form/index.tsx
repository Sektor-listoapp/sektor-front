import React, { useEffect, useState } from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import { Mutation, Query } from "@/lib/sektor-api/__generated__/types";
import { useMutation, useQuery } from "@apollo/client";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import Select from "@/components/ui/select";
import UploadInput from "@/components/ui/upload-input";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@/store/auth";
import { toast } from "react-toastify";
import Image from "next/image";
import { Space } from "antd";
import Button from "@/components/ui/button";
import LocalClientsInput from "../local-clients-input";
import StudiesInput from "../studies-input";
import { UPDATE_EXCLUSIVE_AGENT } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import {
  faAddressCard,
  faHashtag,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  DEFAULT_PHONE_CODE,
  IDENTIFICATION_TYPE_OPTIONS,
  LICENSE_TYPE_OPTIONS,
  MODALITY_OPTIONS,
  PHONE_CODE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
} from "@/constants/forms";
import {
  COUNTRY_BY_CODE_QUERY,
  PUBLIC_BROKERAGE_SOCIETY_QUERY,
  PUBLIC_EXCLUSIVE_AGENT_BY_ID_QUERY,
  PUBLIC_EXCLUSIVE_AGENTS_QUERY,
  PUBLIC_INSURANCE_BROKERS_QUERY,
  PUBLIC_INSURANCE_COMPANIES_QUERY,
} from "@/lib/sektor-api/queries";

const ExclusiveAgentForm = () => {
  const userId = useAuthStore(useShallow((state) => state.user?.id));
  const [isUpdatingExclusiveAgent, setIsUpdatingExclusiveAgent] =
    useState(false);

  const {
    error: exclusiveAgentError,
    data: exclusiveAgentResponse,
    loading: loadingExclusiveAgent,
    refetch: refetchExclusiveAgent,
  } = useQuery<Query>(PUBLIC_EXCLUSIVE_AGENT_BY_ID_QUERY, {
    variables: { id: userId },
  });

  const [updateExclusiveAgent] = useMutation<Mutation>(UPDATE_EXCLUSIVE_AGENT);

  const {
    data: insuranceCompaniesResponse,
    loading: loadingInsuranceCompanies,
  } = useQuery<Query>(PUBLIC_INSURANCE_COMPANIES_QUERY);

  const { data: insuranceBrokersResponse, loading: loadingInsuranceBrokers } =
    useQuery<Query>(PUBLIC_INSURANCE_BROKERS_QUERY);

  const { data: exclusiveAgentsResponse, loading: loadingExclusiveAgents } =
    useQuery<Query>(PUBLIC_EXCLUSIVE_AGENTS_QUERY);

  const {
    data: brokerageSocietiesResponse,
    loading: loadingBrokerageSocieties,
  } = useQuery<Query>(PUBLIC_BROKERAGE_SOCIETY_QUERY);

  const { data: countryDataResponse, loading: isLoadingCountryData } =
    useQuery<Query>(COUNTRY_BY_CODE_QUERY, { variables: { code: "VE" } });

  const exclusiveAgent = exclusiveAgentResponse?.publicExclusiveAgentById;
  const exclusiveAgentClients = [...(exclusiveAgent?.clients || [])];
  const exclusiveAgentStudies = [...(exclusiveAgent?.studies || [])];

  const countryStates = countryDataResponse?.getCountryByCode?.states || [];
  const countryStateOptions = [
    ...countryStates?.map(({ id, name }) => ({
      label: name,
      value: id,
    })),
  ];

  const insuranceCompanies =
    insuranceCompaniesResponse?.publicInsuranceCompanies?.items || [];
  const insuranceCompanyOptions = [
    ...insuranceCompanies?.map(({ id, name, logoUrl }) => ({
      label: name,
      value: id,
      image: logoUrl,
    })),
  ];

  const insuranceBrokers =
    insuranceBrokersResponse?.publicInsuranceBrokers?.items || [];
  const insuranceBrokerOptions = [
    ...insuranceBrokers?.map(({ id, name, logoUrl }) => ({
      label: name,
      value: id,
      image: logoUrl,
    })),
  ];

  const exclusiveAgents =
    exclusiveAgentsResponse?.publicExclusiveAgents?.items || [];
  const exclusiveAgentOptions = [
    ...exclusiveAgents?.map(({ id, name, logoUrl }) => ({
      label: name,
      value: id,
      image: logoUrl,
    })),
  ];

  const brokerageSocieties =
    brokerageSocietiesResponse?.publicBrokerageSocieties?.items || [];
  const brokerageSocietyOptions = [
    ...brokerageSocieties?.map(({ id, name, logoUrl }) => ({
      label: name,
      value: id,
      image: logoUrl,
    })),
  ];

  const allies = [...(exclusiveAgent?.allies?.map(({ id }) => id) || [])];
  const phoneCodes = PHONE_CODE_OPTIONS.map(({ value }) => value);
  const userPhone = exclusiveAgent?.phone || "";
  const userPhoneCode =
    phoneCodes.find((code) => userPhone.startsWith(code)) || "";
  const userPhoneWithoutCode = userPhone.replace(userPhoneCode, "") || "";

  const [licenseType, license] = exclusiveAgent?.license?.split("-") || [];
  const [identificationType, identification] =
    exclusiveAgent?.identification?.split("-") || [];

  const [input, setInput] = useState({
    // required
    name: exclusiveAgent?.name || "",
    insuranceCompanies: [],
    license: license || "",
    licenseType: licenseType
      ? `${licenseType}-`
      : LICENSE_TYPE_OPTIONS[0].value,
    segment: exclusiveAgent?.lineOfBusiness || [],
    identification: identification || "",
    identificationType: identificationType
      ? `${identificationType}-`
      : IDENTIFICATION_TYPE_OPTIONS[0].value,
    modality: "",
    coverageState: [],
    yearsOfExperience: "",
    phone: userPhoneWithoutCode || "",
    phoneCode: userPhoneCode || DEFAULT_PHONE_CODE,
    logoUrl: "",
    // additional
    allies: allies || [],
  });

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const foundationYear = Number(exclusiveAgent?.foundationYear || 0);
    const yearsOfExperience = foundationYear > 0 ? currentYear - foundationYear : 0;
    const studies = exclusiveAgent?.studies
      ? exclusiveAgent?.studies.map(
          ({ id, title, institution, startDate, endDate, description }) => {
            return { id, title, institution, startDate, endDate, description };
          }
        )
      : [];
    const clients = exclusiveAgent?.clients
      ? exclusiveAgent?.clients.map(({ id, name, logoUrl }) => {
          return { id, name, logoUrl };
        })
      : [];
    const insuranceCompanies = (exclusiveAgent?.insuranceCompanies?.map(
      ({ id }) => id
    ) || []) as never[];

    window?.localStorage?.setItem(
      "sektor-local-studies",
      JSON.stringify(studies)
    );
    window?.localStorage?.setItem(
      "sektor-local-clients",
      JSON.stringify(clients)
    );

    setInput({
      name: exclusiveAgent?.name || "",
      insuranceCompanies: insuranceCompanies || [],
      license: license || "",
      licenseType: licenseType
        ? `${licenseType}-`
        : LICENSE_TYPE_OPTIONS[0].value,
      segment: exclusiveAgent?.lineOfBusiness || [],
      identification: identification || "",
      identificationType: identificationType
        ? `${identificationType}-`
        : IDENTIFICATION_TYPE_OPTIONS[0].value,
      modality: exclusiveAgent?.modality || "",
      coverageState: (exclusiveAgent?.coverageStates as never[]) || [],
      yearsOfExperience: String(yearsOfExperience) || "",
      phone: userPhoneWithoutCode || "",
      phoneCode: userPhoneCode || DEFAULT_PHONE_CODE,
      logoUrl: exclusiveAgent?.logoUrl || "",
      allies: [...(exclusiveAgent?.allies?.map(({ id }) => id) || [])],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exclusiveAgent]);

  const requiredFields = {
    name: Boolean(input.name.trim().length),
    insuranceCompanies: Boolean(input.insuranceCompanies.length),
    license: Boolean(input.license.trim().length),
    segment: Boolean(input.segment.length),
    identification: Boolean(input.identification.trim().length),
    modality: Boolean(input.modality.trim().length),
    coverageState: Boolean(input.coverageState.length),
    yearsOfExperience: Boolean(input.yearsOfExperience.trim().length),
    phone: Boolean(input.phone.trim().length),
    logoUrl: Boolean(input.logoUrl.trim().length),
  };

  const hasErrors = Object.values(requiredFields).some((field) => !field);

  if (exclusiveAgentError) {
    toast.error(
      exclusiveAgentError?.message ||
        "Ha ocurrido un error obteniendo la información de tu cuenta, intenta de nuevo más tarde"
    );
  }

  const handleInputChange = (
    field: keyof typeof input,
    value: string | string[] | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (field in input) {
      setInput((prev) => ({
        ...prev,
        [field]: value || "",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsUpdatingExclusiveAgent(true);

    const currentYear = new Date().getFullYear();
    const foundationYear = currentYear - Number(input?.yearsOfExperience || 0);
    const studies = window.localStorage.getItem("sektor-local-studies") ?? "[]";
    const clients = window.localStorage.getItem("sektor-local-clients") ?? "[]";

    updateExclusiveAgent({
      variables: {
        input: {
          id: userId,
          foundationYear,
          name: input?.name,
          allies: input?.allies,
          logoUrl: input?.logoUrl,
          modality: input?.modality,
          sex: exclusiveAgent?.sex,
          type: exclusiveAgent?.type,
          clients: JSON.parse(clients),
          studies: JSON.parse(studies),
          lineOfBusiness: input?.segment,
          coverageStates: input?.coverageState,
          phone: `${input?.phoneCode}${input?.phone}`,
          insuranceCompanies: input?.insuranceCompanies,
          license: `${input?.licenseType}${input?.license}`,
          recognitions: exclusiveAgent?.recognitions || [],
          identification: `${input?.identificationType}${input?.identification}`,
        },
      },
    })
      .then(() => {
        toast.success("Información actualizada correctamente");
        refetchExclusiveAgent();
      })
      .catch((error) => {
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      })
      .finally(() => setIsUpdatingExclusiveAgent(false));
  };

  return (
    <form
      className="py-5 w-full flex flex-col items-center justify-center gap-10 font-century-gothic"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="col-span-2 font-bold">Datos obligatorios</h3>

        <TextInput
          name="name"
          className="col-span-1"
          placeholder="Nombre completo"
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
        />

        <SelectMultiple
          wrapperClassName="w-full"
          selectProps={{
            disabled: loadingInsuranceCompanies || isUpdatingExclusiveAgent,
            placeholder: "Compañias con las que trabajas",
            options: insuranceCompanyOptions,
            value: input?.insuranceCompanies,
            notFoundContent: "No hay opciones disponibles",
            onChange: (value) => handleInputChange("insuranceCompanies", value),
            optionRender: (option) => (
              <Space>
                <Image
                  src={option.data.image || "/images/placeholder.png"}
                  alt={"Aliado"}
                  width={40}
                  height={40}
                />
                {option.data.label}
              </Space>
            ),
          }}
        />

        <SelectWithTextInput
          selectProps={{
            name: "licenseType",
            icon: faHashtag,
            value: input?.licenseType,
            wrapperClassName: "w-56",
            className: "border-r-0",
            options: LICENSE_TYPE_OPTIONS,
            disabled: loadingExclusiveAgent || isUpdatingExclusiveAgent,
            onChange: (e) => handleInputChange("licenseType", e?.target?.value),
          }}
          textInputProps={{
            name: "license",
            placeholder: "123456",
            onChange: (e) => handleInputChange("license", e?.target?.value),
            disabled: loadingExclusiveAgent || isUpdatingExclusiveAgent,
            minLength: 6,
            maxLength: 6,
            value: input?.license,
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

        <SelectMultiple
          wrapperClassName="w-full"
          selectProps={{
            placeholder: "Ramos con los que trabajas",
            options: SELECT_LINE_OF_BUSINESS_OPTIONS,
            notFoundContent: "No hay opciones disponibles",
            disabled: loadingExclusiveAgent || isUpdatingExclusiveAgent,
            value: input?.segment,
            onChange: (value) => handleInputChange("segment", value),
          }}
        />

        <SelectWithTextInput
          selectProps={{
            name: "identificationType",
            icon: faAddressCard,
            value: input?.identificationType,
            wrapperClassName: "w-36",
            disabled: loadingExclusiveAgent || isUpdatingExclusiveAgent,
            className: "border-r-0",
            options: IDENTIFICATION_TYPE_OPTIONS,
            onChange: (e) =>
              handleInputChange("identificationType", e?.target?.value),
          }}
          textInputProps={{
            name: "identification",
            placeholder: "1234567890",
            minLength: 6,
            maxLength: 10,
            disabled: loadingExclusiveAgent || isUpdatingExclusiveAgent,
            value: input?.identification,
            onChange: (e) =>
              handleInputChange("identification", e?.target?.value),
          }}
          popoverProps={{
            content: (
              <p className="text-xs max-w-xs text-white font-century-gothic">
                Ingresa tus documento de identidad con el formato{" "}
                <b>V-123456789</b> o<b> J-123456789</b>
              </p>
            ),
          }}
        />

        <Select
          name="modality"
          value={input?.modality}
          options={MODALITY_OPTIONS}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          onChange={(e) => handleInputChange("modality", e?.target?.value)}
        />

        <SelectMultiple
          wrapperClassName="w-full"
          selectProps={{
            placeholder: "Zona de alcance (estado)",
            options: countryStateOptions,
            notFoundContent: "No hay opciones disponibles",
            disabled:
              loadingExclusiveAgent ||
              isUpdatingExclusiveAgent ||
              isLoadingCountryData,
            value: input?.coverageState,
            onChange: (value) => handleInputChange("coverageState", value),
          }}
        />

        <TextInput
          name="yearsOfExperience"
          placeholder="Años de experiencia"
          type="number"
          min={0}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          value={input?.yearsOfExperience}
          onChange={(e) =>
            handleInputChange("yearsOfExperience", e?.target?.value)
          }
        />

        <SelectWithTextInput
          selectProps={{
            name: "phoneCode",
            icon: faPhone,
            value: input?.phoneCode,
            wrapperClassName: "w-60",
            className: "border-r-0",
            disabled: loadingExclusiveAgent || isUpdatingExclusiveAgent,
            options: PHONE_CODE_OPTIONS,
            onChange: (e) => handleInputChange("phoneCode", e.target.value),
          }}
          textInputProps={{
            name: "phone",
            placeholder: "Teléfono",
            type: "tel",
            disabled: loadingExclusiveAgent || isUpdatingExclusiveAgent,
            onChange: (e) => handleInputChange("phone", e.target.value),
            maxLength: 10,
            value: input?.phone,
          }}
        />

        <UploadInput
          imageUrl={input?.logoUrl || ""}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          onImageChange={(url: string) => handleInputChange("logoUrl", url)}
        />
      </div>

      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="w-full font-bold col-span-2">Datos adicionales</h3>

        <LocalClientsInput
          clients={exclusiveAgentClients}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
        />

        <SelectMultiple
          wrapperClassName="w-full col-span-1"
          selectProps={{
            disabled:
              loadingExclusiveAgent ||
              loadingInsuranceBrokers ||
              loadingExclusiveAgents ||
              loadingBrokerageSocieties ||
              isUpdatingExclusiveAgent,
            placeholder: "Aliados",
            options: [
              {
                label: "Corredores de seguros",
                options: insuranceBrokerOptions,
              },
              {
                label: "Agentes exclusivos",
                options: exclusiveAgentOptions,
              },
              {
                label: "Sociedades de corretaje",
                options: brokerageSocietyOptions,
              },
            ],
            value: input?.allies,
            notFoundContent: "No hay opciones disponibles",
            showSearch: true,
            optionFilterProp: "label",
            onChange: (value) => handleInputChange("allies", value),
            optionRender: (option) => (
              <Space>
                <Image
                  src={option.data.image || "/images/placeholder.png"}
                  alt={"Aliado"}
                  width={40}
                  height={40}
                />
                {option.data.label}
              </Space>
            ),
          }}
        />

        <StudiesInput
          studies={exclusiveAgentStudies}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
        />
      </div>

      <Button
        variant="solid-blue"
        className="w-fit px-7"
        type="submit"
        disabled={
          hasErrors || isUpdatingExclusiveAgent || loadingExclusiveAgent
        }
        loading={isUpdatingExclusiveAgent}
      >
        Guardar Información
      </Button>
    </form>
  );
};

export default ExclusiveAgentForm;
