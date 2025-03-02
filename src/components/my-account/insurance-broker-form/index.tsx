import React, { useState } from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import {
  DEFAULT_PHONE_CODE,
  IDENTIFICATION_TYPE_OPTIONS,
  LICENSE_TYPE_OPTIONS,
  MODALITY_OPTIONS,
  PHONE_CODE_OPTIONS,
  SELECT_LINE_OF_BUSINESS_OPTIONS,
} from "@/constants/forms";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { useQuery } from "@apollo/client";
import {
  COUNTRY_BY_CODE_QUERY,
  PUBLIC_INSURANCE_COMPANIES_QUERY,
} from "@/lib/sektor-api/queries";
import SelectWithTextInput from "@/components/ui/select-with-text-input";
import {
  faAddressCard,
  faArrowUpFromBracket,
  faHashtag,
  faPhone,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import Select from "@/components/ui/select";
import { Upload } from "antd";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const InsuranceBrokerForm = () => {
  const {
    data: insuranceCompaniesResponse,
    loading: loadingInsuranceCompanies,
    error,
  } = useQuery<Query>(PUBLIC_INSURANCE_COMPANIES_QUERY);
  const { data: countryDataResponse, loading: isLoadingCountryData } =
    useQuery<Query>(COUNTRY_BY_CODE_QUERY, { variables: { code: "VE" } });
  const countryStates = countryDataResponse?.getCountryByCode?.states || [];
  const countryStateOptions = [
    {
      label: "Zona de alcance (estado)",
      value: "",
      disabled: true,
      hidden: true,
    },
    ...countryStates?.map(({ id, name }) => ({
      label: name,
      value: id,
    })),
  ];

  const insuranceCompanies =
    insuranceCompaniesResponse?.publicInsuranceCompanies?.items || [];
  const insuranceCompanyOptions = [
    ...insuranceCompanies?.map(({ id, name }) => ({
      label: name,
      value: id,
    })),
  ];

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const [localImageUrl, setLocalImageUrl] = useState("");
  const [localImageFile, setLocalImageFile] = useState(null);
  const [loadingLocalImage, setLoadingLocalImage] = useState(false);

  console.log("Image", {
    localImageUrl,
    localImageFile,
    loadingLocalImage,
  });

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const handleChange = (info) => {
    if (
      info.file.type !== "image/jpeg" &&
      info.file.type !== "image/png" &&
      info.file.type !== "image/svg+xml"
    ) {
      toast.error(
        "Solo puedes agregar archivos que terminen en .png, .jpeg y .svg"
      );
      return;
    }
    if (info.file.size > 10000000) {
      toast.error("Solo puedes cargar archivos que pesen máximo 10MB");
      return;
    }
    if (info.file.status === "uploading") {
      setLoadingLocalImage(true);
      return;
    }
    if (info.file.status === "done") {
      setLocalImageFile(info.file);
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLocalImageUrl(imageUrl);
        setLoadingLocalImage(false);
      });
    }
  };

  console.log("insuranceCompanyOptions", insuranceCompanyOptions);

  const [input, setInput] = useState({
    fullName: "",
    companies: "",
    license: "",
    licenseType: LICENSE_TYPE_OPTIONS[0].value,
    segment: "",
    identification: "",
    identificationType: IDENTIFICATION_TYPE_OPTIONS[0].value,
    modality: "",
    coverageState: "",
    yearsOfExperience: "",
    phone: "",
    phoneCode: DEFAULT_PHONE_CODE,
    profilePicture: "",
  });

  const [errors, setErrors] = useState({
    fullName: [],
    companies: [],
    license: [],
    segment: [],
    identification: [],
    identificationType: [],
    modality: [],
    coverageState: [],
    yearsOfExperience: [],
    phone: [],
    phoneCode: [],
    profilePicture: [],
  });

  return (
    <section className="border-2 border-blue-500 py-5 w-full flex flex-col items-center justify-center gap-10 font-century-gothic">
      <div className="w-full border-2 border-green-500 flex flex-col gap-7 md:gap-10 md:grid md:grid-cols-2">
        <h3 className="col-span-2">Datos obligatorios</h3>

        <TextInput
          name="fullName"
          className="col-span-1"
          placeholder="Nombre completo"
          error={Boolean(errors?.fullName.length)}
          errors={errors?.fullName}
          // disabled={loading}
          // onChange={handleInputChange}
          value={input.fullName}
        />

        <SelectMultiple
          wrapperClassName="w-full"
          selectProps={{
            placeholder: "Compañias con las que trabajas",
            options: insuranceCompanyOptions,
            notFoundContent: "No hay opciones disponibles",
          }}
        />

        <SelectWithTextInput
          errors={errors.license}
          selectProps={{
            name: "licenseType",
            icon: faHashtag,
            value: input.licenseType,
            wrapperClassName: "w-56",
            className: "border-r-0",
            options: LICENSE_TYPE_OPTIONS,
            // onChange: handleInputChange,
            // error: Boolean(errors.licenseType.length),
          }}
          textInputProps={{
            name: "license",
            placeholder: "123456",
            error: Boolean(errors.license.length),
            // disabled: loading,
            // onChange: handleInputChange,
            minLength: 6,
            maxLength: 6,
            value: input.license,
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
          }}
        />

        <SelectWithTextInput
          errors={errors.license}
          selectProps={{
            name: "identificationType",
            icon: faAddressCard,
            value: input.identificationType,
            wrapperClassName: "w-36",
            className: "border-r-0",
            options: IDENTIFICATION_TYPE_OPTIONS,
            // onChange: handleInputChange,
            // error: Boolean(errors.licenseType.length),
          }}
          textInputProps={{
            name: "identification",
            placeholder: "1234567890",
            error: Boolean(errors.license.length),
            // disabled: loading,
            // onChange: handleInputChange,
            minLength: 6,
            maxLength: 10,
            value: input.identification,
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
          value={input.modality}
          options={MODALITY_OPTIONS}
          // disabled={loading}
          // onChange={handleInputChange}
          error={Boolean(errors.coverageState.length)}
          errors={errors.coverageState}
        />

        <Select
          name="coverageState"
          value={input.coverageState}
          options={countryStateOptions}
          // disabled={loading}
          // onChange={handleInputChange}
          error={Boolean(errors.coverageState.length)}
          errors={errors.coverageState}
        />

        <TextInput
          name="yearsOfExperience"
          placeholder="Años de experiencia"
          error={Boolean(errors?.yearsOfExperience.length)}
          errors={errors?.yearsOfExperience}
          // disabled={loading}
          // onChange={handleIn putChange}
          type="number"
          value={input?.yearsOfExperience}
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
            // disabled: loading,
            // onChange: handleInputChange,
            error: Boolean(errors.phoneCode.length),
          }}
          textInputProps={{
            name: "phone",
            placeholder: "Teléfono",
            type: "tel",
            error: Boolean(errors.phone.length),
            // disabled: loading,
            // onChange: handleInputChange,
            maxLength: 10,
            value: input.phone,
          }}
        />

        <Upload
          className="w-full border rounded-xl font-century-gothic h-12 p-4 border-blue-500 relative cursor-pointer"
          name="localLogo"
          listType="picture"
          showUploadList={false}
          onChange={handleChange}
        >
          <div className="flex items-center justify-between gap-2 absolute w-full h-full top-0 left-0 p-4">
            <Image
              src={localImageUrl}
              alt="Profile picture"
              width={50}
              height={50}
            />

            <span className="block w-full">
              {loadingLocalImage && "Cargando imagen..."}
              {!localImageFile?.name && "Subir foto de perfil"}
              {localImageFile?.name &&
                !loadingLocalImage &&
                localImageFile?.name}
            </span>

            <FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />
          </div>
        </Upload>
      </div>

      <div className="w-full border-2 border-orange-500">
        <h3>Datos adicionales</h3>
      </div>
    </section>
  );
};

export default InsuranceBrokerForm;
