/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import {
  OrganizationOfficeInputType,
  OrganizationOfficeType,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { faCircleXmark, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalProps } from "antd";
import { ObjectId } from "bson";
import Select from "@/components/ui/select";
import { useQuery } from "@apollo/client";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries";
import UploadInput from "@/components/ui/upload-input";
import { DEFAULT_PHONE_CODE, PHONE_CODE_OPTIONS } from "@/constants/forms";
import SelectWithTextInput from "@/components/ui/select-with-text-input";

interface OfficeModalProps extends ModalProps {
  open: boolean;
  officeToEdit?: any;
  setOpenOfficeModal: (value: React.SetStateAction<boolean>) => void;
  offices: OrganizationOfficeType[];
  onOfficesChange?: (offices: OrganizationOfficeInputType[]) => void;
}

const LocalOfficeModal = ({
  open,
  setOpenOfficeModal,
  offices,
  onOfficesChange,
  officeToEdit,
  ...modalProps
}: OfficeModalProps) => {
  const isEditing = Boolean(officeToEdit?.id);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [input, setInput] = useState<OrganizationOfficeInputType>({
    id: "",
    phone: "",
    phoneCode: DEFAULT_PHONE_CODE,
    schedule: [],
    photoUrl: undefined,
    address: {
      cityId: 0,
      countryId: 1,
      stateId: 0,
      street: "",
    },
  } as OrganizationOfficeInputType);

  useEffect(() => {
    if (officeToEdit?.id) {
      const phoneCodes = PHONE_CODE_OPTIONS.map(({ value }) => value);
      const userPhone = officeToEdit?.phone || "";
      const userPhoneCode =
        phoneCodes.find((code) => userPhone.startsWith(code)) || DEFAULT_PHONE_CODE;
      const userPhoneWithoutCode = userPhoneCode ? userPhone.substring(userPhoneCode.length) : userPhone;

      setInput({
        id: officeToEdit?.id,
        schedule: officeToEdit?.schedule || [],
        photoUrl: officeToEdit?.photoUrl || undefined,
        phone: userPhoneWithoutCode || "",
        phoneCode: userPhoneCode || DEFAULT_PHONE_CODE,
        address: {
          cityId: officeToEdit?.address?.cityId || 1,
          countryId: officeToEdit?.address?.countryId || 1,
          stateId: officeToEdit?.address?.stateId || 1,
          street: officeToEdit?.address?.street || "",
        },
      } as OrganizationOfficeInputType);
    } else {

      setInput({
        id: "",
        phone: "",
        phoneCode: DEFAULT_PHONE_CODE,
        schedule: [],
        photoUrl: undefined,
        address: {
          cityId: 0,
          countryId: 1,
          stateId: 0,
          street: "",
        },
      } as OrganizationOfficeInputType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeToEdit]);

  const handleClose = () => {
    setInput({
      id: "",
      phone: "",
      phoneCode: DEFAULT_PHONE_CODE,
      schedule: [],
      photoUrl: undefined,
      address: {
        cityId: 0,
        countryId: 1,
        stateId: 0,
        street: "",
      },
    } as OrganizationOfficeInputType);
    setOpenOfficeModal(false);
  };

  const handleEdit = () => {
    if (officeToEdit?.id && onOfficesChange) {
      const officesArray = Array.isArray(offices) ? offices : [];
      const updatedOffices = officesArray.map((office) =>
        office?.id === officeToEdit?.id
          ? {
            ...office,
            ...input,
            photoUrl: input.photoUrl || undefined
          }
          : office
      );
      const formattedOffices = updatedOffices.map(
        ({ phone: basePhone, phoneCode, ...restOfficeProps }: any) => ({
          phone: basePhone.startsWith('+') ? basePhone : `${phoneCode || DEFAULT_PHONE_CODE}${basePhone}`,
          ...restOfficeProps,
        })
      );
      onOfficesChange(formattedOffices as OrganizationOfficeInputType[]);
    }
    handleClose();
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEdit();
      return;
    }

    if (!onOfficesChange) return;

    const { phone, phoneCode, ...restInputProps } = input as any;
    const officesArray = Array.isArray(offices) ? offices : [];
    const formattedPhone = phone.startsWith('+') ? phone : `${phoneCode || DEFAULT_PHONE_CODE}${phone}`;

    const newOffice = {
      ...restInputProps,
      id: new ObjectId().toHexString(),
      phone: formattedPhone,
      photoUrl: input.photoUrl || undefined,
    };


    const existingIndex = officesArray.findIndex(office => {
      const officePhone = (office as any).phone || (office as any).phoneCode + (office as any).phone;
      const officeCityId = (office as any).address?.cityId || (office as any).address?.city?.id;
      return (
        office.address?.street?.toLowerCase().trim() === newOffice.address?.street?.toLowerCase().trim() &&
        officeCityId === newOffice.address?.cityId &&
        (officePhone === formattedPhone || office.phone === formattedPhone)
      );
    });

    if (existingIndex !== -1) {

      const updatedOffices = officesArray.map((office, index) =>
        index === existingIndex ? newOffice : office
      );
      onOfficesChange(updatedOffices);
    } else {
      onOfficesChange([...officesArray, newOffice]);
    }

    handleClose();
  };

  const hasEmptyFields =
    !input?.address?.cityId ||
    !input?.address?.stateId ||
    !input?.phone?.trim()?.length ||
    !input?.address?.street?.trim()?.length;

  const { data: countryDataResponse, loading: isLoadingCountryData } =
    useQuery<Query>(COUNTRY_BY_CODE_QUERY, { variables: { code: "VE" } });

  const countryStates = countryDataResponse?.getCountryByCode?.states || [];

  const stateOptions = [
    {
      label: "Seleccione un estado",
      value: 0,
      disabled: true,
      hidden: true,
    },
    ...countryStates
      ?.map(({ id, name }) => ({
        label: name,
        value: id,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  ];

  let citiesOptionsMap = {};
  countryStates.forEach(({ id, cities }) => {
    citiesOptionsMap = {
      ...citiesOptionsMap,
      [id]: cities
        ?.map(({ id, name }) => ({
          label: name,
          value: id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    };
  });

  const cityOptions = [
    {
      label: "Seleccione una ciudad",
      value: 0,
      disabled: true,
      hidden: true,
    },
    ...(citiesOptionsMap[input?.address?.stateId] || []),
  ];

  return (
    <Modal
      open={open}
      closeIcon={null}
      footer={null}
      onClose={handleClose}
      onCancel={handleClose}
      {...modalProps}
    >
      <section className="text-blue-500 flex flex-col gap-10 pb-10">
        <header className="flex flex-col gap-4">
          <div className="w-full flex justify-end">
            <FontAwesomeIcon
              icon={faCircleXmark}
              size="2xl"
              className="cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <h2 className="text-xl font-bold md:text-3xl">
            {isEditing ? "Editar oficina" : "Añadir oficina"}
          </h2>
        </header>
        <div
          className="flex flex-col gap-8 items-center"
          onSubmit={handleSubmit}
        >
          <Select
            value={input?.address?.stateId}
            options={stateOptions}
            disabled={isLoadingCountryData}
            onChange={(e) => {
              const newValue = e.target?.value;
              setInput((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  stateId: Number(newValue),
                  cityId: 0,
                },
              }));
            }}
          />
          <Select
            value={input?.address?.cityId}
            options={cityOptions}
            disabled={isLoadingCountryData || !input?.address?.stateId}
            onChange={(e) => {
              const newValue = e.target?.value;
              setInput((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  cityId: Number(newValue),
                },
              }));
            }}
          />

          <TextInput
            placeholder="Dirección completa"
            value={input?.address?.street}
            disabled={isLoadingCountryData}
            required
            onChange={(e) => {
              setInput((prev) => ({
                ...prev,
                address: {
                  ...prev.address,
                  street: e?.target?.value,
                },
              }));
            }}
          />

          <SelectWithTextInput
            selectProps={{
              name: "phoneCode",
              icon: faPhone,
              // @ts-expect-error - Bypassing typescript error
              value: input?.phoneCode,
              wrapperClassName: "w-60",
              className: "border-r-0",
              disabled: isLoadingCountryData || isUploadingLogo,
              options: PHONE_CODE_OPTIONS,
              onChange: (e) => {
                setInput((prev) => ({
                  ...prev,
                  phoneCode: e.target.value,
                }));
              },
            }}
            textInputProps={{
              name: "phone",
              placeholder: "Teléfono",
              type: "tel",
              disabled: isLoadingCountryData || isUploadingLogo,
              onChange: (e) => {
                setInput((prev) => ({ ...prev, phone: e.target.value }));
              },
              maxLength: 10,
              value: input?.phone as string,
            }}
          />

          <UploadInput
            placeholder="Foto de la oficina"
            imageUrl={input?.photoUrl || ""}
            setIsUploadingLogo={setIsUploadingLogo}
            disabled={isLoadingCountryData}
            onImageChange={(url: string | null) => {
              setInput((prev) => ({
                ...prev,
                photoUrl: url || undefined,
              }));
            }}
            aspect={16 / 9}
          />

          <Button
            variant="solid-blue"
            onClick={handleSubmit}
            className="w-fit px-10"
            disabled={hasEmptyFields || isLoadingCountryData || isUploadingLogo}
          >
            Guardar
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default LocalOfficeModal;
