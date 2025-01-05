import React from "react";
import AuthLayout from "@/components/auth/common/layout";
import Stepper from "@/components/auth/register/stepper";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import Button from "@/components/ui/button";
import { USER_TYPES } from "@/constants/auth";
import { REGISTER_COMPONENTS_MAP, REGISTER_STEPS } from "@/constants/register";
import { useRegistrationStore } from "@/store/registration";
import { cn } from "@/utils/class-name";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/router";
import { ROUTES } from "@/constants/router";

const Register = () => {
  const { replace } = useRouter();
  const [isSubmittingForm, setIsSubmittingForm] = React.useState(false);
  const userType = useRegistrationStore((state) => state.userType);
  const setUserType = useRegistrationStore((state) => state.setUserType);
  const currentStep = useRegistrationStore(
    useShallow((state) => state.currentStep)
  );
  const setCurrentRegistrationStep = useRegistrationStore(
    (state) => state.setCurrentRegistrationStep
  );
  const resetRegistrationStore = useRegistrationStore(
    (state) => state.resetRegistrationStore
  );

  const isFormStep = currentStep.isForm;
  const formRef = React.useRef<HTMLFormElement>(null);
  const RegisterStep = REGISTER_COMPONENTS_MAP[currentStep.component];
  const isIntermediary = userType === USER_TYPES.INTERMEDIARY;
  const isFinalStep = Boolean(currentStep?.isFinalStep);
  const isCompanySegmentsStep =
    currentStep.component === REGISTER_STEPS.CompanySegments.component;
  const isSentVerificationEmailStep =
    currentStep.component === REGISTER_STEPS.SentEmailVerification.component;
  const disableNextStepButton =
    !userType ||
    (isIntermediary && isCompanySegmentsStep) ||
    isSentVerificationEmailStep;

  const goToHome = () => {
    replace(ROUTES.HOME);
    resetRegistrationStore();
  };

  const handleNextStep = () => {
    if (isFinalStep) {
      goToHome();
      return;
    }

    if (!userType) return;
    const nextStepForUser = currentStep?.nextStep?.[userType];
    const nextRegistrationStep = REGISTER_STEPS?.[nextStepForUser];

    if (isFormStep) {
      formRef?.current?.requestSubmit();
      return;
    }

    setCurrentRegistrationStep(nextRegistrationStep);
  };

  const handlePrevStep = () => {
    const prevStep =
      currentStep?.prevStep?.[userType || "default"] ||
      currentStep?.prevStep?.default;

    if (!prevStep) {
      goToHome();
      return;
    }

    setCurrentRegistrationStep(REGISTER_STEPS[prevStep]);
    setUserType(null);
  };

  return (
    <AuthLayout>
      <main className="w-full lg:grid lg:grid-cols-12 lg:items-start lg:justify-center lg:relative lg:gap-4">
        <section className="bg-white p-4 pt-8 w-11/12  max-w-lg rounded-3xl mx-auto pb-40 text-blue-500 flex flex-col items-center gap-4 h-full lg:col-span-6 xl:col-span-5 lg:w-full lg:order-1 lg:h-fit lg:mt-20 lg:pb-10 lg:z-10 xl:max-w-[700px] xl:px-8 lg:mb-10 transition-all lg:min-h-[600px] lg:justify-between ">
          <RegisterStep
            formRef={formRef}
            setIsSubmittingForm={setIsSubmittingForm}
          />
          <Button
            variant="solid-blue"
            disabled={disableNextStepButton || isSubmittingForm}
            loading={isSubmittingForm}
            className={cn("hidden lg:block lg:px-12 mt-auto", {
              invisible: disableNextStepButton,
            })}
            onClick={handleNextStep}
          >
            {isFinalStep ? "Descubre más" : "Siguiente"}
          </Button>
          <Button
            variant="link-blue"
            className="hidden lg:flex gap-2 justify-center items-center text-blue-500 font-bold text-sm hover:underline mr-auto ml-2 mt-10 no-underline"
            onClick={handlePrevStep}
          >
            <FontAwesomeIcon className="mr-2" size="lg" icon={faArrowLeft} />
            <span>Volver atrás</span>
          </Button>
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
          <div className="bg-blue-500 px-4 pt-6 pb-12 flex flex-col items-center justify-start gap-8 -mt-1 lg:bg-transparent lg:pt-12">
            <div className="w-full max-w-md lg:max-w-full lg:w-3/4">
              <SektorFullHorizontalLogo
                className="hidden lg:block w-44 text-white lg:mb-16 hover:cursor-pointer hover:scale-105 transition-transform active:scale-100"
                onClick={goToHome}
              />
              <Button
                disabled={disableNextStepButton || isSubmittingForm}
                loading={isSubmittingForm}
                onClick={handleNextStep}
                className={cn("w-full lg:hidden", {
                  invisible: disableNextStepButton,
                })}
              >
                {isFinalStep ? "Descubre más" : "Siguiente"}
              </Button>
              <Stepper className="py-4 w-full" currentStep={currentStep} />
            </div>
          </div>
        </section>
      </main>
    </AuthLayout>
  );
};

export default Register;
