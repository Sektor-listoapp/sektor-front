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
import { ADMIN_UPDATE_USER_EMAIL, UPDATE_EMAIL, UPDATE_INSURANCE_COMPANY } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import {
  IDENTIFICATION_TYPE_OPTIONS,
  INSURANCE_COMPANY_LICENSE_TYPE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
} from "@/constants/forms";
import {
  InsuranceCompanyContactInputType,
  Mutation,
  OrganizationOfficeInputType,
  Query,
  SocialMediaLinkType,
} from "@/lib/sektor-api/__generated__/types";
import {
  ORGANIZATION_BY_ID_QUERY,
  PUBLIC_INSURANCE_COMPANY_BY_ID_QUERY,
  PUBLIC_SUPPLIERS_QUERY,
} from "@/lib/sektor-api/queries";
import UploadInput from "@/components/ui/upload-input";
import LocalContactInput from "../local-contact-input";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { FormProps } from "@/types/forms";
import SocialMediaInput from "../social-media-input";
import { UPDATE_ORGANIZATION_LOGO } from "@/lib/sektor-api/mutations/my-account/update-organization-logo";

type InsuranceCompanyIdProps = FormProps;

interface InsuranceCompanyInputType {
  name: string;
  email: string;
  segment: string[];
  license: string;
  licenseType: string;
  identification: string;
  identificationType: string;
  yearsOfExperience: string;
  logoUrl: string;
  logoFile: File | null;
  motto: string;
  suppliers: string[];
  socialMediaLinks: never[];
  password: string;
}

