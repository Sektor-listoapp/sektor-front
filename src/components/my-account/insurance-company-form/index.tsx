/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import { useMutation, useQuery } from "@apollo/client";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import LocalOfficesInput from "../local-offices-input";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@/store/auth";
import { toast } from "react-toastify";
import Image from "next/image";
import { Space } from "antd";
import Button from "@/components/ui/button";
import { UPDATE_INSURANCE_COMPANY } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import {
  BROKERAGE_SOCIETY_LICENSE_TYPE_OPTIONS,
  IDENTIFICATION_TYPE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
} from "@/constants/forms";
import {
  InsuranceCompanyContactInputType,
  Mutation,
  OrganizationOfficeInputType,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import {
  PUBLIC_INSURANCE_COMPANY_BY_ID_QUERY,
  PUBLIC_SUPPLIERS_QUERY,
} from "@/lib/sektor-api/queries";
import UploadInput from "@/components/ui/upload-input";
import LocalContactInput from "../local-contact-input";
import SektorFullVerticalLogo from "@/components/icons/sektor-full-vertical-logo";

const InsuranceCompanyForm = () => {
  const userId = useAuthStore(useShallow((state) => state.user?.id));
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);

  const [updateCompany] = useMutation<Mutation>(UPDATE_INSURANCE_COMPANY);

  const { data: suppliersResponse, loading: loadingSuppliers } =
    useQuery<Query>(PUBLIC_SUPPLIERS_QUERY);

  const {
    error: companyError,
    data: companyResponse,
    loading: loadingCompany,
    refetch: refetchCompany,
  } = useQuery<Query>(PUBLIC_INSURANCE_COMPANY_BY_ID_QUERY, {
    variables: { id: userId },
  });

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoHasError, setLogoHasError] = useState(false);
  const [hasLocalContact, setHasLocalContact] = useState(false);

  const company = companyResponse?.publicInsuranceCompanyById;

  const suppliers = suppliersResponse?.publicSuppliers?.items || [];
  const suppliersOptions = [
    ...suppliers?.map(({ id, name, logoUrl }) => ({
      label: name,
      value: id,
      image: logoUrl,
    })),
  ];

  const localContacts = JSON.parse(
    window?.localStorage?.getItem("sektor-local-contact") || "{}"
  );

  const formattedOffices = company?.offices?.map((office: any) => {
    const {
      __typename: _,
      address,
      schedule = [],
      ...restOfficeProps
    } = office;

    const formattedSchedule = schedule.map(
      ({ __typename, ...restScheduleProps }) => {
        return {
          ...restScheduleProps,
        };
      }
    );

    return {
      ...restOfficeProps,
      schedule: formattedSchedule,
      address: {
        cityId: address?.cityId || address?.city?.id,
        countryId: address?.countryId || address?.country?.id,
        stateId: address?.stateId || address?.state?.id,
        street: address?.street,
      },
    };
  });

  const [input, setInput] = useState({
    // required
    name: "",
    segment: [],
    license: "",
    licenseType: "",
    identification: "",
    identificationType: "",
    yearsOfExperience: "",
    logoUrl: "",
    // additional
    motto: "",
    suppliers: [],
  });

  useEffect(() => {
    const [licenseType, license] = company?.license?.split("-") || [];
    const [identificationType, identification] =
      company?.identification?.split("-") || [];

    const foundationYear = Number(company?.foundationYear || 0);
    const supplierIds = (company?.suppliers?.map(({ id }) => id) ||
      []) as never[];

    setInput({
      name: company?.name || "",
      suppliers: supplierIds || [],
      license: license || "",
      licenseType: licenseType
        ? `${licenseType}-`
        : BROKERAGE_SOCIETY_LICENSE_TYPE_OPTIONS[0].value,
      segment: (company?.lineOfBusiness || []) as never[],
      identification: identification || "",
      identificationType:
        `${identificationType}-` || IDENTIFICATION_TYPE_OPTIONS[0].value,
      yearsOfExperience: String(foundationYear) || "",
      motto: company?.motto || "",
      logoUrl: company?.logoUrl || "",
    });
  }, [company]);

  const requiredFields = {
    name: Boolean(input.name?.trim()?.length),
    license: Boolean(input.license?.trim()?.length),
    segment: Boolean(input.segment?.length),
    identification: Boolean(input.identification?.trim()?.length),
    yearsOfExperience: Boolean(
      input.yearsOfExperience?.trim()?.length &&
        Number(input.yearsOfExperience) > 0
    ),
    logoUrl: Boolean(input.logoUrl?.trim()?.length),
  };

  const hasErrors =
    Object.values(requiredFields).some((field) => !field) ||
    Object.values(localContacts)?.length === 0;

  if (companyError) {
    toast.error(
      companyError?.message ||
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

    setIsUpdatingCompany(true);

    const localContactLinks = JSON.parse(
      window?.localStorage?.getItem("sektor-local-contact") ?? "{}"
    );
    const formattedContact = {
      name: company?.contact?.name || "Contacto",
      links:
        Object?.entries(localContactLinks)?.map(([platform, url]) => {
          return {
            platform,
            url,
          };
        }) ?? [],
    };

    const offices = window.localStorage.getItem("sektor-local-offices") ?? "[]";
    const formattedOffices = JSON.parse(offices).map((office: any) => {
      const {
        __typename: _,
        address,
        schedule = [],
        ...restOfficeProps
      } = office;

      const formattedSchedule = schedule.map(
        ({ __typename, ...restScheduleProps }) => {
          return {
            ...restScheduleProps,
          };
        }
      );

      return {
        ...restOfficeProps,
        schedule: formattedSchedule,
        address: {
          cityId: address?.cityId || address?.city?.id,
          countryId: address?.countryId || address?.country?.id,
          stateId: address?.stateId || address?.state?.id,
          street: address?.street,
        },
      };
    });

    updateCompany({
      variables: {
        input: {
          id: userId,
          type: company?.type,
          name: input?.name,
          suppliers: input?.suppliers || [],
          lineOfBusiness: input?.segment,
          foundationYear: Number(input?.yearsOfExperience) || 0,
          license: `${input?.licenseType}${input?.license}`,
          identification: `${input?.identificationType}${input?.identification}`,
          motto: input?.motto,
          offices: formattedOffices,
          coverageStates: company?.coverageStates || [],
          modality: company?.modality,
          logoUrl: input?.logoUrl,
          contact: formattedContact,
        },
      },
    })
      .then(() => {
        toast.success("Información actualizada correctamente");
        refetchCompany();
      })
      .catch((error) => {
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      })
      .finally(() => setIsUpdatingCompany(false));
  };

  const showLoading = loadingCompany || loadingSuppliers;

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
          disabled={loadingCompany || isUpdatingCompany}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
        />

        <SelectMultiple
          wrapperClassName="w-full"
          error={!requiredFields.segment}
          selectProps={{
            placeholder: "Ramos con los que trabajas",
            options: SELECT_LINE_OF_BUSINESS_OPTIONS,
            notFoundContent: "No hay opciones disponibles",
            disabled: loadingCompany || isUpdatingCompany,
            value: input?.segment,
            onChange: (value) => handleInputChange("segment", value),
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
            disabled: loadingCompany || isUpdatingCompany,
            onChange: (e) => handleInputChange("licenseType", e?.target?.value),
          }}
          textInputProps={{
            name: "license",
            placeholder: "123456",
            error: !requiredFields.license,
            onChange: (e) => handleInputChange("license", e?.target?.value),
            disabled: loadingCompany || isUpdatingCompany,
            minLength: 6,
            maxLength: 6,
            value: input?.license,
          }}
        />

        <TextInput
          name="yearsOfExperience"
          placeholder="Años de experiencia"
          error={!requiredFields.yearsOfExperience}
          type="number"
          min={0}
          disabled={loadingCompany || isUpdatingCompany}
          value={input?.yearsOfExperience}
          onChange={(e) =>
            handleInputChange("yearsOfExperience", e?.target?.value)
          }
        />

        <SelectWithTextInput
          selectProps={{
            name: "identificationType",
            icon: faHashtag,
            value: input?.identificationType,
            wrapperClassName: "w-36",
            className: "border-r-0",
            options: IDENTIFICATION_TYPE_OPTIONS,
            disabled: loadingCompany || isUpdatingCompany,
            onChange: (e) =>
              handleInputChange("identificationType", e?.target?.value),
          }}
          textInputProps={{
            name: "identification",
            placeholder: "Documento de identidad",
            error: !requiredFields.identification,
            onChange: (e) =>
              handleInputChange("identification", e?.target?.value),
            disabled: loadingCompany || isUpdatingCompany,
            maxLength: 12,
            value: input?.identification,
          }}
        />

        <UploadInput
          imageUrl={input?.logoUrl || ""}
          error={!requiredFields.logoUrl || logoHasError}
          setError={setLogoHasError}
          setIsUploadingLogo={setIsUploadingLogo}
          disabled={loadingCompany || isUpdatingCompany || isUploadingLogo}
          onImageChange={(url: string) => handleInputChange("logoUrl", url)}
        />

        <LocalContactInput
          links={company?.contact?.links || []}
          setHasLocalContact={setHasLocalContact}
          disabled={loadingCompany || isUpdatingCompany}
        />
      </div>

      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="w-full font-bold col-span-2">Datos adicionales</h3>

        <TextInput
          name="motto"
          className="col-span-1"
          placeholder="Lema"
          disabled={loadingCompany || isUpdatingCompany}
          onChange={(e) => handleInputChange("motto", e.target.value)}
          value={input?.motto}
        />

        <LocalOfficesInput
          disabled={loadingCompany || isUpdatingCompany}
          offices={formattedOffices as unknown as OrganizationOfficeInputType[]}
        />

        <SelectMultiple
          wrapperClassName="w-full"
          selectProps={{
            disabled: loadingSuppliers || isUpdatingCompany,
            placeholder: "Proveedores",
            options: suppliersOptions,
            value: input?.suppliers,
            notFoundContent: "No hay opciones disponibles",
            onChange: (value) => handleInputChange("suppliers", value),
            optionRender: (option) => (
              <Space>
                <Image
                  src={option?.data?.image || "/images/placeholder.png"}
                  alt={"Proveedor"}
                  width={40}
                  height={40}
                />
                {option?.data?.label}
              </Space>
            ),
          }}
        />
      </div>

      <Button
        variant="solid-blue"
        className="w-fit px-7"
        type="submit"
        disabled={
          hasErrors ||
          isUpdatingCompany ||
          loadingCompany ||
          isUploadingLogo ||
          logoHasError ||
          !hasLocalContact
        }
        loading={isUpdatingCompany}
      >
        Guardar Información
      </Button>
    </form>
  );
};

export default InsuranceCompanyForm;

/*
{
  "name": "Laura Martinez",
  "links": [
    {
      "url": "https://linkedin.com/company/travelsafe",
      "platform": "Instagram",
    },
    {
      "url": "https://instagram.com/travelsafe",
      "platform": "Instagram",
    }
  ],
}
*/
