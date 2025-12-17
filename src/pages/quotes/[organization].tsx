import React from "react";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/router";
import { QUOTE_FORM_MAP } from "@/components/quotes/constants";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import Button from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ROUTES } from "@/constants/router";
import Header from "@/components/auth/common/header";
import Stepper from "@/components/quotes/stepper";

const QuotesPage = () => {
  const router = useRouter();
  const segmentQuery = (router?.query?.segment || "") as string;
  const QuoteForm = QUOTE_FORM_MAP?.[segmentQuery] || QUOTE_FORM_MAP.default;
  const user = useAuthStore(useShallow((state) => state.user));
  const userName = user?.name || "!";

  const goToHome = () => router.replace(ROUTES.HOME);
  const goBack = () => router.back();

  return (
    <div className="min-h-svh secondary-gradient w-full flex flex-col justify-between items-start gap-8 lg:block lg:relative lg:overflow-hidden">
      <Header />
      <div className="hidden lg:block absolute bg-blue-500 right-[50%] inset-y-0 -top-[20%] w-[125vw] h-[125vw] rounded-full xl:right-2/4 xl:-top-[25%] 2xl:w-[100vw] 2xl:h-[100vw] 2xl:-top-[50%] " />

      <main className="w-full lg:grid lg:grid-cols-12 lg:items-start lg:justify-center lg:relative lg:gap-4">
        <section className="bg-white p-4 pt-8 w-11/12  max-w-2xl rounded-3xl mx-auto pb-32 text-blue-500 flex flex-col items-center gap-4 h-full lg:col-span-6 xl:col-span-5 lg:w-full lg:order-1 lg:h-fit lg:mt-20 lg:pb-10 lg:z-10 xl:max-w-[700px] xl:px-8 lg:mb-10 transition-all lg:min-h-[600px] lg:justify-between ">
          <header className="w-full flex flex-col items-center justify-center gap-4">
            <Button
              variant="link-blue"
              onClick={goBack}
              className="no-underline font-bold mr-auto hidden lg:block"
            >
              <FontAwesomeIcon className="mr-2" size="lg" icon={faArrowLeft} />
              <span>Volver</span>
            </Button>
            <h2 className="w-full text-2xl text-center text-balance">
              ¡Solicita tú cotización con un aliado Sektor a través de nosotros!
            </h2>
            <p className="text-balance font-century-gothic text-center">
              Hola {userName}, te ayudamos para que tengas tu cotización, solo
              debes llenar este formulario
            </p>
          </header>

          <QuoteForm />
        </section>

        <div className="hidden xl:block xl:col-span-1" />

        <section className="text-white -mt-36 lg:col-span-6 xl:col-span-5 lg:w-full lg:min-h-svh lg:relative lg:mt-0 lg:pb-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="text-blue-500 lg:hidden"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,256L120,229.3C240,203,480,149,720,149.3C960,149,1200,203,1320,229.3L1440,256L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
            ></path>
          </svg>
          <div className="bg-blue-500 px-4 pb-12 flex flex-col items-center justify-start gap-8 -mt-1 lg:bg-transparent lg:pt-12">
            <div className="w-full max-w-md lg:max-w-full lg:w-3/4">
              <SektorFullHorizontalLogo
                className="hidden lg:block w-44 text-white lg:mb-16 hover:cursor-pointer hover:scale-105 transition-transform active:scale-100"
                onClick={goToHome}
              />
              <Stepper className="w-full" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default QuotesPage;