const InsuranceCompanyForm = ({ userId }: InsuranceCompanyIdProps) => {
  const loggedUserId = useAuthStore(useShallow((state) => state.user?.id));
  const targetUserId = userId || loggedUserId;;
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);

  const [updateCompany] = useMutation<Mutation>(UPDATE_INSURANCE_COMPANY);
  const [updateEmailMutation] = useMutation<Mutation>(UPDATE_EMAIL);
  const [adminUpdateUserEmailMutation] = useMutation<Mutation>(ADMIN_UPDATE_USER_EMAIL);

  const { data: suppliersResponse, loading: loadingSuppliers } =
    useQuery<Query>(PUBLIC_SUPPLIERS_QUERY);


  const {
    error: companyError,
    data: companyResponse,
    loading: loadingCompany,
    refetch: refetchCompany,
  } = useQuery<Query>(PUBLIC_INSURANCE_COMPANY_BY_ID_QUERY, {
    variables: { id: targetUserId },
  });

  const {
    data: organizationResponse,
  } = useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
    variables: { id: targetUserId },
    skip: !targetUserId,
  });


  const [updateOrganizationLogo] = useMutation<Mutation>(UPDATE_ORGANIZATION_LOGO);


  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoHasError, setLogoHasError] = useState(false);
  const [hasLocalContact, setHasLocalContact] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [offices, setOffices] = useState<OrganizationOfficeInputType[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinkType[]>([]);
  const [contact, setContact] = useState<{ [platform: string]: string }>({});

  const company = companyResponse?.publicInsuranceCompanyById;

  const suppliers = suppliersResponse?.publicSuppliers?.items || [];
  const suppliersOptions = [
    ...suppliers?.map(({ id, name, logoUrl }) => ({
      label: name,
      value: id,
      image: logoUrl,
    })),
  ];

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
    if (Object?.keys(contact)?.length > 0) {
      setHasLocalContact(true);
    } else {
      setHasLocalContact(false);
    }
  }, [contact]);


  const [input, setInput] = useState<InsuranceCompanyInputType>({
    // required
    name: "",
    email: "",
    segment: [],
    license: "",
    licenseType: "",
    identification: "",
    identificationType: "",
    yearsOfExperience: "",
    logoUrl: "",
    logoFile: null,
    // additional
    motto: "",
    suppliers: [],
    socialMediaLinks: [],
    password: "",
  });


  useEffect(() => {
    const licenseParts = company?.license?.split("-") || [];
    const licenseType = licenseParts[0] || "";
    const license = licenseParts.slice(1).join("-") || "";

    const identificationParts = company?.identification?.split("-") || [];
    const identificationType = identificationParts[0] || "";
    const identification = identificationParts.slice(1).join("-") || "";

    const foundationYear = Number(company?.foundationYear || 0);
    const supplierIds = (company?.suppliers?.map(({ id }) => id) ||
      []) as never[];

    const formattedSocialMediaLinks = company?.socialMediaLinks?.map((link: any) => {
      const { __typename, ...restLinkProps } = link;
      return {
        platform: restLinkProps.platform,
        url: restLinkProps.url,
      };
    }) || [];

    setInput({
      name: company?.name || "",
      email: organizationResponse?.organizationById?.email || "",
      suppliers: supplierIds || [],
      license: license || "",
      licenseType: licenseType
        ? `${'ES-'}`
        : INSURANCE_COMPANY_LICENSE_TYPE_OPTIONS[0].value,
      segment: (company?.lineOfBusiness || []) as never[],
      identification: identification || "",
      identificationType:
        `${identificationType}-` || IDENTIFICATION_TYPE_OPTIONS[0].value,
      yearsOfExperience: String(foundationYear) || "",
      motto: company?.motto || "",
      logoUrl: company?.logoUrl || "",
      logoFile: null,
      socialMediaLinks: [],
      password: "",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    }) || [];

    const contactData: { [platform: string]: string } = {};
    formattedSocialMediaLinks.forEach((link) => {
      contactData[link.platform] = link.url;
    });

    setOffices(formattedOffices);
    setSocialMediaLinks(formattedSocialMediaLinks);
    setContact(contactData);
  }, [company, organizationResponse]);

  const requiredFields = {
    name: Boolean(input.name?.trim()?.length),
    email: Boolean(input.email?.trim()?.length),
    license: Boolean(input.license?.trim()?.length),
    segment: Boolean(input.segment?.length),
    identification: Boolean(input.identification?.trim()?.length),
    yearsOfExperience: Boolean(
      input.yearsOfExperience?.trim()?.length &&
      Number(input.yearsOfExperience) > 0
    ),
    logoUrl: Boolean(input.logoUrl?.trim()?.length),
  };
  const originalEmail = organizationResponse?.organizationById?.email || "";
  const isSelfUpdate = loggedUserId === targetUserId;
  const emailChanged = Boolean(input.email && input.email !== originalEmail);

  const hasErrors =
    Object.values(requiredFields).some((field) => !field) ||
    Object.values(contact)?.length === 0;

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();





    setIsUpdatingCompany(true);

    const formattedOffices = offices.map((office: any) => {
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

    const cleanedLinks = Object.entries(contact)
      .filter(([key, value]) => typeof value === 'string' && value.trim() !== '')
      .map(([platform, url]) => ({
        platform,
        url,
      }));

    console.log("cleanedLinks", cleanedLinks)

    const formattedContact: InsuranceCompanyContactInputType = {
      name: input?.name || "Contacto Principal",
    };





    const formattedSocialMediaLinks = socialMediaLinks.map((link: any) => {
      const { __typename, ...restLinkProps } = link;
      return {
        platform: restLinkProps.platform,
        url: restLinkProps.url,
      };
    });

    const formattedFullContactInfo = [...formattedSocialMediaLinks, ...cleanedLinks];



    const coverageStates = formattedOffices?.map(
      (office: OrganizationOfficeInputType) => Number(office?.address?.stateId)
    ).filter(Boolean) || [];

    const mutationVariables = {
      input: {
        id: targetUserId,
        type: company?.type,
        name: input?.name,
        suppliers: input?.suppliers || [],
        lineOfBusiness: input?.segment,
        foundationYear: Number(input?.yearsOfExperience) || 2024,
        license: `${input?.licenseType}${input?.license}`.replace(/--/g, '-'),
        identification: `${input?.identificationType}${input?.identification}`,
        motto: input?.motto,
        offices: formattedOffices,
        coverageStates: coverageStates,
        modality: company?.modality,
        contact: formattedContact,
        socialMediaLinks: formattedFullContactInfo || [],
      },
    };

    console.log("mutationVariables", mutationVariables)



    if (input?.logoFile) {
      if (!targetUserId) {
        toast.error("No se pudo actualizar el logo, intenta de nuevo más tarde");
        return;
      }
      console.log('input.logoFile', input.logoFile);
      handleUpdateLogo(targetUserId, input.logoFile);
    }

    try {
      if (emailChanged) {
        if (isSelfUpdate) {
          if (!input.password?.trim()?.length) {
            toast.error("Debes introducir tu contraseña para actualizar el correo");
            setIsUpdatingCompany(false);
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
    } catch (err: any) {
      console.error("Email update error:", err);
      toast.error(err?.message || GENERIC_TOAST_ERROR_MESSAGE);
      setIsUpdatingCompany(false);
      return;
    }

    updateCompany({
      variables: mutationVariables,
    })
      .then((response) => {
        console.log('Insurance company update success response:', response);
        toast.success("Información actualizada correctamente");
        refetchCompany();
      })
      .catch((error) => {
        console.error('Insurance company update error:', error);
        console.error('Error details:', error.graphQLErrors);
        console.error('Network error:', error.networkError);
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      })
      .finally(() => setIsUpdatingCompany(false));
  };

  const showLoading = loadingCompany;

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
          error={!requiredFields.name}
          placeholder="Nombre completo"
          showFloatingLabel
          disabled={loadingCompany || isUpdatingCompany}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
        />

        <div className="col-span-1 flex flex-col gap-2">
          <div className="col-span-1 flex flex-col gap-2">
            <TextInput
              name="email"
              className="col-span-1"
              error={!requiredFields.email}
              placeholder="Correo electrónico"
              showFloatingLabel
              disabled={loadingCompany || isUpdatingCompany}
              onChange={(e) => handleInputChange("email", e.target.value)}
              value={input?.email}
            />
            {isSelfUpdate && emailChanged && (
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

        </div>


        <SelectMultiple
          label="Ramos con los que trabajas"
          showFloatingLabel
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
            options: INSURANCE_COMPANY_LICENSE_TYPE_OPTIONS,
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
          showFloatingLabel
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
          onImageChange={(url: string | null, file?: File) => {
            handleInputChange("logoUrl", url || '');
            if (file) {
              setInput(prev => {
                const newState = { ...prev, logoFile: file };
                return newState;
              });
            }
          }}
          placeholder="Subir logo de la empresa"
          aspect={1}
        />

        <LocalContactInput
          links={company?.socialMediaLinks || []}
          contact={contact}
          onContactChange={setContact}
          setHasLocalContact={setHasLocalContact}
          disabled={loadingCompany || isUpdatingCompany}
        />

        <SocialMediaInput
          setHasSocialLinks={() => { }}
          socialMediaLinks={socialMediaLinks}
          onSocialLinksChange={setSocialMediaLinks}
          disabled={loadingCompany || isUpdatingCompany}
        />
      </div>

      <div className="w-full flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="w-full font-bold col-span-2">Datos adicionales</h3>

        <TextInput
          name="motto"
          className="col-span-1"
          placeholder="Lema"
          showFloatingLabel
          disabled={loadingCompany || isUpdatingCompany}
          onChange={(e) => handleInputChange("motto", e.target.value)}
          value={input?.motto}
        />

        <LocalOfficesInput
          disabled={loadingCompany || isUpdatingCompany}
          offices={offices}
          onOfficesChange={setOffices}
        />

        <SelectMultiple
          label="Proveedores"
          showFloatingLabel
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
                  src={option?.data?.image || "/images/placeholder.webp"}
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

