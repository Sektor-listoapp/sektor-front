import React from "react";
import withAuth from "@/components/shared/with-auth";
import Header from "@/components/my-account/header";
import Navbar from "@/components/my-account/navbar";
import Spinner from "@/components/ui/spinner";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import { ORGANIZATION_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { useQuery } from "@apollo/client";
import { USER_FORM } from "@/components/my-account/constants";
import {
  OrganizationType,
  Query,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";

const { Admin, Customer } = UserGroups;

const MyAccount = () => {
  const userId = useAuthStore(useShallow((state) => state.user?.id));
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = userGroup === Admin;
  const isCustomer = userGroup === Customer;

  const { data: organizationDataResponse, loading: isLoadingOrganizationData } =
    useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
      variables: { id: userId },
      skip: userGroup === Customer,
    });

  const organizationData = organizationDataResponse?.organizationById;
  const UserForm = USER_FORM[organizationData?.type || ""];

  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start gap-8  overflow-hidden">
      <Navbar />

      <Header data={organizationData as OrganizationType} />

      {isLoadingOrganizationData ? (
        <div className="w-full flex items-center justify-center text-blue-500 py-20">
          <Spinner className="size-10 animate-spin" />
        </div>
      ) : (
        <main className="text-blue-500 w-11/12 max-w-screen-xl flex flex-col items-center justify-center gap-4 pb-20 md:pb-40">
          {!isAdmin && !isCustomer && (
            <header className="w-full flex flex-col items-center justify-center gap-2">
              <h2 className="text-lg md:text-xl lg:text-3xl">
                Llena el siguiente formulario
              </h2>
              <p className="font-century-gothic text-base text-center max-w-xl text-balance">
                Tú perfil es la ventana a nuevos prospectos asegurados, completa
                cada campo necesario y <b>Sektor</b> potenciará tu marca
              </p>
            </header>
          )}

          {Boolean(UserForm) && <UserForm />}
        </main>
      )}
    </div>
  );
};

export default withAuth(MyAccount);
