import React, { useEffect, useState } from "react";
import TextInput from "@/components/ui/text-input";
import { Mutation, Query } from "@/lib/sektor-api/__generated__/types";
import { useMutation, useQuery } from "@apollo/client";
import Select from "@/components/ui/select";
import { useShallow } from "zustand/shallow";
import { useAuthStore } from "@/store/auth";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import { ADMIN_UPDATE_USER_EMAIL, UPDATE_CUSTOMER, UPDATE_EMAIL } from "@/lib/sektor-api/mutations";
import { GENERIC_TOAST_ERROR_MESSAGE } from "@/constants/validations";
import { SELECT_GENRE_OPTIONS } from "@/constants/forms";
import SektorFullVerticalLogo from "@/components/icons/sektor-full-vertical-logo";
import { CUSTOMER_BY_ID_QUERY } from "@/lib/sektor-api/queries/auth/customer-by-id";
import { faPerson, faPersonHalfDress, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FormProps } from "@/types/forms";


type CustomerIdProps = FormProps;

interface CustomerInputType {
  name: string;
  email: string;
  sex: string;
  password: string;
}

const CustomerForm = ({ userId }: CustomerIdProps) => {
  const loggedUserId = useAuthStore(useShallow((state) => state.user?.id));
  const targetUserId = userId || loggedUserId;
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);

  const [showPassword, setShowPassword] = useState(false);


  const {
    data: customerDataResponse,
    error: customerError,
    loading: customerLoading,
    refetch: refetchCustomer,
  } = useQuery<Query>(CUSTOMER_BY_ID_QUERY, { variables: { id: targetUserId } });

  const customerData = customerDataResponse?.customerById;

  const [updateCustomer] = useMutation<Mutation>(UPDATE_CUSTOMER);
  const [updateEmailMutation] = useMutation<Mutation>(UPDATE_EMAIL);
  const [adminUpdateUserEmailMutation] = useMutation<Mutation>(ADMIN_UPDATE_USER_EMAIL);

  const [input, setInput] = useState<CustomerInputType>({
    name: "",
    email: "",
    sex: "",
    password: "",
  });

  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    const { name, sex, email } = customerData || {};
    setInput({
      sex: sex || "",
      name: name || "",
      email: email || "",
      password: "",
    });
    setOriginalEmail(email || "");
  }, [customerData]);

  const requiredFields = {
    name: Boolean(input?.name?.trim()?.length),
    email: Boolean(input?.email?.trim()?.length),
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();



    setIsUpdatingCustomer(true);


    const emailChanged = input.email !== originalEmail;
    const isSelfUpdate = !userId || userId === loggedUserId;

    if (emailChanged) {
      if (isSelfUpdate) {
        //requerir contraseña para actualizar el correo
        if (!input.password.trim()) {
          toast.error("Debes introducir tu contraseña para actualizar el correo");
          setIsUpdatingCustomer(false);
          return;
        }
      }

      try {
        if (isSelfUpdate) {
          const { data } = await updateEmailMutation({
            variables: {
              input: {
                newEmail: input.email,
                password: input.password,
              },
            },
          });
          if (!data?.updateEmail?.success) {
            throw new Error(data?.updateEmail?.message || "No se pudo actualizar el correo");
          }
        } else {
          const { data } = await adminUpdateUserEmailMutation({
            variables: {
              input: {
                userId: targetUserId,
                newEmail: input.email,
                skipVerification: true,
              },
            },
          });
          if (!data?.adminUpdateUserEmail?.success) {
            throw new Error(data?.adminUpdateUserEmail?.message || "No se pudo actualizar el correo (admin)");
          }
        }
      } catch (err: unknown) {
        console.error("Email update error:", err);
        const errorMessage = (err as { message?: string })?.message || "No se pudo actualizar el correo";
        toast.error(errorMessage);
        setIsUpdatingCustomer(false);
        return;
      }
    }

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

  const showLoading = customerLoading && !isUpdatingCustomer;

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
        <TextInput
          name="email"
          className="col-span-1"
          placeholder="Correo electrónico"
          showFloatingLabel
          icon={faEnvelope}
          error={!requiredFields.email}
          disabled={customerLoading || isUpdatingCustomer}
          onChange={(e) => handleInputChange("email", e.target.value)}
          value={input?.email}
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

        {(() => {
          const emailChanged = input.email !== originalEmail;
          const isSelfUpdate = !userId || userId === loggedUserId;

          return isSelfUpdate && emailChanged ? (
            <div className="col-span-1">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="off"
                  spellCheck="false"
                  className="py-3 px-5 pr-12 block w-full bg-white border border-blue-500 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 font-century-gothic"
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
          ) : null;
        })()}
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
