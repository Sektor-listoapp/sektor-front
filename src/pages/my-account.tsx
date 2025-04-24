import React from "react";
import withAuth from "@/components/shared/with-auth";
import Header from "@/components/my-account/header";
import Navbar from "@/components/my-account/navbar";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import { ORGANIZATION_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { useQuery } from "@apollo/client";
import { Empty } from "antd";
import {
  OrganizationType,
  OrganizationTypes,
  Query,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import { getUserForm } from "@/utils/form/get-user-form";

const { Admin, Customer } = UserGroups;

const MyAccount = () => {
  const userId = useAuthStore(useShallow((state) => state.user?.id));
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = userGroup === Admin;
  const isCustomer = userGroup === Customer;

  const {
    data: organizationDataResponse,
    error,
    loading,
  } = useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
    variables: { id: userId },
    skip: isCustomer,
  });

  const organizationData = organizationDataResponse?.organizationById;
  console.log(organizationData?.type)
  const FormComponent = getUserForm(organizationData);

  const showMessage =
    organizationData?.type !== OrganizationTypes.Admin
      ? "Tú perfil es la ventana a nuevos prospectos asegurados. Por favor, completa los campos"
      : (
        <>
          Tú perfil es la ventana a nuevos prospectos asegurados, completa cada campo necesario y <b>Sektor</b> potenciará tu marca
        </>
      );

      
  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start gap-8  overflow-hidden">
      <Navbar />

      <Header data={organizationData as OrganizationType} />

      {error && !loading ? (
        <section className="w-full flex flex-col items-center justify-center gap-4 font-century-gothic py-20">
          <Empty
            description="No se pudo cargar la información de la cuenta, por favor intenta de nuevo más tarde."
            style={{
              maxWidth: "450px",
              color: "#aaa",
              fontWeight: "500",
              fontFamily: "Century Gothic",
              textWrap: "balance",
            }}
          />
        </section>
      ) : (
        <main className="text-blue-500 w-11/12 max-w-screen-xl flex flex-col items-center justify-center gap-4 pb-20 md:pb-40">
          {!isAdmin && !isCustomer && (
            <header className="w-full flex flex-col items-center justify-center gap-2">
              <h2 className="text-lg md:text-xl lg:text-3xl">
                Llena el siguiente formulario
              </h2>
              <p className="font-century-gothic text-base text-center max-w-xl text-balance">
                {showMessage}
              </p>
            </header>
          )}
          {FormComponent && <FormComponent data={organizationData} />}
        </main>
      )}
    </div>
  );
};

export default withAuth(MyAccount);
