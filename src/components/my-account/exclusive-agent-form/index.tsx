import React, { useEffect, useState } from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import { Mutation, OrganizationOfficeInputType, Query, StudyInputType, OrganizationClientType, SocialMediaLinkType } from "@/lib/sektor-api/__generated__/types";
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
import { ADMIN_UPDATE_USER_EMAIL, UPDATE_EMAIL, UPDATE_EXCLUSIVE_AGENT } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import {
  faAddressCard,
  faHashtag,
  faPersonHalfDress,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "@/components/ui/date-picker";
import dayjs from "dayjs";
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
  PUBLIC_EXCLUSIVE_AGENT_BY_ID_QUERY,
  PUBLIC_EXCLUSIVE_AGENTS_QUERY,
  PUBLIC_INSURANCE_BROKERS_QUERY,
  PUBLIC_INSURANCE_COMPANIES_QUERY,
} from "@/lib/sektor-api/queries";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { FormProps } from "@/types/forms";
import SocialMediaInput from "../social-media-input";
import LocalOfficesInput from "../local-offices-input";
import { UPDATE_ORGANIZATION_LOGO } from "@/lib/sektor-api/mutations/my-account/update-organization-logo";

type ExclusiveAgentIdProps = FormProps;

interface ExclusiveAgentInputType {
  name: string;
  email: string;
  insuranceCompanies: string[];
  license: string;
  licenseType: string;
  segment: string[];
  identification: string;
  identificationType: string;
  modality: string;
  coverageState: string[];
  yearsOfExperience: string;
  phone: string;
  phoneCode: string;
  logoUrl: string;
  logoFile: File | null;
  allies: string[];
  sex: string;
  password: string;
  birthDate: string | null;
}

