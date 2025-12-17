import React, { useEffect, useState } from "react";
import withAuth from "@/components/shared/with-auth";
import HerramientasHeader from "@/components/herramientas/header";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import { UserGroups } from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { ROUTES } from "@/constants/router";
import HerramientasList from "@/components/herramientas";

const { Admin } = UserGroups;

const Herramientas = () => {
  const { push } = useRouter();
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = userGroup === Admin;

  const [checkingAccess, setCheckingAccess] = useState(true);

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
    <div className="min-h-svh bg-white w-full flex flex-col">
      <HerramientasHeader />

      <main className="flex-1 text-blue-500 w-11/12 max-w-screen-xl mx-auto py-8 !font-century-gothic pb-32">
        <HerramientasList />
      </main>
    </div>
  );
};

export default withAuth(Herramientas);


