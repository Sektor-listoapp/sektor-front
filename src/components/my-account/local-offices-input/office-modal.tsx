/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import {
  OrganizationOfficeInputType,
  OrganizationOfficeType,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalProps } from "antd";
import { ObjectId } from "bson";
import Select from "@/components/ui/select";
import { useQuery } from "@apollo/client";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries";

interface OfficeModalProps extends ModalProps {
  officeToEdit?: any;
  setOpenOfficeModal: (value: React.SetStateAction<boolean>) => void;
  localOffices: OrganizationOfficeType[];
  setLocalOffices: React.Dispatch<
    React.SetStateAction<OrganizationOfficeInputType[]>
  >;
}

const LocalOfficeModal = ({
  setOpenOfficeModal,
  localOffices,
  setLocalOffices,
  officeToEdit,
  ...modalProps
}: OfficeModalProps) => {
  const isEditing = Boolean(officeToEdit?.id);
  const [input, setInput] = useState<OrganizationOfficeInputType>({
    id: "",
    phone: "+584120000000",
    schedule: [],
    address: {
      cityId: 0,
      countryId: 1,
      stateId: 0,
      street: " ",
    },
  });

  useEffect(() => {
    if (officeToEdit?.id) {
      setInput({
        id: officeToEdit?.id,
        phone: officeToEdit?.phone || "+584120000000",
        schedule: officeToEdit?.schedule || [],
        address: {
          cityId: officeToEdit?.address?.cityId || 1,
          countryId: officeToEdit?.address?.countryId || 1,
          stateId: officeToEdit?.address?.stateId || 1,
          street: officeToEdit?.address?.street || " ",
        },
      });
    }
  }, [officeToEdit]);

  const handleClose = () => {
    setInput({
      id: "",
      phone: "+584120000000",
      schedule: [],
      address: {
        cityId: 0,
        countryId: 1,
        stateId: 0,
        street: "",
      },
    });
    setOpenOfficeModal(false);
  };

  const handleEdit = () => {
    if (officeToEdit?.id) {
      const updatedOffices = localOffices.map((office) =>
        office?.id === officeToEdit?.id ? { ...office, ...input } : office
      );
      setLocalOffices(updatedOffices as OrganizationOfficeInputType[]);
    }
    handleClose();
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEdit();
      return;
    }

    setLocalOffices([
      ...(localOffices as unknown as OrganizationOfficeInputType[]),
      { ...input, id: new ObjectId().toHexString() },
    ]);
    handleClose();
  };

  const hasEmptyFields =
    !input?.address?.street?.trim() ||
    !input?.address?.cityId ||
    !input?.address?.stateId;

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
    ...countryStates?.map(({ id, name }) => ({
      label: name,
      value: id,
    })),
  ];

  let citiesOptionsMap = {};
  countryStates.forEach(({ id, cities }) => {
    citiesOptionsMap = {
      ...citiesOptionsMap,
      [id]: cities?.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
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
            placeholder="Calle"
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

          <Button
            variant="solid-blue"
            onClick={handleSubmit}
            className="w-fit px-10"
            disabled={hasEmptyFields}
          >
            Guardar
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default LocalOfficeModal;
