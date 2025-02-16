import React from "react";
import Header from "@/components/quotes/header";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/router";
import { QUOTE_FORM_MAP } from "@/components/quotes/constants";
import withAuth from "@/components/shared/with-auth";

const QuotesPage = () => {
  const router = useRouter();
  const segmentQuery = (router?.query?.segment || "") as string;
  const QuoteForm = QUOTE_FORM_MAP?.[segmentQuery] || QUOTE_FORM_MAP.default;

  const userName = useAuthStore(useShallow((state) => state.user?.name)) || "";

  return (
    <div className="w-full flex flex-col gap-10 items-center justify-start text-blue-500 pb-20">
      <Header />
      <main className="w-11/12 max-w-screen-xl">
        <section className="w-full flex flex-col items-center justify-start gap-4 p-4 md:gap-10">
          <header className="w-full flex flex-col items-center justify-start gap-4">
            <h1 className="text-2xl">Cotiza con nosotros</h1>
            <p className="font-century-gothic text-center text-balance">
              <b>Hola {userName}, </b> para continuar con tu cotización por
              favor completa el formulario
            </p>
          </header>

          <QuoteForm />
        </section>
      </main>
    </div>
  );
};

export default withAuth(QuotesPage);
