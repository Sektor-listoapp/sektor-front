/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import {
  Mutation,
  OrganizationOfficeInputType,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { useMutation, useQuery } from "@apollo/client";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@/store/auth";
import { toast } from "react-toastify";
import Image from "next/image";
import { Space } from "antd";
import Button from "@/components/ui/button";
import { UPDATE_SUPPLIER } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import {
  BROKERAGE_SOCIETY_LICENSE_TYPE_OPTIONS,
  IDENTIFICATION_TYPE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
  SELECT_SUPPLIER_SERVICE_OPTIONS,
} from "@/constants/forms";
import {
  PUBLIC_INSURANCE_COMPANIES_QUERY,
  PUBLIC_SUPPLIER_BY_ID_QUERY,
} from "@/lib/sektor-api/queries";
import LocalOfficesInput from "../local-offices-input";
import Select from "@/components/ui/select";
import SektorFullVerticalLogo from "@/components/icons/sektor-full-vertical-logo";
import UploadInput from "@/components/ui/upload-input";
import { FormProps } from "@/types/forms";
import SocialMediaInput from "../social-media-input";


type supplierIdProps = FormProps;

const SupplierForm = ({ userId }: supplierIdProps) => {
  const loggedUserId = useAuthStore(useShallow((state) => state.user?.id));
  const targetUserId = userId || loggedUserId;
  const [isUpdatingSupplier, setIsUpdatingSupplier] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [hasSocialLinks, setHasSocialLinks] = useState(false);
  console.log('hasSocialLinks: ', hasSocialLinks);

  const [updateSupplier] = useMutation<Mutation>(UPDATE_SUPPLIER);

  const {
    data: insuranceCompaniesResponse,
    loading: loadingInsuranceCompanies,
  } = useQuery<Query>(PUBLIC_INSURANCE_COMPANIES_QUERY);

  const {
    error: supplierError,
    data: supplierResponse,
    loading: loadingSupplier,
    refetch: refetchSupplier,
  } = useQuery<Query>(PUBLIC_SUPPLIER_BY_ID_QUERY, {
    variables: { id: targetUserId },
  });

  const supplier = supplierResponse?.publicSupplierById;

  const insuranceCompanies =
    insuranceCompaniesResponse?.publicInsuranceCompanies?.items || [];
  const insuranceCompanyOptions = [
    ...insuranceCompanies?.map(({ id, name, logoUrl }) => ({
      label: name,
      value: id,
      image: logoUrl,
    })),
  ];

  const formattedOffices = supplier?.offices?.map((office: any) => {
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



  const [input, setInput] = useState({
    // required
    name: "",
    segment: [],
    license: "",
    licenseType: "",
    identification: "",
    identificationType: "",
    serviceType: "",
    logoUrl: "",
    // additional
    motto: "",
    insuranceCompanies: [],
    socialMediaLinks: [],
  });

  useEffect(() => {
    const [licenseType, license] = supplier?.license?.split("-") || [];
    const [identificationType, identification] =
      supplier?.identification?.split("-") || [];

    const insuranceCompaniesIds = (supplier?.insuranceCompanies?.map(
      ({ id }) => id
    ) || []) as never[];

    window?.localStorage?.setItem(
      "sektor-local-offices",
      JSON.stringify(supplier?.offices || [])
    );
    window?.localStorage?.setItem(
      "social-links",
      JSON.stringify(supplier?.socialMediaLinks || [])
    );

    setInput({
      name: supplier?.name || "",
      insuranceCompanies: insuranceCompaniesIds || [],
      license: license || "",
      licenseType: licenseType
        ? `${licenseType}-`
        : BROKERAGE_SOCIETY_LICENSE_TYPE_OPTIONS[0].value,
      segment: (supplier?.lineOfBusiness || []) as never[],
      identification: identification || "",
      identificationType:
        `${identificationType}-` || IDENTIFICATION_TYPE_OPTIONS[0].value,
      serviceType: supplier?.serviceType || "",
      motto: supplier?.motto || "",
      logoUrl: supplier?.logoUrl || "",
      socialMediaLinks: [],
    });
  }, [supplier]);

  const requiredFields = {
    name: Boolean(input.name?.trim()?.length),
    license: Boolean(input.license?.trim()?.length),
    segment: Boolean(input?.segment?.length),
    identification: Boolean(input.identification?.trim()?.length),
    logoUrl: Boolean(input.logoUrl?.trim()?.length),
  };

  const hasErrors = Object.values(requiredFields).some((field) => !field);

  if (supplierError) {
    toast.error(
      supplierError?.message ||
      "Ha ocurrido un error obteniendo la información de tu cuenta, intenta de nuevo más tarde"
    );
  }

  const handleInputChange = (
    field: keyof typeof input,
    value: string | string[] | React.ChangeEvent<HTMLSelectElement> | null
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

    console.log('=== SUPPLIER FORM SUBMISSION DEBUG ===');
    console.log('Form input data:', input);
    console.log('Target user ID:', targetUserId);
    console.log('Supplier data:', supplier);
    console.log('Has errors:', hasErrors);

    setIsUpdatingSupplier(true);

    const offices = window.localStorage.getItem("sektor-local-offices") ?? "[]";
    const formattedOffices = JSON.parse(offices).map((office: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename: _, address, ...restOfficeProps } = office;
      return {
        ...restOfficeProps,
        photoUrl: office.photoUrl || restOfficeProps.photoUrl,
        address: {
          cityId: address?.cityId || address?.city?.id,
          countryId: address?.countryId || address?.country?.id,
          stateId: address?.stateId || address?.state?.id,
          street: address?.street,
        },
      };
    });

    const socialMediaLinks = window.localStorage.getItem("social-links") ?? "[]";
    const formattedSocialMediaLinks = JSON.parse(socialMediaLinks).map((link: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, ...restLinkProps } = link;
      return {
        platform: restLinkProps.platform,
        url: restLinkProps.url,
      };
    });

    console.log('Formatted offices:', formattedOffices);
    console.log('Formatted social media links:', formattedSocialMediaLinks);

    const mutationVariables = {
      input: {
        id: targetUserId,
        name: input?.name,
        type: supplier?.type,
        lineOfBusiness: input?.segment,
        coverageStates: supplier?.coverageStates || [],
        foundationYear: supplier?.foundationYear || 0,
        services: supplier?.services || [],
        allies: supplier?.allies || [],
        license: `${input?.licenseType}${input?.license}`,
        identification: `${input?.identificationType}${input?.identification}`,
        motto: input?.motto,
        insuranceCompanies: input?.insuranceCompanies,
        offices: formattedOffices,
        modality: supplier?.modality,
        serviceType: input?.serviceType,
        logoUrl: input?.logoUrl,
        socialMediaLinks: formattedSocialMediaLinks || [],
      },
    };

    console.log('Mutation variables:', mutationVariables);

    updateSupplier({
      variables: mutationVariables,
    })
      .then((response) => {
        console.log('Supplier update success response:', response);
        toast.success("Información actualizada correctamente");
        refetchSupplier();
      })
      .catch((error) => {
        console.error('=== SUPPLIER FORM ERROR DEBUG ===');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error graphQLErrors:', error?.graphQLErrors);
        console.error('Error networkError:', error?.networkError);
        console.error('Error extensions:', error?.extensions);
        console.error('Full error details:', JSON.stringify(error, null, 2));
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      })
      .finally(() => setIsUpdatingSupplier(false));
  };

  const showLoading = loadingInsuranceCompanies || loadingSupplier;

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
          disabled={loadingSupplier || isUpdatingSupplier}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
          error={!requiredFields.name}
        />


        <SelectMultiple
          wrapperClassName="w-full"
          error={!requiredFields.segment}
          selectProps={{
            placeholder: "Ramos con los que trabajas",
            options: SELECT_LINE_OF_BUSINESS_OPTIONS,
            notFoundContent: "No hay opciones disponibles",
            disabled: loadingSupplier || isUpdatingSupplier,
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
            disabled: loadingSupplier || isUpdatingSupplier,
            onChange: (e) => handleInputChange("licenseType", e?.target?.value),
          }}
          textInputProps={{
            error: !requiredFields.license,
            name: "license",
            placeholder: "123456",
            onChange: (e) => handleInputChange("license", e?.target?.value),
            disabled: loadingSupplier || isUpdatingSupplier,
            minLength: 6,
            maxLength: 6,
            value: input?.license,
          }}
        />

        <SelectWithTextInput
          selectProps={{
            name: "identificationType",
            icon: faHashtag,
            value: input?.identificationType,
            wrapperClassName: "w-36",
            className: "border-r-0",
            options: IDENTIFICATION_TYPE_OPTIONS,
            disabled: loadingSupplier || isUpdatingSupplier,
            onChange: (e) =>
              handleInputChange("identificationType", e?.target?.value),
          }}
          textInputProps={{
            name: "identification",
            error: !requiredFields.identification,
            placeholder: "Documento de identidad",
            onChange: (e) =>
              handleInputChange("identification", e?.target?.value),
            disabled: loadingSupplier || isUpdatingSupplier,
            maxLength: 12,
            value: input?.identification,
          }}
        />

        <UploadInput
          imageUrl={input?.logoUrl || ""}
          error={!requiredFields.logoUrl}
          setIsUploadingLogo={setIsUploadingLogo}
          disabled={loadingSupplier || isUpdatingSupplier || isUploadingLogo}
          onImageChange={(url: string | null) => handleInputChange("logoUrl", url || "")}
          placeholder="Subir logo del proveedor"
          aspect={1}
        />
        <SocialMediaInput
          setHasSocialLinks={setHasSocialLinks}
          disabled={loadingSupplier || isUpdatingSupplier}
        />
      </div>

      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="w-full font-bold col-span-2">Datos adicionales</h3>

        <TextInput
          name="motto"
          className="col-span-1"
          placeholder="Lema"
          showFloatingLabel
          disabled={loadingSupplier || isUpdatingSupplier}
          onChange={(e) => handleInputChange("motto", e.target.value)}
          value={input?.motto}
        />

        <LocalOfficesInput
          disabled={loadingSupplier || isUpdatingSupplier}
          offices={formattedOffices as unknown as OrganizationOfficeInputType[]}
        />

        <Select
          value={input?.serviceType}
          options={SELECT_SUPPLIER_SERVICE_OPTIONS}
          disabled={loadingSupplier || isUpdatingSupplier}
          onChange={(e) => handleInputChange("serviceType", e?.target?.value)}
          wrapperClassName="w-full"
        />

        <SelectMultiple
          wrapperClassName="w-full"
          selectProps={{
            disabled: loadingInsuranceCompanies || isUpdatingSupplier,
            placeholder: "Compañias con las que trabajas",
            options: insuranceCompanyOptions,
            value: input?.insuranceCompanies,
            notFoundContent: "No hay opciones disponibles",
            onChange: (value) => handleInputChange("insuranceCompanies", value),
            optionRender: (option) => (
              <Space>
                <Image
                  src={option.data.image || "/images/placeholder.png"}
                  alt={"Compañia de seguros"}
                  width={40}
                  height={40}
                />
                {option.data.label}
              </Space>
            ),
          }}
        />
      </div>

      <Button
        variant="solid-blue"
        className="w-fit px-7"
        type="submit"
        disabled={hasErrors || isUpdatingSupplier || loadingSupplier}
        loading={isUpdatingSupplier}
      >
        Guardar Información
      </Button>
    </form>
  );
};

export default SupplierForm;
