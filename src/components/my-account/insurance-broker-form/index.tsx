import React, { useEffect, useState } from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import { Mutation, OrganizationOfficeInputType, Query } from "@/lib/sektor-api/__generated__/types";
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
import { ADMIN_UPDATE_USER_EMAIL, UPDATE_EMAIL, UPDATE_INSURANCE_BROKER } from "@/lib/sektor-api/mutations";
// import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import {
  faAddressCard,
  faHashtag,
  faPersonHalfDress,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  DEFAULT_PHONE_CODE,
  IDENTIFICATION_TYPE_OPTIONS,
  LICENSE_TYPE_OPTIONS,
  MODALITY_OPTIONS,
  PHONE_CODE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
  SELECT_GENRE_OPTIONS,
} from "@/constants/forms";
import {
  COUNTRY_BY_CODE_QUERY,
  ORGANIZATION_BY_ID_QUERY,
  PUBLIC_BROKERAGE_SOCIETY_QUERY,
  PUBLIC_EXCLUSIVE_AGENTS_QUERY,
  PUBLIC_INSURANCE_BROKER_BY_ID_QUERY,
  PUBLIC_INSURANCE_BROKERS_QUERY,
  PUBLIC_INSURANCE_COMPANIES_QUERY,
} from "@/lib/sektor-api/queries";
import SektorFullVerticalLogo from "@/components/icons/sektor-full-vertical-logo";
import { FormProps } from "@/types/forms";
import LocalOfficesInput from "../local-offices-input";
import SocialMediaInput from "../social-media-input";
// import { UPDATE_ORGANIZATION_LOGO } from "@/lib/sektor-api/mutations/my-account/update-organization-logo";
import { UPDATE_INSURANCE_BROKER_CLIENT_LOGO } from "@/lib/sektor-api/mutations/my-account/update-insurance-broker-client-logo";

type InsuranceBrokerIdProps = FormProps;

interface InsuranceBrokerInputType {
  name: string;
  email: string;
  insuranceCompanies: never[];
  license: string;
  licenseType: string;
  segment: string[];
  identification: string;
  identificationType: string;
  modality: string;
  coverageState: never[];
  yearsOfExperience: string;
  phone: string;
  phoneCode: string;
  logoUrl: string;
  logoFile: File | null;
  allies: string[];
  sex: string;
  password: string;
}

