import React, { useEffect, useState } from "react";
import withAuth from "@/components/shared/with-auth";
import Navbar from "@/components/my-account/navbar";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import { UserGroups } from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { ROUTES } from "@/constants/router";
import CompanyList from "@/components/companies";


const { Admin } = UserGroups;

const Companies = () => {
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
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start gap-8  overflow-hidden">
      <Navbar />

      <main className="text-blue-500 w-11/12 max-w-screen-xl flex flex-col items-center justify-center gap-10 py-5 !font-century-gothic pb-32">
        <CompanyList />
      </main>
    
    </div>
  );
};

export default withAuth(Companies);
