import React, { useEffect, useState } from "react";
import TextInput from "@/components/ui/text-input";
import { Mutation, Query } from "@/lib/sektor-api/__generated__/types";
import { useMutation, useQuery } from "@apollo/client";
import Select from "@/components/ui/select";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@/store/auth";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import { UPDATE_CUSTOMER } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { SELECT_GENRE_OPTIONS } from "@/constants/forms";
import SektorFullVerticalLogo from "@/components/icons/sektor-full-vertical-logo";
import { CUSTOMER_BY_ID_QUERY } from "@/lib/sektor-api/queries/auth/customer-by-id";
import DatePicker from "@/components/ui/date-picker";
import dayjs from "dayjs";
import {
  faPerson,
  faPersonHalfDress,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const CustomerForm = () => {
  const userId = useAuthStore(useShallow((state) => state.user?.id));
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);

  const {
    data: customerDataResponse,
    error: customerError,
    loading: customerLoading,
    refetch: refetchCustomer,
  } = useQuery<Query>(CUSTOMER_BY_ID_QUERY, { variables: { id: userId } });

  const customerData = customerDataResponse?.customerById;

  const [updateCustomer] = useMutation<Mutation>(UPDATE_CUSTOMER);

  const [input, setInput] = useState({
    name: "",
    email: "",
    birthDate: "",
    sex: "",
  });

  useEffect(() => {
    const { name, email, sex, birthdate } = customerData || {};
    setInput({
      sex: sex || "",
      name: name || "",
      email: email || "",
      birthDate: birthdate || "",
    });
  }, [customerData]);

  const requiredFields = {
    name: Boolean(input?.name?.trim()?.length),
    email: Boolean(input?.email?.trim()?.length),
    birthDate: Boolean(input?.birthDate?.trim()?.length),
    sex: Boolean(input?.sex?.trim()?.length),
  };

  const hasErrors = Object.values(requiredFields).some((field) => !field);

  if (customerError) {
    toast.error(
      customerError?.message ||
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

    setIsUpdatingCustomer(true);

    updateCustomer({
      variables: {
        input: {
          id: userId,
          sex: input?.sex,
          name: input?.name,
          email: input?.email,
          birthdate: input?.birthDate,
        },
      },
    })
      .then(() => {
        toast.success("Información actualizada correctamente");
        refetchCustomer();
      })
      .catch((error) => {
        toast.error(error?.message || GENERIC_TOAST_ERROR_MESSAGE);
      })
      .finally(() => setIsUpdatingCustomer(false));
  };

  const showLoading = customerLoading;

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
          icon={faPerson}
          error={!requiredFields.name}
          disabled={customerLoading || isUpdatingCustomer}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
        />
        <TextInput
          name="email"
          className="col-span-1"
          icon={faUser}
          type="email"
          placeholder="Correo electrónico"
          error={!requiredFields.email}
          disabled={customerLoading || isUpdatingCustomer}
          onChange={(e) => handleInputChange("email", e.target.value)}
          value={input?.email}
        />
        <DatePicker
          name="birthdate"
          placeholder="Fecha de nacimiento"
          disabled={customerLoading || isUpdatingCustomer}
          error={!requiredFields.birthDate}
          value={input?.birthDate ? dayjs(input?.birthDate) : undefined}
          maxDate={dayjs()}
          format="DD/MM/YYYY"
          onChange={(_, dateString) => {
            handleInputChange("birthDate", dateString);
          }}
        />
        <Select
          name="sex"
          value={input?.sex}
          options={SELECT_GENRE_OPTIONS}
          icon={faPersonHalfDress}
          disabled={customerLoading || isUpdatingCustomer}
          onChange={(e) => {
            handleInputChange("sex", e.target.value);
          }}
          error={!requiredFields.sex}
        />
      </div>

      <Button
        variant="solid-blue"
        className="w-fit px-7"
        type="submit"
        disabled={hasErrors || isUpdatingCustomer || customerLoading}
        loading={isUpdatingCustomer}
      >
        Guardar Información
      </Button>
    </form>
  );
};

export default CustomerForm;
