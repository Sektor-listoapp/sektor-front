import AuthLayout from "@/components/auth/common/layout";
import SendRecoveryLinkForm from "@/components/auth/forgot-password/send-recovery-link-form";
import Stepper from "@/components/auth/forgot-password/stepper";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { ROUTES } from "@/constants/router";
import { useRegistrationStore } from "@/store/registration";
import { faArrowLeft, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const { push } = useRouter();
  const resetRegistrationStore = useRegistrationStore(
    (state) => state.resetRegistrationStore
  );

  const handleGoBack = () => {
    push(ROUTES.HOME);
    resetRegistrationStore();
  };

  return (
    <AuthLayout>
      <main className="w-full lg:grid lg:grid-cols-12 lg:items-start lg:justify-center lg:relative lg:gap-4">
        <section className="bg-white p-4 pt-8 w-11/12 relative z-10 pb-24 max-w-lg rounded-3xl mx-auto text-blue-500 flex flex-col items-center gap-10 h-full lg:col-span-6 xl:col-span-5 lg:w-full lg:order-1 lg:h-fit lg:mt-20 lg:pb-10 lg:pt-16 xl:max-w-[700px] xl:px-8 lg:mb-10">
          <header className="w-full flex flex-col items-center gap-2 text-center text-balance lg:text-pretty lg:gap-4">
            <FontAwesomeIcon size="5x" icon={faLock} className="lg:mb-4" />
            <h1 className="font-bold text-xl md:text-4xl">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="font-century-gothic md:text-xl">
              No te preocupes, enviare a tu correo electrónico asociado a tu
              cuenta un link al cual debes darle click para{" "}
              <b>crear tu nueva contraseña</b>.
            </p>
          </header>

          <SendRecoveryLinkForm />

          <Link
            href="/"
            className="hidden lg:flex gap-2 justify-center items-center text-blue-500 font-bold text-sm hover:underline mr-auto ml-2 mt-4"
            onClick={handleGoBack}
          >
            <FontAwesomeIcon size="lg" icon={faArrowLeft} />
            Volver al inicio
          </Link>
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
          <div className="bg-blue-500 px-4 pt-36 pb-12 flex flex-col items-center justify-start gap-8 -mt-1 lg:bg-transparent lg:pt-12">
            <div className="w-full max-w-md lg:max-w-full lg:w-3/4">
              <SektorFullHorizontalLogo className="hidden lg:block w-44 text-white lg:mb-20" />
              <Stepper className="py-4 w-full" />
            </div>
          </div>
        </section>
      </main>
    </AuthLayout>
  );
};

export default ForgotPassword;
