/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import {
  Mutation,
  OrganizationOfficeInputType,
  Query,
  SocialMediaLinkType,
} from "@/lib/sektor-api/__generated__/types";
import { useMutation, useQuery } from "@apollo/client";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@/store/auth";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import { UPDATE_SUPPLIER } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import {
  // LICENSE_TYPE_OPTIONS,
  IDENTIFICATION_TYPE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
  SELECT_SUPPLIER_SERVICE_OPTIONS,
} from "@/constants/forms";
import {
  PUBLIC_INSURANCE_COMPANIES_QUERY,
  PUBLIC_SUPPLIER_BY_ID_QUERY,
  ORGANIZATION_BY_ID_QUERY,
} from "@/lib/sektor-api/queries";
import { ADMIN_UPDATE_USER_EMAIL, UPDATE_EMAIL } from "@/lib/sektor-api/mutations";
import LocalOfficesInput from "../local-offices-input";
import Select from "@/components/ui/select";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import UploadInput from "@/components/ui/upload-input";
import { FormProps } from "@/types/forms";
import SocialMediaInput from "../social-media-input";
import { UPDATE_ORGANIZATION_LOGO } from "@/lib/sektor-api/mutations/my-account/update-organization-logo";
import InsuranceCompaniesInput from "../insurance-companies-input";


type supplierIdProps = FormProps;

