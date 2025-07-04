/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import {
  Mutation,
  OrganizationOfficeInputType,
  Query,
} from "@/lib/sektor-api/__generated__/types";
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
import { UPDATE_BROKERAGE_SOCIETY } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { faHashtag, faPhone } from "@fortawesome/free-solid-svg-icons";
import {
  MODALITY_OPTIONS,
  DEFAULT_PHONE_CODE,
  PHONE_CODE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
  BROKERAGE_SOCIETY_LICENSE_TYPE_OPTIONS,
} from "@/constants/forms";
import {
  COUNTRY_BY_CODE_QUERY,
  PUBLIC_BROKERAGE_SOCIETY_BY_ID_QUERY,
  PUBLIC_BROKERAGE_SOCIETY_QUERY,
  PUBLIC_EXCLUSIVE_AGENTS_QUERY,
  PUBLIC_INSURANCE_BROKERS_QUERY,
  PUBLIC_INSURANCE_COMPANIES_QUERY,
} from "@/lib/sektor-api/queries";
import LocalRecognitionsInput from "../local-recognitions-input";
import LocalWorkTeamInput from "../local-work-team-input";
import SektorFullVerticalLogo from "@/components/icons/sektor-full-vertical-logo";
import LocalClientsInput from "../local-clients-input";
import LocalOfficesInput from "../local-offices-input";
import { FormProps } from "@/types/forms";
import SocialMediaInput from "../social-media-input";

type BrokerageSocietyIdProps = FormProps;