const InsuranceBrokerForm = ({ userId }: InsuranceBrokerIdProps) => {
  const loggedUserId = useAuthStore(useShallow((state) => state.user?.id));
  const targetUserId = userId || loggedUserId;
  const [isUpdatingInsuranceBroker, setIsUpdatingInsuranceBroker] =
    useState(false);

  const {
    error: insuranceBrokerError,
    data: insuranceBrokerResponse,
    loading: loadingInsuranceBroker,
    refetch: refetchInsuranceBroker,
  } = useQuery<Query>(PUBLIC_INSURANCE_BROKER_BY_ID_QUERY, {
    variables: { id: targetUserId },
  });

  const insuranceBroker = insuranceBrokerResponse?.publicInsuranceBrokerById;
  const insuranceBrokerClients = [...(insuranceBroker?.clients || [])];
  const insuranceBrokerStudies = [...(insuranceBroker?.studies || [])];

  const {
    data: organizationResponse,
  } = useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
    variables: { id: targetUserId },
    skip: !targetUserId,
  });


  const [updateInsuranceBroker] = useMutation<Mutation>(
    UPDATE_INSURANCE_BROKER
  );
  const [updateEmailMutation] = useMutation<Mutation>(UPDATE_EMAIL);
  const [adminUpdateUserEmailMutation] = useMutation<Mutation>(ADMIN_UPDATE_USER_EMAIL);

  // const [updateOrganizationLogo] = useMutation<Mutation>(UPDATE_ORGANIZATION_LOGO);
  const [updateInsuranceBrokerClientLogo] = useMutation<Mutation>(UPDATE_INSURANCE_BROKER_CLIENT_LOGO);

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

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoHasError, setLogoHasError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasSocialLinks, setHasSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);



  const countryStates = countryDataResponse?.getCountryByCode?.states || [];
  const countryStateOptions = [
    ...countryStates
      ?.map(({ id, name }) => ({
        label: name,
        value: id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  const insuranceCompanies =
    insuranceCompaniesResponse?.publicInsuranceCompanies?.items || [];



  const insuranceCompanyOptions = [
    ...insuranceCompanies
      ?.map(({ id, name, logoUrl }) => ({
        label: name,
        value: id,
        image: logoUrl,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
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



  const allies = [...(insuranceBroker?.allies?.map(({ id }) => id) || [])];
  const phoneCodes = PHONE_CODE_OPTIONS.map(({ value }) => value);
  const userPhone = insuranceBroker?.phone || "";
  const userPhoneCode =
    phoneCodes.find((code) => userPhone.startsWith(code)) || DEFAULT_PHONE_CODE;
  const userPhoneWithoutCode = userPhoneCode ? userPhone.substring(userPhoneCode.length) : userPhone;

  const [licenseType, license] = insuranceBroker?.license?.split("-") || [];
  const [identificationType, identification] =
    insuranceBroker?.identification?.split("-") || [];

  const [input, setInput] = useState<InsuranceBrokerInputType>({
    // required
    name: insuranceBroker?.name || "",
    email: organizationResponse?.organizationById?.email || "",
    insuranceCompanies: [],
    license: license || "",
    licenseType: licenseType
      ? `${licenseType}-`
      : LICENSE_TYPE_OPTIONS[0].value,
    segment: insuranceBroker?.lineOfBusiness || [],
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
    logoFile: null,
    // additional
    allies: allies || [],
    sex: insuranceBroker?.sex || "",
    // socialMediaLinks: JSON.parse(window?.localStorage?.getItem("social-links") || "[]"),
    password: "",
  });

  // const handleUpdateLogo = async (organizationId: string, logoFile: File) => {
  //   try {
  //     const { data } = await updateOrganizationLogo({
  //       variables: {
  //         id: organizationId,
  //         logo: logoFile
  //       }
  //     });
  //     console.log(data);
  //     console.log("Logo actualizado:", data?.updateOrganizationLogo);
  //   } catch (error) {
  //     console.error("Error al actualizar logo:", error);
  //   }
  // };

  const handleUpdateClientLogo = async (clientId: string, logoFile: File, organizationId: string) => {
    console.log("clientId", clientId);
    console.log("logoFile", logoFile);
    console.log("organizationId", organizationId);
    try {
      const { data } = await updateInsuranceBrokerClientLogo({
        variables: { clientId, logo: logoFile, organizationId }
      });

      console.log(data);
      console.log("Logo actualizado:", data?.updateInsuranceBrokerClientLogo);
    } catch (error) {
      console.error("Error al actualizar logo:", error);
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const foundationYear = Number(insuranceBroker?.foundationYear || 0);
    const yearsOfExperience = currentYear - foundationYear;
    const studies = insuranceBroker?.studies
      ? insuranceBroker?.studies.map(
        ({ id, title, institution, startDate, endDate, description }) => {
          return { id, title, institution, startDate, endDate, description };
        }
      )
      : [];
    const clients = insuranceBroker?.clients
      ? insuranceBroker?.clients.map(({ id, name, logoUrl }) => {
        return { id, name, logoUrl };
      })
      : [];
    const insuranceCompanies = (insuranceBroker?.insuranceCompanies?.map(
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


  
    if (typeof window !== "undefined") {
      const existingOffices = window.localStorage.getItem("sektor-local-offices");
      if (!existingOffices || existingOffices === "[]") {
        window.localStorage.setItem(
          "sektor-local-offices",
          JSON.stringify(insuranceBroker?.offices || [])
        );
      }
    }

    window?.localStorage?.setItem(
      "social-links",
      JSON.stringify(insuranceBroker?.socialMediaLinks || [])
    );
    console.log(insuranceBroker);

    setInput({
      name: insuranceBroker?.name || "",
      email: organizationResponse?.organizationById?.email || "",
      insuranceCompanies: insuranceCompanies || [],
      license: license || "",
      licenseType: licenseType
        ? `${licenseType}-`
        : LICENSE_TYPE_OPTIONS[0].value,
      segment: insuranceBroker?.lineOfBusiness || [],
      identification: identification || "",
      identificationType: identificationType
        ? `${identificationType}-`
        : IDENTIFICATION_TYPE_OPTIONS[0].value,
      modality: insuranceBroker?.modality || "",
      coverageState: (insuranceBroker?.coverageStates as never[]) || [],
      yearsOfExperience: String(yearsOfExperience) || "",
      phone: userPhoneWithoutCode || "",
      phoneCode: userPhoneCode || DEFAULT_PHONE_CODE,
      logoUrl: insuranceBroker?.logoUrl || "",
      logoFile: null,
      allies: [...(insuranceBroker?.allies?.map(({ id }) => id) || [])],
      sex: insuranceBroker?.sex || "",
      password: "",
      // socialMediaLinks: JSON.parse(window?.localStorage?.getItem("social-links") || "[]"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insuranceBroker, organizationResponse]);

  const requiredFields = {
    name: Boolean(input.name.trim().length),
    email: Boolean(input.email.trim().length),
    insuranceCompanies: Boolean(input.insuranceCompanies.length),
    license: Boolean(input.license.trim().length),
    segment: Boolean(input.segment.length),
    identification: Boolean(input.identification.trim().length),
    modality: Boolean(input.modality.trim().length),
    coverageState: Boolean(input.coverageState.length),
    yearsOfExperience: Boolean(
      input.yearsOfExperience.trim().length &&
      Number(input.yearsOfExperience) > 0
    ),
    phone: Boolean(input.phone.trim().length),
    logoUrl: Boolean(input.logoUrl.trim().length),
    sex: Boolean(input.sex.trim().length),
  };

  const hasErrors = Object.values(requiredFields).some((field) => !field);

  if (insuranceBrokerError) {
    toast.error(
      insuranceBrokerError?.message ||
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const originalEmail = organizationResponse?.organizationById?.email || "";
    const isSelfUpdate = loggedUserId === targetUserId;
    const emailChanged = Boolean(input.email && input.email !== originalEmail);

    try {
      if (emailChanged) {
        if (isSelfUpdate) {
          if (!input.password?.trim()?.length) {
            toast.error("Debes introducir tu contraseña para actualizar el correo");
            setIsUpdatingInsuranceBroker(false);
            return;
          }
          const { data } = await updateEmailMutation({
            variables: { input: { newEmail: input.email, password: input.password } },
          });
          if (!data?.updateEmail?.success) {
            throw new Error(data?.updateEmail?.message || "No se pudo actualizar el correo");
          }
        } else {
          const { data } = await adminUpdateUserEmailMutation({
            variables: { input: { userId: targetUserId as string, newEmail: input.email, skipVerification: true } },
          });
          if (!data?.adminUpdateUserEmail?.success) {
            throw new Error(data?.adminUpdateUserEmail?.message || "No se pudo actualizar el correo (admin)");
          }
        }
      }
    } catch (err: unknown) {
      console.error("Email update error:", err);
      const errorMessage = (err as { message?: string })?.message || "No se pudo actualizar el correo";
      toast.error(errorMessage);
      setIsUpdatingInsuranceBroker(false);
      return;
    }

    setIsUpdatingInsuranceBroker(true);

    const currentYear = new Date().getFullYear();
    const foundationYear = currentYear - Number(input?.yearsOfExperience || 0);
    const studies = window.localStorage.getItem("sektor-local-studies") ?? "[]";
    const clients = window.localStorage.getItem("sektor-local-clients") ?? "[]";
    const localClientLogos = JSON.parse(window.localStorage.getItem("sektor-local-client-logo") ?? "{}");

    const offices = window.localStorage.getItem("sektor-local-offices") ?? "[]";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedOffices = JSON.parse(offices).map((office: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename: _, address, ...restOfficeProps } = office;
      return {
        ...restOfficeProps,
        address: {
          cityId: address?.cityId || address?.city?.id,
          countryId: address?.countryId || address?.country?.id,
          stateId: address?.stateId || address?.state?.id,
          street: address?.street,
        },
      };
    });

    const socialMediaLinks = window.localStorage.getItem("social-links") ?? "[]";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedSocialMediaLinks = JSON.parse(socialMediaLinks).map((link: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, ...restLinkProps } = link;
      return {
        platform: restLinkProps.platform,
        url: restLinkProps.url,
      };
    });

    const mutationVariables = {
      input: {
        id: targetUserId,
        foundationYear,
        name: input?.name,
        allies: input?.allies,
        logoUrl: input?.logoUrl,
        modality: input?.modality,
        sex: input?.sex,
        type: insuranceBroker?.type,
        clients: JSON.parse(clients),
        studies: JSON.parse(studies),
        lineOfBusiness: input?.segment,
        coverageStates: input?.coverageState,
        phone: input?.phone?.startsWith('+') ? input?.phone : `${input?.phoneCode || DEFAULT_PHONE_CODE}${input?.phone}`,
        insuranceCompanies: input?.insuranceCompanies,
        license: `${input?.licenseType}${input?.license}`.replace(/--/g, '-'),
        recognitions: insuranceBroker?.recognitions || [],
        identification: `${input?.identificationType}${input?.identification}`,
        offices: formattedOffices || [],
        socialMediaLinks: formattedSocialMediaLinks || [],
      },
    };

    try {
      const response = await updateInsuranceBroker({
        variables: mutationVariables,
      });
      console.log('Insurance broker update success response:', response);
      toast.success("Información actualizada correctamente");
      refetchInsuranceBroker();

      // Subir imágenes de clientes después de guardar los clientes
      const organizationId = insuranceBroker?.id || "";
      const savedClients = mutationVariables.input.clients;
      for (const client of savedClients) {
        const file = localClientLogos[client.id];
        if (file) {
          await handleUpdateClientLogo(client.id, file, organizationId || "");
        }
      }
    } catch (error) {
      console.error('=== INSURANCE BROKER FORM ERROR DEBUG ===');
      console.error('Error object:', error);
    } finally {
      setIsUpdatingInsuranceBroker(false);
    }
  };


  console.log('input?.logoFile', input?.logoFile)



  const showLoading = loadingInsuranceBroker;

  return (
    <form
      className="py-5 w-full flex flex-col items-center justify-center gap-10 font-century-gothic relative"
      onSubmit={handleSubmit}
    >
      {showLoading && (
        <div className="w-full absolute left-0 top-0 z-50 bg-white bg-opacity-90 h-full flex justify-center">
          <SektorFullVerticalLogo className="w-20 animate-pulse md:w-24" />
        </div>
      )}

      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="col-span-2 font-bold">Datos obligatorios</h3>

        <TextInput
          name="name"
          className="col-span-1"
          error={!requiredFields.name}
          placeholder="Nombre completo"
          showFloatingLabel
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
        />

        <div className="col-span-1 flex flex-col gap-2">
        <TextInput
          name="email"
          className="col-span-1"
          error={!requiredFields.email}
          placeholder="Correo electrónico"
          showFloatingLabel
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
          onChange={(e) => handleInputChange("email", e.target.value)}
          value={input?.email}
        />
          {(() => { const originalEmail = organizationResponse?.organizationById?.email || ""; const isSelfUpdate = loggedUserId === targetUserId; const emailChanged = Boolean(input.email && input.email !== originalEmail); return (isSelfUpdate && emailChanged); })() && (
            <div className="col-span-1">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  spellCheck="false"
                  className="py-3 px-5 pr-12 block w-full bg-white border border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none font-century-gothic"
                  placeholder="Contraseña para confirmar"
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  value={input?.password || ""}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 my-auto right-3 text-blue-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <span className="sr-only">Toggle password</span>
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                    {showPassword ? (
                      <path d="M572.52 241.4C518.9 135.5 407.8 64 288 64S57.1 135.5 3.48 241.4a48.07 48.07 0 000 29.2C57.1 376.5 168.2 448 288 448s230.9-71.5 284.52-177.4a48.07 48.07 0 000-29.2zM288 400c-97.05 0-183.2-57.37-233.7-144C104.8 169.4 190.9 112 288 112c97.05 0 183.2 57.37 233.7 144C471.2 342.6 385.1 400 288 400zm0-240a96 96 0 1096 96 96.14 96.14 0 00-96-96z" />
                    ) : (
                      <path d="M572.52 241.4C518.9 135.5 407.8 64 288 64S57.1 135.5 3.48 241.4a48.07 48.07 0 000 29.2C57.1 376.5 168.2 448 288 448s230.9-71.5 284.52-177.4a48.07 48.07 0 000-29.2zM288 400c-97.05 0-183.2-57.37-233.7-144C104.8 169.4 190.9 112 288 112c97.05 0 183.2 57.37 233.7 144C471.2 342.6 385.1 400 288 400zm0-208a112 112 0 10112 112A112.12 112.12 0 00288 192z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <SelectMultiple
          label="Compañias con las que trabajas"
          showFloatingLabel
          wrapperClassName="w-full"
          error={!requiredFields.insuranceCompanies}
          selectProps={{
            disabled: loadingInsuranceCompanies || isUpdatingInsuranceBroker,
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
            disabled: loadingInsuranceBroker || isUpdatingInsuranceBroker,
            onChange: (e) => handleInputChange("licenseType", e?.target?.value),
          }}
          textInputProps={{
            name: "license",
            placeholder: "123456",
            error: !requiredFields.license,
            onChange: (e) => handleInputChange("license", e?.target?.value),
            disabled: loadingInsuranceBroker || isUpdatingInsuranceBroker,
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
          label="Ramos con los que trabajas"
          showFloatingLabel
          wrapperClassName="w-full"
          error={!requiredFields.segment}
          selectProps={{
            placeholder: "Ramos con los que trabajas",
            options: SELECT_LINE_OF_BUSINESS_OPTIONS,
            notFoundContent: "No hay opciones disponibles",
            disabled: loadingInsuranceBroker || isUpdatingInsuranceBroker,
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
            disabled: loadingInsuranceBroker || isUpdatingInsuranceBroker,
            className: "border-r-0",
            options: IDENTIFICATION_TYPE_OPTIONS,
            onChange: (e) =>
              handleInputChange("identificationType", e?.target?.value),
          }}
          textInputProps={{
            name: "identification",
            placeholder: "1234567890",
            error: !requiredFields.identification,
            minLength: 6,
            maxLength: 10,
            disabled: loadingInsuranceBroker || isUpdatingInsuranceBroker,
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
          error={!requiredFields.modality}
          options={MODALITY_OPTIONS}
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
          onChange={(e) => handleInputChange("modality", e?.target?.value)}
        />

        <Select
          name="sex"
          value={input?.sex}
          options={SELECT_GENRE_OPTIONS}
          icon={faPersonHalfDress}
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
          onChange={(e) => handleInputChange("sex", e.target.value)}
          error={!requiredFields.sex}
        />

        <SelectMultiple
          label="Zona de alcance (estado)"
          showFloatingLabel
          wrapperClassName="w-full"
          error={!requiredFields.coverageState}
          selectProps={{
            placeholder: "Zona de alcance (estado)",
            options: countryStateOptions,
            notFoundContent: "No hay opciones disponibles",
            disabled:
              loadingInsuranceBroker ||
              isUpdatingInsuranceBroker ||
              isLoadingCountryData,
            value: input?.coverageState,
            onChange: (value) => handleInputChange("coverageState", value),
          }}
        />

        <TextInput
          name="yearsOfExperience"
          placeholder="Años de experiencia"
          showFloatingLabel
          error={!requiredFields.yearsOfExperience}
          type="number"
          min={0}
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
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
            disabled: loadingInsuranceBroker || isUpdatingInsuranceBroker,
            options: PHONE_CODE_OPTIONS,
            onChange: (e) => handleInputChange("phoneCode", e.target.value),
          }}
          textInputProps={{
            name: "phone",
            placeholder: "Teléfono",
            type: "tel",
            error: !requiredFields.phone,
            disabled: loadingInsuranceBroker || isUpdatingInsuranceBroker,
            onChange: (e) => handleInputChange("phone", e.target.value),
            maxLength: 10,
            value: input?.phone,
          }}
        />

        <UploadInput
          imageUrl={input?.logoUrl || ""}
          error={!requiredFields.logoUrl}
          setError={setLogoHasError}
          setIsUploadingLogo={setIsUploadingLogo}
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker || isUploadingLogo}
          onImageChange={(url: string | null, file?: File) => {
            handleInputChange("logoUrl", url || '');
            if (file) {
              setInput(prev => {
                const newState = { ...prev, logoFile: file };
                return newState;
              });
            }
          }}
          placeholder="Subir logo del corredor"
          aspect={1}
        />
        <SocialMediaInput
          setHasSocialLinks={setHasSocialLinks}
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
        />
      </div>

      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="w-full font-bold col-span-2">Datos adicionales</h3>

        <LocalOfficesInput
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          offices={insuranceBroker?.offices?.map((office: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { __typename: _, address, ...restOfficeProps } = office;
            return {
              ...restOfficeProps,
              address: {
                cityId: address?.cityId || address?.city?.id,
                countryId: address?.countryId || address?.country?.id,
                stateId: address?.stateId || address?.state?.id,
                street: address?.street,
              },
            };
          }) as unknown as OrganizationOfficeInputType[]}
        />

        <LocalClientsInput
          clients={insuranceBrokerClients}
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
        />

        <SelectMultiple
          label="Aliados"
          showFloatingLabel
          wrapperClassName="w-full col-span-1"
          selectProps={{
            disabled:
              loadingInsuranceBroker ||
              loadingInsuranceBrokers ||
              loadingExclusiveAgents ||
              loadingBrokerageSocieties ||
              isUpdatingInsuranceBroker,
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
          studies={insuranceBrokerStudies}
          disabled={loadingInsuranceBroker || isUpdatingInsuranceBroker}
        />
      </div>

      <Button
        variant="solid-blue"
        className="w-fit px-7"
        type="submit"
        disabled={
          hasErrors ||
          isUpdatingInsuranceBroker ||
          loadingInsuranceBroker ||
          isUploadingLogo ||
          logoHasError
        }
        loading={isUpdatingInsuranceBroker}
      >
        Guardar Información
      </Button>
    </form>
  );
};

export default InsuranceBrokerForm;