const SupplierForm = ({ userId }: supplierIdProps) => {
  const loggedUserId = useAuthStore(useShallow((state) => state.user?.id));
  const targetUserId = userId || loggedUserId;
  const [isUpdatingSupplier, setIsUpdatingSupplier] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [hasSocialLinks, setHasSocialLinks] = useState(false);
  const [hasInsuranceCompanies, setHasInsuranceCompanies] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  console.log('hasSocialLinks: ', hasSocialLinks);
  console.log('hasInsuranceCompanies: ', hasInsuranceCompanies);

  const [updateSupplier] = useMutation<Mutation>(UPDATE_SUPPLIER);
  const [updateEmailMutation] = useMutation<Mutation>(UPDATE_EMAIL);
  const [adminUpdateUserEmailMutation] = useMutation<Mutation>(ADMIN_UPDATE_USER_EMAIL);

  const [updateOrganizationLogo] = useMutation<Mutation>(UPDATE_ORGANIZATION_LOGO);

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

  const {
    data: organizationResponse,
  } = useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
    variables: { id: targetUserId },
    skip: !targetUserId,
  });
  const originalEmail = organizationResponse?.organizationById?.email || "";


  const insuranceCompanies =
    insuranceCompaniesResponse?.publicInsuranceCompanies?.items || [];

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
    email: "",
    segment: [],
    identification: "",
    identificationType: "",
    serviceType: "",
    logoUrl: "",
    logoFile: null as File | null,
    // additional
    motto: "",
    insuranceCompanies: [],
    password: "",
  });

  const [offices, setOffices] = useState<OrganizationOfficeInputType[]>([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLinkType[]>([]);
  const [insuranceCompanyRelations, setInsuranceCompanyRelations] = useState<any[]>([]);

  useEffect(() => {
    // const licenseParts = supplier?.license?.split("-") || [];
    // const licenseType = licenseParts[0] || "";
    // const license = licenseParts.slice(1).join("-") || "";

    const identificationParts = supplier?.identification?.split("-") || [];
    const identificationType = identificationParts[0] || "";
    const identification = identificationParts.slice(1).join("-") || "";

    const insuranceCompaniesIds = (supplier?.insuranceCompanies?.map(
      ({ id }) => id
    ) || []) as never[];

    const formattedInsuranceCompanyRelations = supplier?.insuranceCompanyRelations?.map(relation => ({
      insuranceCompanyId: relation.insuranceCompanyId,
      depositRequired: relation.depositRequired,
      fullyContractedClinic: relation.fullyContractedClinic,
      reasonableExpensesApplicable: relation.reasonableExpensesApplicable
    })) || [];

    setInput({
      name: supplier?.name || "",
      email: organizationResponse?.organizationById?.email || "",
      insuranceCompanies: insuranceCompaniesIds || [],
      segment: (supplier?.lineOfBusiness || []) as never[],
      identification: identification || "",
      identificationType:
        `${identificationType}-` || IDENTIFICATION_TYPE_OPTIONS[0].value,
      serviceType: supplier?.serviceType || "",
      motto: supplier?.motto || "",
      logoUrl: supplier?.logoUrl || "",
      logoFile: null,
      password: "",
    });

    setOffices(formattedOffices || []);
    setSocialMediaLinks(supplier?.socialMediaLinks || []);
    setInsuranceCompanyRelations(formattedInsuranceCompanyRelations);
  }, [supplier, organizationResponse]);

  const requiredFields = {
    name: Boolean(input.name?.trim()?.length),
    email: Boolean(input.email?.trim()?.length),
    segment: Boolean(input?.segment?.length),
    identification: Boolean(input.identification?.trim()?.length),
    logoUrl: Boolean(input.logoUrl?.trim()?.length),
  };
  const isSelfUpdate = loggedUserId === targetUserId;
  const emailChanged = Boolean(input.email && input.email !== originalEmail);

  const hasErrors = Object.values(requiredFields).some((field) => !field);

  if (supplierError) {
    toast.error(
      supplierError?.message ||
      "Ha ocurrido un error obteniendo la información de tu cuenta, intenta de nuevo más tarde"
    );
  }

  const handleInputChange = (
    field: keyof typeof input,
    value: string | string[] | React.ChangeEvent<HTMLSelectElement> | any[] | null
  ) => {
    if (field in input) {
      setInput((prev) => ({
        ...prev,
        [field]: value || "",
      }));
    }
  };


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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();



    setIsUpdatingSupplier(true);

    const formattedOffices = offices.map((office: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename: _, address, schedule = [], ...restOfficeProps } = office;

      const formattedSchedule = schedule.map((scheduleItem: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __typename: __, ...restScheduleProps } = scheduleItem;
        return restScheduleProps;
      });

      return {
        ...restOfficeProps,
        photoUrl: office.photoUrl || restOfficeProps.photoUrl,
        schedule: formattedSchedule,
        address: {
          cityId: address?.cityId || address?.city?.id,
          countryId: address?.countryId || address?.country?.id,
          stateId: address?.stateId || address?.state?.id,
          street: address?.street,
        },
      };
    });

    const formattedSocialMediaLinks = socialMediaLinks.map((link: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, ...restLinkProps } = link;
      return {
        platform: restLinkProps.platform,
        url: restLinkProps.url,
      };
    });

    const formattedInsuranceCompanyRelations = insuranceCompanyRelations.map((relation: any) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __typename, ...restRelationProps } = relation;
      return {
        insuranceCompanyId: restRelationProps.insuranceCompanyId,
        depositRequired: restRelationProps.depositRequired || false,
        fullyContractedClinic: restRelationProps.fullyContractedClinic || false,
        reasonableExpensesApplicable: restRelationProps.reasonableExpensesApplicable || false,
      };
    });



    const mutationVariables = {
      input: {
        id: targetUserId,
        name: input?.name || "",
        type: supplier?.type || "Supplier",
        lineOfBusiness: input?.segment || [],
        coverageStates: supplier?.coverageStates || [],
        foundationYear: supplier?.foundationYear || 0,
        services: supplier?.services?.map((service: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { __typename, ...restServiceProps } = service;
          return restServiceProps;
        }) || [],
        allies: supplier?.allies?.map((ally: any) => ally.id) || [],
        // license: `${input?.licenseType}${input?.license}`.replace(/--/g, '-'),
        identification: `${input?.identificationType}${input?.identification}`,
        motto: input?.motto,
        insuranceCompanies: formattedInsuranceCompanyRelations.length > 0
          ? formattedInsuranceCompanyRelations.map(rel => rel.insuranceCompanyId)
          : input?.insuranceCompanies || [],
        insuranceCompanyRelations: formattedInsuranceCompanyRelations,
        offices: formattedOffices || [],
        modality: supplier?.modality || "Physical",
        serviceType: input?.serviceType || "CLINIC",
        socialMediaLinks: formattedSocialMediaLinks || [],
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
            setIsUpdatingSupplier(false);
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
      setIsUpdatingSupplier(false);
      return;
    }

    updateSupplier({
      variables: mutationVariables,
    })
      .then((response) => {
        console.log('Supplier update success response:', response);
        toast.success("Información actualizada correctamente");
        refetchSupplier();
      })
      .catch((error) => {
        console.error('Supplier update error:', error);
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      })
      .finally(() => setIsUpdatingSupplier(false));
  };

  const showLoading = loadingSupplier;

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
          disabled={loadingSupplier || isUpdatingSupplier}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
          error={!requiredFields.name}
        />
        <div className="col-span-1 flex flex-col gap-2">
          <TextInput
            name="email"
            className="col-span-1"
            placeholder="Correo electrónico"
            showFloatingLabel
            disabled={loadingSupplier || isUpdatingSupplier}
            onChange={(e) => handleInputChange("email", e.target.value)}
            value={input?.email}
            error={!requiredFields.email}
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
                  value={input?.password as unknown as string}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 my-auto right-3 text-blue-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <span className="sr-only">Toggle password</span>
                  {/* using fontawesome icon via svg path */}
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                    {showPassword ? (
                      // eye-slash
                      <path d="M572.52 241.4C518.9 135.5 407.8 64 288 64S57.1 135.5 3.48 241.4a48.07 48.07 0 000 29.2C57.1 376.5 168.2 448 288 448s230.9-71.5 284.52-177.4a48.07 48.07 0 000-29.2zM288 400c-97.05 0-183.2-57.37-233.7-144C104.8 169.4 190.9 112 288 112c97.05 0 183.2 57.37 233.7 144C471.2 342.6 385.1 400 288 400zm0-240a96 96 0 1096 96 96.14 96.14 0 00-96-96z" />
                    ) : (
                      // eye
                      <path d="M572.52 241.4C518.9 135.5 407.8 64 288 64S57.1 135.5 3.48 241.4a48.07 48.07 0 000 29.2C57.1 376.5 168.2 448 288 448s230.9-71.5 284.52-177.4a48.07 48.07 0 000-29.2zM288 400c-97.05 0-183.2-57.37-233.7-144C104.8 169.4 190.9 112 288 112c97.05 0 183.2 57.37 233.7 144C471.2 342.6 385.1 400 288 400zm0-208a112 112 0 10112 112A112.12 112.12 0 00288 192z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          )}

        </div>


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

        {/* <SelectWithTextInput
          selectProps={{
            name: "licenseType",
            icon: faHashtag,
            value: input?.licenseType,
            wrapperClassName: "w-56",
            className: "border-r-0",
            options: LICENSE_TYPE_OPTIONS,
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
        /> */}

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
          onImageChange={(url: string | null, file?: File) => {
            handleInputChange("logoUrl", url || '');
            if (file) {
              setInput(prev => {
                const newState = { ...prev, logoFile: file };
                return newState;
              });
            }
          }}
          placeholder="Subir logo del proveedor"
          aspect={1}
        />

        <SocialMediaInput
          setHasSocialLinks={setHasSocialLinks}
          socialMediaLinks={socialMediaLinks}
          onSocialLinksChange={setSocialMediaLinks}
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
          offices={offices}
          onOfficesChange={setOffices}
        />



        <Select
          value={input?.serviceType}
          options={SELECT_SUPPLIER_SERVICE_OPTIONS}
          disabled={loadingSupplier || isUpdatingSupplier}
          onChange={(e) => handleInputChange("serviceType", e?.target?.value)}
          wrapperClassName="w-full"
        />

        <InsuranceCompaniesInput
          setHasInsuranceCompanies={setHasInsuranceCompanies}
          insuranceCompanyRelations={insuranceCompanyRelations}
          onRelationsChange={setInsuranceCompanyRelations}
          insuranceCompanies={insuranceCompanies}
          disabled={loadingInsuranceCompanies || isUpdatingSupplier}
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
