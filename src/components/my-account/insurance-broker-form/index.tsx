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
import { UPDATE_INSURANCE_BROKER } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
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
import { UPDATE_ORGANIZATION_LOGO } from "@/lib/sektor-api/mutations/my-account/update-organization-logo";

type InsuranceBrokerIdProps = FormProps;

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


  const [updateInsuranceBroker] = useMutation<Mutation>(
    UPDATE_INSURANCE_BROKER
  );

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

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoHasError, setLogoHasError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasSocialLinks, setHasSocialLinks] = useState(false);



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



  const allies = [...(insuranceBroker?.allies?.map(({ id }) => id) || [])];
  const phoneCodes = PHONE_CODE_OPTIONS.map(({ value }) => value);
  const userPhone = insuranceBroker?.phone || "";
  const userPhoneCode =
    phoneCodes.find((code) => userPhone.startsWith(code)) || "";
  const userPhoneWithoutCode = userPhone.replace(userPhoneCode, "") || "";

  const [licenseType, license] = insuranceBroker?.license?.split("-") || [];
  const [identificationType, identification] =
    insuranceBroker?.identification?.split("-") || [];

  const [input, setInput] = useState<{
    // required
    name: string;
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
    // additional
    allies: string[];
    sex: string;
    // socialMediaLinks: SocialMediaLinkType[];
  }>({
    // required
    name: insuranceBroker?.name || "",
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
  });

  const handleUpdateLogo = async (organizationId: string, logoFile: File) => {
    try {
      const { data } = await updateOrganizationLogo({
        variables: {
          id: organizationId,
          logo: logoFile
        }
      });
      console.log(data);
      console.log("Logo actualizado:", data?.updateOrganizationLogo);
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
    window?.localStorage?.setItem(
      "social-links",
      JSON.stringify(insuranceBroker?.socialMediaLinks || [])
    );
    console.log(insuranceBroker);

    setInput({
      name: insuranceBroker?.name || "",
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
      // socialMediaLinks: JSON.parse(window?.localStorage?.getItem("social-links") || "[]"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insuranceBroker]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('=== INSURANCE BROKER FORM SUBMISSION DEBUG ===');
    console.log('Form input data:', input);
    console.log('Target user ID:', targetUserId);
    console.log('Insurance broker data:', insuranceBroker);
    console.log('Has errors:', hasErrors);

    setIsUpdatingInsuranceBroker(true);

    const currentYear = new Date().getFullYear();
    const foundationYear = currentYear - Number(input?.yearsOfExperience || 0);
    const studies = window.localStorage.getItem("sektor-local-studies") ?? "[]";
    const clients = window.localStorage.getItem("sektor-local-clients") ?? "[]";

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
        phone: `${input?.phoneCode}${input?.phone}`,
        insuranceCompanies: input?.insuranceCompanies,
        license: `${input?.licenseType}${input?.license}`,
        recognitions: insuranceBroker?.recognitions || [],
        identification: `${input?.identificationType}${input?.identification}`,
        offices: formattedOffices || [],
        socialMediaLinks: formattedSocialMediaLinks || [],
      },
    };



    if (input?.logoFile) {
      if (!targetUserId) {
        toast.error("No se pudo actualizar el logo, intenta de nuevo más tarde");
        return;
      }
      console.log('input.logoFile', input.logoFile);
      handleUpdateLogo(targetUserId, input.logoFile);
    }

    updateInsuranceBroker({
      variables: mutationVariables,
    })
      .then((response) => {
        console.log('Insurance broker update success response:', response);
        toast.success("Información actualizada correctamente");
        refetchInsuranceBroker();
      })
      .catch((error) => {
        console.error('=== INSURANCE BROKER FORM ERROR DEBUG ===');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error graphQLErrors:', error?.graphQLErrors);
        console.error('Error networkError:', error?.networkError);
        console.error('Error extensions:', error?.extensions);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      })
      .finally(() => setIsUpdatingInsuranceBroker(false));
  };

  const showLoading =
    loadingInsuranceCompanies ||
    loadingBrokerageSocieties ||
    loadingExclusiveAgents ||
    loadingInsuranceBrokers ||
    isLoadingCountryData;

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
