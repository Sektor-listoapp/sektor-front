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
import { faPerson, faPersonHalfDress } from "@fortawesome/free-solid-svg-icons";
import { FormProps } from "@/types/forms";


type CustomerIdProps = FormProps;
const CustomerForm = ({ userId }: CustomerIdProps) => {
  const loggedUserId = useAuthStore(useShallow((state) => state.user?.id));
  const targetUserId = userId || loggedUserId;
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasSocialLinks, setHasSocialLinks] = useState(false);


  const {
    data: customerDataResponse,
    error: customerError,
    loading: customerLoading,
    refetch: refetchCustomer,
  } = useQuery<Query>(CUSTOMER_BY_ID_QUERY, { variables: { id: targetUserId } });

  const customerData = customerDataResponse?.customerById;

  const [updateCustomer] = useMutation<Mutation>(UPDATE_CUSTOMER);

  const [input, setInput] = useState({
    name: "",
    sex: "",
  });

  useEffect(() => {
    const { name, sex } = customerData || {};
    setInput({
      sex: sex || "",
      name: name || "",
    });
  }, [customerData]);

  const requiredFields = {
    name: Boolean(input?.name?.trim()?.length),
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

    console.log('=== CUSTOMER FORM SUBMISSION DEBUG ===');
    console.log('Form input data:', input);
    console.log('Target user ID:', targetUserId);
    console.log('Required fields validation:', requiredFields);
    console.log('Has errors:', hasErrors);

    setIsUpdatingCustomer(true);

    const mutationVariables = {
      input: {
        id: targetUserId,
        sex: input?.sex,
        name: input?.name,
      },
    };

    console.log('Mutation variables:', mutationVariables);

    updateCustomer({
      variables: mutationVariables,
    })
      .then((response) => {
        console.log('Customer update success response:', response);
        toast.success("Información actualizada correctamente");
        refetchCustomer();
      })
      .catch((error) => {
        console.error('=== CUSTOMER FORM ERROR DEBUG ===');
        console.error('Error object:', error);
        console.error('Error message:', error?.message);
        console.error('Error graphQLErrors:', error?.graphQLErrors);
        console.error('Error networkError:', error?.networkError);
        console.error('Error extensions:', error?.extensions);
        console.error('Full error details:', JSON.stringify(error, null, 2));
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
          showFloatingLabel
          icon={faPerson}
          error={!requiredFields.name}
          disabled={customerLoading || isUpdatingCustomer}
          onChange={(e) => handleInputChange("name", e.target.value)}
          value={input?.name}
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