const ExclusiveAgentForm = ({ userId }: ExclusiveAgentIdProps) => {
  const loggedUserId = useAuthStore(useShallow((state) => state.user?.id));
  const targetUserId = userId || loggedUserId;
  const [isUpdatingExclusiveAgent, setIsUpdatingExclusiveAgent] =
    useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [hasSocialLinks, setHasSocialLinks] = useState(false);
  console.log('hasSocialLinks: ', hasSocialLinks);
  const [showPassword, setShowPassword] = useState(false);

  const [offices, setOffices] = useState<OrganizationOfficeInputType[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinkType[]>([]);
  const [clients, setClients] = useState<OrganizationClientType[]>([]);
  const [studies, setStudies] = useState<StudyInputType[]>([]);

  const {
    error: exclusiveAgentError,
    data: exclusiveAgentResponse,
    loading: loadingExclusiveAgent,
    refetch: refetchExclusiveAgent,
  } = useQuery<Query>(PUBLIC_EXCLUSIVE_AGENT_BY_ID_QUERY, {
    variables: { id: targetUserId },
  });

  const {
    data: organizationResponse,
  } = useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
    variables: { id: targetUserId },
    skip: !targetUserId,
  });

  const [updateExclusiveAgent] = useMutation<Mutation>(UPDATE_EXCLUSIVE_AGENT);
  const [updateEmailMutation] = useMutation<Mutation>(UPDATE_EMAIL);
  const [adminUpdateUserEmailMutation] = useMutation<Mutation>(ADMIN_UPDATE_USER_EMAIL);
  const [updateOrganizationLogo] = useMutation<Mutation>(UPDATE_ORGANIZATION_LOGO);

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


  const allies = [...(exclusiveAgent?.allies?.map(({ id }) => id) || [])];
  const phoneCodes = PHONE_CODE_OPTIONS.map(({ value }) => value);
  const userPhone = exclusiveAgent?.phone || "";
  const userPhoneCode =
    phoneCodes.find((code) => userPhone.startsWith(code)) || DEFAULT_PHONE_CODE;
  const userPhoneWithoutCode = userPhoneCode ? userPhone.substring(userPhoneCode.length) : userPhone;

  const [licenseType, license] = exclusiveAgent?.license?.split("-") || [];
  const [identificationType, identification] =
    exclusiveAgent?.identification?.split("-") || [];

  const [input, setInput] = useState<ExclusiveAgentInputType>({
    // required
    name: exclusiveAgent?.name || "",
    email: organizationResponse?.organizationById?.email || "",
    insuranceCompanies: [],
    license: license || "",
    licenseType: licenseType || LICENSE_TYPE_OPTIONS[0].value,
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
    logoFile: null,
    // additional
    allies: allies || [],
    sex: exclusiveAgent?.sex || "",
    password: "",
    birthDate: exclusiveAgent?.birthDate || null,
  });

  const handleUpdateLogo = async (organizationId: string, logoFile: File) => {
    try {
      await updateOrganizationLogo({
        variables: {
          id: organizationId,
          logo: logoFile
        }
      });
    } catch (error) {
      console.error("Error al actualizar logo:", error);
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const foundationYear = Number(exclusiveAgent?.foundationYear || 0);
    const yearsOfExperience =
      foundationYear > 0 ? currentYear - foundationYear : 0;
    const formattedStudies = exclusiveAgent?.studies
      ? exclusiveAgent?.studies.map(
        ({ id, title, institution, startDate, endDate, description }) => {
          return { id, title, institution, startDate, endDate, description };
        }
      )
      : [];
    const formattedClients = exclusiveAgent?.clients
      ? exclusiveAgent?.clients.map(({ id, name, logoUrl }) => {
        return { id, name, logoUrl };
      })
      : [];
    const insuranceCompanies = (exclusiveAgent?.insuranceCompanies?.map(
      ({ id }) => id
    ) || []) as never[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedOffices = exclusiveAgent?.offices?.map((office: any) => {
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
    }) || [];

    setInput({
      name: exclusiveAgent?.name || "",
      email: organizationResponse?.organizationById?.email || "",
      insuranceCompanies: insuranceCompanies || [],
      license: license || "",
      licenseType: licenseType || LICENSE_TYPE_OPTIONS[0].value,
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
      sex: exclusiveAgent?.sex || "",
      logoFile: null,
      password: "",
      birthDate: exclusiveAgent?.birthDate ? (dayjs(exclusiveAgent.birthDate).isValid() ? dayjs(exclusiveAgent.birthDate).format("YYYY-MM-DD") : null) : null,
    });

    setOffices(formattedOffices || []);
    setSocialMediaLinks(exclusiveAgent?.socialMediaLinks || []);
    setClients(formattedClients);
    setStudies(formattedStudies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exclusiveAgent, organizationResponse]);

  const calculateAge = (birthDate: string | null): number | null => {
    if (!birthDate || !birthDate.trim()) return null;
    const birth = dayjs(birthDate);
    if (!birth.isValid()) return null;
    return dayjs().diff(birth, 'year');
  };

  const age = calculateAge(input.birthDate);
  const isBirthDateValid = Boolean(input.birthDate && input.birthDate.trim() !== "" && age !== null && age >= 18 && age <= 120);

  const requiredFields = {
    name: Boolean(input.name.trim().length),
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
    birthDate: isBirthDateValid,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const age = calculateAge(input.birthDate);
    if (input.birthDate && input.birthDate.trim() && (age === null || age < 18 || age > 120)) {
      if (age === null) {
        toast.error("La fecha de nacimiento no es válida");
      } else if (age < 18) {
        toast.error("Debes ser mayor de 18 años para registrarte");
      } else if (age > 120) {
        toast.error("La fecha de nacimiento no es válida");
      }
      return;
    }

    const originalEmail = organizationResponse?.organizationById?.email || "";
    const isSelfUpdate = loggedUserId === targetUserId;
    const emailChanged = Boolean(input.email && input.email !== originalEmail);

    try {
      if (emailChanged) {
        if (isSelfUpdate) {
          if (!input.password?.trim()?.length) {
            toast.error("Debes introducir tu contraseña para actualizar el correo");
            setIsUpdatingExclusiveAgent(false);
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
      const errorMessage = (err as { message?: string })?.message || GENERIC_TOAST_ERROR_MESSAGE;
      toast.error(errorMessage);
      setIsUpdatingExclusiveAgent(false);
      return;
    }

    setIsUpdatingExclusiveAgent(true);

    const currentYear = new Date().getFullYear();
    const foundationYear = currentYear - Number(input?.yearsOfExperience || 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedOffices = offices.map((office: any) => {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedSocialMediaLinks = socialMediaLinks.map((link: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, ...restLinkProps } = link;
      return {
        platform: restLinkProps.platform,
        url: restLinkProps.url,
      };
    });

    let birthDateForMutation: Date | undefined = undefined;
    if (input?.birthDate && input.birthDate.trim()) {
      birthDateForMutation = new Date(input.birthDate);
    }

    const mutationVariables = {
      input: {
        id: targetUserId,
        foundationYear,
        name: input?.name,
        allies: input?.allies,
        logoUrl: input?.logoUrl,
        modality: input?.modality,
        sex: input?.sex,
        type: exclusiveAgent?.type,
        clients: clients,
        studies: studies,
        lineOfBusiness: input?.segment,
        coverageStates: input?.coverageState,
        phone: input?.phone?.startsWith('+') ? input?.phone : `${input?.phoneCode || DEFAULT_PHONE_CODE}${input?.phone}`,
        insuranceCompanies: input?.insuranceCompanies,
        license: `${input?.licenseType}${input?.license}`,
        recognitions: (exclusiveAgent?.recognitions || []).map((recognition) => ({
          title: recognition.title,
          description: recognition.description,
          date: recognition.date ? new Date(recognition.date) : new Date(),
          giver: recognition.giver,
        })),
        identification: `${input?.identificationType}${input?.identification}`,
        socialMediaLinks: formattedSocialMediaLinks || [],
        offices: formattedOffices || [],
        birthDate: birthDateForMutation || undefined,
      },
    };

    if (input?.logoFile) {
      if (!targetUserId) {
        toast.error("No se pudo actualizar el logo, intenta de nuevo más tarde");
        return;
      }
      handleUpdateLogo(targetUserId, input.logoFile);
    }

    updateExclusiveAgent({
      variables: mutationVariables,
    })
      .then(() => {
        toast.success("Información actualizada correctamente");
        refetchExclusiveAgent();
      })
      .catch((error: unknown) => {
        const errorObj = error as {
          message?: string;
          graphQLErrors?: Array<{
            message?: string;
            extensions?: {
              code?: string;
              errors?: Record<string, string[]>;
            };
          }>;
        };

        const validationErrors: string[] = [];
        if (errorObj?.graphQLErrors && errorObj.graphQLErrors.length > 0) {
          errorObj.graphQLErrors.forEach((gqlError) => {
            if (gqlError?.extensions?.errors) {
              const errors = gqlError.extensions.errors;
              if (Array.isArray(errors)) {
                errors.forEach((err: { message?: string; field?: string }) => {
                  if (err?.message) {
                    validationErrors.push(err.message);
                  }
                });
              } else if (typeof errors === 'object') {
                Object.keys(errors).forEach((field) => {
                  const fieldErrors = errors[field];
                  if (Array.isArray(fieldErrors)) {
                    validationErrors.push(...fieldErrors);
                  } else if (typeof fieldErrors === 'string') {
                    validationErrors.push(fieldErrors);
                  } else if (typeof fieldErrors === 'object' && fieldErrors !== null) {
                    const errObj = fieldErrors as { message?: string };
                    if (errObj.message) {
                      validationErrors.push(errObj.message);
                    }
                  }
                });
              }
            }
          });
        }

        const errorMessage = validationErrors.length > 0
          ? validationErrors[0]
          : errorObj?.message || GENERIC_TOAST_ERROR_MESSAGE;

        toast.error(errorMessage);
      })
      .finally(() => setIsUpdatingExclusiveAgent(false));
  };

  const showLoading = loadingExclusiveAgent;

  return (
    <form
      className="py-5 w-full flex flex-col items-center justify-center gap-10 font-century-gothic relative"
      onSubmit={handleSubmit}
    >
      {showLoading && (
        <div className="w-full absolute left-0 top-0 z-50 bg-white bg-opacity-90 h-full flex justify-center">
          <FullScreenLoaderLogo className="w-20 md:w-24" />
        </div>
      )}
      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="col-span-2 font-bold">Datos obligatorios</h3>

        <TextInput
          name="name"
          className="col-span-1"
          placeholder="Nombre completo"
          showFloatingLabel
          error={!requiredFields.name}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
        />


        <div className="col-span-1 flex flex-col gap-2">
          <TextInput
            name="email"
            className="col-span-1"
            placeholder="Correo electrónico"
            showFloatingLabel
            error={!requiredFields.name}
            disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
            onChange={(e) => handleInputChange("email", e.target.value)}
            value={input?.email}
          />
          {(() => { const originalEmail = organizationResponse?.organizationById?.email || ""; const isSelfUpdate = loggedUserId === targetUserId; const emailChanged = Boolean(input.email && input.email !== originalEmail); return (isSelfUpdate && emailChanged); })() && (
            <div className="col-span-1" style={{ zIndex: 60 }}>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  spellCheck="false"
                  className="py-3 px-5 pr-12 block w-full bg-white border border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 font-century-gothic"
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
          label="Compañías con las que trabajas"
          showFloatingLabel
          wrapperClassName="w-full"
          error={!requiredFields.insuranceCompanies}
          selectProps={{
            disabled: loadingInsuranceCompanies || isUpdatingExclusiveAgent,
            placeholder: "Compañías con las que trabajas",
            options: insuranceCompanyOptions,
            value: input?.insuranceCompanies,
            notFoundContent: "No hay opciones disponibles",
            onChange: (value) => handleInputChange("insuranceCompanies", value),
            optionRender: (option) => (
              <Space>
                <Image
                  src={option.data.image || "/images/placeholder.webp"}
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
            error: !requiredFields.license,
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
          label="Ramos con los que trabajas"
          showFloatingLabel
          error={!requiredFields.segment}
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
            error: !requiredFields.identification,
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
          error={!requiredFields.modality}
          options={MODALITY_OPTIONS}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          onChange={(e) => handleInputChange("modality", e?.target?.value)}
        />

        <Select
          name="sex"
          value={input.sex}
          options={SELECT_GENRE_OPTIONS}
          icon={faPersonHalfDress}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          onChange={(e) => handleInputChange("sex", e.target.value)}
          error={!requiredFields.sex}
        />

        <DatePicker
          name="birthDate"
          placeholder="Fecha de nacimiento"
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          value={input?.birthDate && input.birthDate.trim() ? dayjs(input.birthDate) : undefined}
          maxDate={dayjs().subtract(18, 'year')}
          minDate={dayjs().subtract(120, 'year')}
          format="DD/MM/YYYY"
          error={!isBirthDateValid}
          errors={!isBirthDateValid ?
            (!input.birthDate || input.birthDate.trim() === "" ? ["La fecha de nacimiento es requerida"] :
              age !== null && age < 18 ? ["Debes ser mayor de 18 años"] :
                age !== null && age > 120 ? ["La fecha de nacimiento no es válida"] :
                  ["La fecha de nacimiento no es válida"]) : []}
          onChange={(date) => {
            const dateString = date ? date.format("YYYY-MM-DD") : "";
            handleInputChange("birthDate", dateString);
          }}
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
              loadingExclusiveAgent ||
              isUpdatingExclusiveAgent ||
              isLoadingCountryData,
            value: input?.coverageState,
            onChange: (value) => handleInputChange("coverageState", value),
          }}
        />

        <TextInput
          error={!requiredFields.yearsOfExperience}
          name="yearsOfExperience"
          placeholder="Años de experiencia"
          showFloatingLabel
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
            error: !requiredFields.phone,
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
          error={!requiredFields.logoUrl}
          setIsUploadingLogo={setIsUploadingLogo}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent || isUploadingLogo}
          onImageChange={(url: string | null, file?: File) => {
            handleInputChange("logoUrl", url || '');
            if (file) {
              setInput(prev => {
                const newState = { ...prev, logoFile: file };
                return newState;
              });
            }
          }}
          placeholder="Subir logo del agente"
          aspect={1}
        />

        <SocialMediaInput
          setHasSocialLinks={setHasSocialLinks}
          socialMediaLinks={socialMediaLinks}
          onSocialLinksChange={setSocialMediaLinks}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
        />
      </div>

      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="w-full font-bold col-span-2">Datos adicionales</h3>

        <LocalOfficesInput
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
          offices={offices}
          onOfficesChange={setOffices}
        />

        <LocalClientsInput
          clients={clients}
          onClientsChange={setClients}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
        />

        <SelectMultiple
          label="Aliados"
          showFloatingLabel
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
                  src={option.data.image || "/images/placeholder.webp"}
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
          studies={studies}
          onStudiesChange={setStudies}
          disabled={loadingExclusiveAgent || isUpdatingExclusiveAgent}
        />
      </div>



      <Button
        variant="solid-blue"
        className="w-fit px-7"
        type="submit"
        disabled={
          hasErrors ||
          isUpdatingExclusiveAgent ||
          loadingExclusiveAgent ||
          isUploadingLogo
        }
        loading={isUpdatingExclusiveAgent}
      >
        Guardar Información
      </Button>
    </form>
  );
};

export default ExclusiveAgentForm;
