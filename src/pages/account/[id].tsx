
import Header from "@/components/my-account/header";
import Navbar from "@/components/my-account/navbar";

import { ROUTES } from "@/constants/router";
import {
  CustomerType,
  OrganizationType,
  Query,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import {
  CUSTOMER_BY_ID_QUERY,
  ORGANIZATION_BY_ID_QUERY,
} from "@/lib/sektor-api/queries";
import { useAuthStore } from "@/store/auth";
import { getUserForm } from "@/utils/form/get-user-form";
import { useQuery } from "@apollo/client";
import { Empty } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

const { Admin } = UserGroups;

export default function AccountPage() {
  const { push, query } = useRouter();
  const { id } = query;
  const userId = Array.isArray(id) ? id[0] : id;
  const [checkingAccess, setCheckingAccess] = useState(true);

  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = userGroup === Admin;

  const {
    data: organizationDataResponse,
    loading: organizationLoading,
  } = useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
    variables: { id: userId },
    skip: !userId,
    errorPolicy: "all",
  });

  const organizationData = organizationDataResponse?.organizationById;
  const shouldLoadCustomer =
    Boolean(userId) && !organizationLoading && !organizationData;

  const {
    data: customerDataResponse,
    loading: customerLoading,
    error: customerError,
  } = useQuery<Query>(CUSTOMER_BY_ID_QUERY, {
    variables: { id: userId },
    skip: !shouldLoadCustomer,
  });

  const customerData = customerDataResponse?.customerById;
  const isCustomer = Boolean(customerData && !organizationData);
  const accountEntity = (organizationData ?? customerData) as
    | OrganizationType
    | CustomerType
    | undefined;
  const loading = organizationLoading || (shouldLoadCustomer && customerLoading);
  const hasError = !loading && !accountEntity && Boolean(customerError);

  const FormComponent = getUserForm(accountEntity);

  useEffect(() => {
    if (!userGroup) return;
    if (!isAdmin) {
      push(ROUTES.HOME);
    } else {
      setCheckingAccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGroup]);

  if (checkingAccess) {
    return null;
  }

  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start gap-8  overflow-hidden">
      <Navbar />

      <Header
        data={accountEntity}
        accountEdit
        isCustomer={isCustomer}
      />
      {hasError ? (
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
          {!isAdmin && (
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
          {FormComponent &&
            (isCustomer ? (
              <FormComponent userId={userId} />
            ) : (
              <FormComponent data={accountEntity} userId={userId} />
            ))}
        </main>
      )}
    </div>
  );
}
