import React, { useEffect } from "react";
import withAuth from "@/components/shared/with-auth";
import Navbar from "@/components/my-account/navbar";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import { UserGroups } from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { ROUTES } from "@/constants/router";
import QuoteList from "@/components/my-quotes";
import QuoteDetailsModal from "@/components/shared/quote-details-modal";

const { Customer } = UserGroups;

const MyQuotes = () => {
  const { push, isReady, query } = useRouter();
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isCustomer = userGroup === Customer;

  useEffect(() => {
    if (isCustomer) {
      push(ROUTES.HOME);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCustomer]);

  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start gap-8  overflow-hidden">
      <Navbar />

      <main className="text-blue-500 w-11/12 max-w-screen-xl flex flex-col items-center justify-center gap-10 py-5 !font-century-gothic pb-32">
        <QuoteList />
      </main>
      {isReady && query?.quote && <QuoteDetailsModal />}
    </div>
  );
};

export default withAuth(MyQuotes);