const BrokerageSocietyForm = ({ userId }: BrokerageSocietyIdProps) => {
  const loggedUserId = useAuthStore(useShallow((state) => state.user?.id));
  const targetUserId = userId || loggedUserId;
  console.log('targetUserId: ', targetUserId);

  const [isUpdatingBrokerageSociety, setIsUpdatingBrokerageSociety] =
    useState(false);

  const {
    error: brokerageSocietyError,
    data: brokerageSocietyResponse,
    loading: loadingBrokerageSociety,
    refetch: refetchBrokerageSociety,
  } = useQuery<Query>(PUBLIC_BROKERAGE_SOCIETY_BY_ID_QUERY, {
    variables: { id: targetUserId },
  });

  const [updateBrokerageSociety] = useMutation<Mutation>(
    UPDATE_BROKERAGE_SOCIETY
  );

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

  const brokerageSociety = brokerageSocietyResponse?.publicBrokerageSocietyById;
  const brokerageClients = [...(brokerageSociety?.clients || [])];
  const exclusiveAgentRecognitions = [
    ...(brokerageSociety?.recognitions || []),
  ];

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

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoHasError, setLogoHasError] = useState(false);
  const [hasSocialLinks, setHasSocialLinks] = useState(false);
  console.log('hasSocialLinks: ', hasSocialLinks);

  const allies = [...(brokerageSociety?.allies?.map(({ id }) => id) || [])];
  const phoneCodes = PHONE_CODE_OPTIONS.map(({ value }) => value);
  const userPhone = brokerageSociety?.contact?.phone || "";
  const userPhoneCode =
    phoneCodes.find((code) => userPhone.startsWith(code)) || "";
  const userPhoneWithoutCode = userPhone.replace(userPhoneCode, "") || "";

  const [licenseType, license] = brokerageSociety?.license?.split("-") || [];
  const identification = brokerageSociety?.identification || "";

  const formattedOffices = brokerageSociety?.offices?.map((office: any) => {
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

  const formattedSocialMediaLinks = brokerageSociety?.socialMediaLinks?.map((link: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __typename, ...restLinkProps } = link;

    return {
      url: restLinkProps.url,
      platform: restLinkProps.platform,
    };
  });

  const [input, setInput] = useState({
    // required
    name: brokerageSociety?.name || "",
    insuranceCompanies: [],
    license: license || "",
    licenseType: licenseType
      ? `${licenseType}-`
      : BROKERAGE_SOCIETY_LICENSE_TYPE_OPTIONS[0].value,
    segment: brokerageSociety?.lineOfBusiness || [],
    identification: identification || "",
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
    const foundationYear = Number(brokerageSociety?.foundationYear || 0);
    const yearsOfExperience =
      foundationYear > 0 ? currentYear - foundationYear : 0;

    const studies =
      brokerageSociety?.recognitions.map(
        ({ id, title, date, giver, description }) => {
          return { id, title, date, giver, description };
        }
      ) || [];

    const clients = brokerageSociety?.clients
      ? brokerageSociety?.clients.map(({ id, name, logoUrl }) => {
        return { id, name, logoUrl };
      })
      : [];

    const workTeam =
      brokerageSociety?.workTeam.map(({ id, name, position, organization }) => {
        return { id, name, position, organization };
      }) || [];
    console.log('workTeam 1: ', workTeam);

    const insuranceCompaniesIds = (brokerageSociety?.insuranceCompanies?.map(
      ({ id }) => id
    ) || []) as never[];



    window?.localStorage?.setItem(
      "sektor-local-recognitions",
      JSON.stringify(studies)
    );
    console.log('workTeam: ', workTeam);
    window?.localStorage?.setItem(
      "sektor-local-work-team",
      JSON.stringify(workTeam)
    );
    window?.localStorage?.setItem(
      "sektor-local-clients",
      JSON.stringify(clients)
    );

    window?.localStorage?.setItem(
      "sektor-local-offices",
      JSON.stringify(formattedOffices || [])
    );

    window?.localStorage?.setItem(
      "social-links",
      JSON.stringify(formattedSocialMediaLinks || [])
    );

    setInput({
      name: brokerageSociety?.name || "",
      insuranceCompanies: insuranceCompaniesIds || [],
      license: license || "",
      licenseType: licenseType
        ? `${licenseType}-`
        : BROKERAGE_SOCIETY_LICENSE_TYPE_OPTIONS[0].value,
      segment: brokerageSociety?.lineOfBusiness || [],
      identification: identification || "",
      modality: brokerageSociety?.modality || "",
      coverageState: (brokerageSociety?.coverageStates as never[]) || [],
      yearsOfExperience: String(yearsOfExperience) || "",
      phone: userPhoneWithoutCode || "",
      phoneCode: userPhoneCode || DEFAULT_PHONE_CODE,
      logoUrl: brokerageSociety?.logoUrl || "",
      allies: [...(brokerageSociety?.allies?.map(({ id }) => id) || [])],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brokerageSociety]);

  const requiredFields = useMemo(() => {
    return {
      name: Boolean(input.name.trim().length),
      insuranceCompanies: Boolean(input.insuranceCompanies.length),
      license: Boolean(input.license.trim().length),
      segment: Boolean(input.segment.length),
      identification: Boolean(input.identification.trim().length),
      modality: Boolean(input.modality.trim().length),
      coverageState: Boolean(input.coverageState.length),
      yearsOfExperience: Boolean(
        input.yearsOfExperience?.trim()?.length &&
        Number(input.yearsOfExperience) > 0
      ),
      phone: Boolean(input.phone.trim().length),
      logoUrl: Boolean(input.logoUrl.trim().length),
    };
  }, [input]);

  const hasErrors = Object.values(requiredFields).some((field) => !field);

  if (brokerageSocietyError) {
    toast.error(
      brokerageSocietyError?.message ||
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


    setIsUpdatingBrokerageSociety(true);

    const currentYear = new Date().getFullYear();
    const foundationYear = currentYear - Number(input?.yearsOfExperience || 0);
    const clients = window.localStorage.getItem("sektor-local-clients") ?? "[]";
    const recognitions = window.localStorage.getItem("sektor-local-recognitions") ?? "[]";
    // Limpieza de recognitions
    const formattedRecognitions = JSON.parse(recognitions).map((rec: any) => {
      return {
        id: rec.id,
        title: rec.title,
        description: rec.description,
        date: rec.date,
        giver: rec.giver,
      };
    });


    const workTeam = window.localStorage.getItem("sektor-local-work-team") ?? "[]";

    const rawWorkTeam = JSON.parse(workTeam);
    console.log('rawWorkTeam: ', rawWorkTeam);

    const formattedWorkTeam = rawWorkTeam
      .filter((member: any) => !!member.organization && !!member.position)
      .map((member: any) => ({
        organization: member.organization.id,
        position: member.position,
      }));


    console.log('formattedWorkTeam: ', formattedWorkTeam);

    if (formattedWorkTeam.length !== rawWorkTeam.length) {
      toast.error("Todos los miembros del equipo deben tener organización y cargo.");
      setIsUpdatingBrokerageSociety(false);
      return;
    }

    const offices = window.localStorage.getItem("sektor-local-offices") ?? "[]";
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

    const contact = window.localStorage.getItem("sektor-local-contact") ?? "{}";
    const contactData = JSON.parse(contact);

    const formattedContact = {
      ...contactData,
      phone: `${input?.phoneCode}${input?.phone}`,
      name: contactData.name || "Nombre requerido",
      position: contactData.position || "Cargo requerido",
    };

    const socialMediaLinks = window.localStorage.getItem("social-links") ?? "[]";
    const parsedLinks = JSON.parse(socialMediaLinks);
    const formattedSocialMediaLinks = parsedLinks.map((link: any) => {
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
        clients: JSON.parse(clients),
        foundationYear,
        name: input?.name,
        allies: input?.allies,
        logoUrl: input?.logoUrl,
        modality: input?.modality,
        workTeam: formattedWorkTeam,
        type: brokerageSociety?.type,
        recognitions: formattedRecognitions,
        lineOfBusiness: input?.segment,
        coverageStates: input?.coverageState,
        insuranceCompanies: input?.insuranceCompanies,
        license: `${input?.licenseType}${input?.license}`,
        identification: input?.identification,
        offices: formattedOffices || [],
        contact: formattedContact,
        socialMediaLinks: formattedSocialMediaLinks || [],
      },
    };

    console.log('Mutation variables:', mutationVariables);

    updateBrokerageSociety({
      variables: mutationVariables,
    })
      .then((response) => {
        console.log('Brokerage society update success response:', response);
        toast.success("Información actualizada correctamente");
        refetchBrokerageSociety();
      })
      .catch((error) => {
        console.error('=== BROKERAGE SOCIETY FORM ERROR DEBUG ===');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error graphQLErrors:', error?.graphQLErrors);
        console.error('Error networkError:', error?.networkError);
        console.error('Error extensions:', error?.extensions);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      })
      .finally(() => setIsUpdatingBrokerageSociety(false));
  };

  const showLoading =
    loadingBrokerageSocieties ||
    loadingBrokerageSociety ||
    loadingInsuranceCompanies ||
    loadingInsuranceBrokers ||
    loadingExclusiveAgents ||
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
          placeholder="Nombre completo"
          showFloatingLabel
          error={!requiredFields.name}
          disabled={loadingBrokerageSociety || isUpdatingBrokerageSociety}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
        />

        <SelectMultiple
          label="Compañias con las que trabajas"
          showFloatingLabel
          wrapperClassName="w-full"
          error={!requiredFields.insuranceCompanies}
          selectProps={{
            disabled: loadingInsuranceCompanies || isUpdatingBrokerageSociety,
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
            options: BROKERAGE_SOCIETY_LICENSE_TYPE_OPTIONS,
            disabled: loadingBrokerageSociety || isUpdatingBrokerageSociety,
            onChange: (e) => handleInputChange("licenseType", e?.target?.value),
          }}
          textInputProps={{
            name: "license",
            placeholder: "123456",
            error: !requiredFields.license,
            onChange: (e) => handleInputChange("license", e?.target?.value),
            disabled: loadingBrokerageSociety || isUpdatingBrokerageSociety,
            minLength: 6,
            maxLength: 6,
            value: input?.license,
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
            disabled: loadingBrokerageSociety || isUpdatingBrokerageSociety,
            value: input?.segment,
            onChange: (value) => handleInputChange("segment", value),
          }}
        />

        <TextInput
          name="identification"
          className="col-span-1"
          error={!requiredFields.identification}
          placeholder="Documento de identidad"
          showFloatingLabel
          disabled={loadingBrokerageSociety || isUpdatingBrokerageSociety}
          onChange={(e) => handleInputChange("identification", e.target?.value)}
          value={input?.identification}
          minLength={6}
          maxLength={14}
        />

        <Select
          name="modality"
          error={!requiredFields.modality}
          value={input?.modality}
          options={MODALITY_OPTIONS}
          disabled={loadingBrokerageSociety || isUpdatingBrokerageSociety}
          onChange={(e) => handleInputChange("modality", e?.target?.value)}
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
              loadingBrokerageSociety ||
              isUpdatingBrokerageSociety ||
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
          disabled={loadingBrokerageSociety || isUpdatingBrokerageSociety}
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
            disabled: loadingBrokerageSociety || isUpdatingBrokerageSociety,
            options: PHONE_CODE_OPTIONS,
            onChange: (e) => handleInputChange("phoneCode", e.target.value),
          }}
          textInputProps={{
            name: "phone",
            placeholder: "Teléfono",
            error: !requiredFields.phone,
            type: "tel",
            disabled: loadingBrokerageSociety || isUpdatingBrokerageSociety,
            onChange: (e) => handleInputChange("phone", e.target.value),
            maxLength: 10,
            value: input?.phone,
          }}
        />



        <UploadInput
          imageUrl={input?.logoUrl || ""}
          error={!requiredFields.logoUrl || logoHasError}
          setError={setLogoHasError}
          setIsUploadingLogo={setIsUploadingLogo}
          disabled={
            loadingBrokerageSociety ||
            loadingBrokerageSocieties ||
            isUpdatingBrokerageSociety ||
            isUploadingLogo
          }
          onImageChange={(url: string | null) => handleInputChange("logoUrl", url || '')}
          placeholder="Subir logo de la sociedad"
          aspect={1}
        />
        <SocialMediaInput
          setHasSocialLinks={setHasSocialLinks}
          disabled={loadingBrokerageSociety || isUpdatingBrokerageSociety}
        />
      </div>

      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="w-full font-bold col-span-2">Datos adicionales</h3>

        <LocalOfficesInput
          disabled={loadingBrokerageSociety || isUpdatingBrokerageSociety}
          offices={formattedOffices as unknown as OrganizationOfficeInputType[]}
        />

        <LocalClientsInput
          clients={brokerageClients}
          disabled={
            loadingBrokerageSociety ||
            loadingInsuranceBrokers ||
            loadingExclusiveAgents ||
            loadingBrokerageSocieties
          }
        />

        <SelectMultiple
          label="Aliados"
          showFloatingLabel
          wrapperClassName="w-full col-span-1"
          selectProps={{
            disabled:
              loadingBrokerageSociety ||
              loadingInsuranceBrokers ||
              loadingExclusiveAgents ||
              loadingBrokerageSocieties ||
              isUpdatingBrokerageSociety,
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

        <LocalRecognitionsInput
          recognitions={exclusiveAgentRecognitions}
          disabled={loadingBrokerageSociety || isUpdatingBrokerageSociety}
        />

        <LocalWorkTeamInput
          workTeam={brokerageSociety?.workTeam || []}
          disabled={loadingBrokerageSociety || isUpdatingBrokerageSociety}
          options={[
            {
              label: "Selecciona un miembro",
              value: "",
              disabled: true,
              hidden: true,
            },
            ...insuranceBrokerOptions,
            ...exclusiveAgentOptions,
          ]}
        />
      </div>

      <Button
        variant="solid-blue"
        className="w-fit px-7"
        type="submit"
        disabled={
          hasErrors ||
          isUpdatingBrokerageSociety ||
          loadingBrokerageSociety ||
          isUploadingLogo ||
          logoHasError
        }
        loading={isUpdatingBrokerageSociety}
      >
        Guardar Información
      </Button>
    </form>
  );
};

export default BrokerageSocietyForm;
