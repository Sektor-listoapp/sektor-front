import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import React from "react";
import { useRegistrationStore } from "@/store/registration";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { useRouter } from "next/router";
import { ROUTES } from "@/constants/router";
import { useShallow } from "zustand/shallow";
import { REGISTER_STEPS } from "@/constants/register";

const Header = () => {
  const { push, pathname } = useRouter();
  const isRegisterPage = pathname === ROUTES.REGISTER;

  const goToHome = () => {
    resetRegistrationStore();
    push(ROUTES.HOME);
  };
  const currentStep = useRegistrationStore(
    useShallow((state) => state.currentStep)
  );
  const userType = useRegistrationStore((state) => state.userType);
  const setUserType = useRegistrationStore((state) => state.setUserType);
  const setCurrentRegistrationStep = useRegistrationStore(
    (state) => state.setCurrentRegistrationStep
  );
  const resetRegistrationStore = useRegistrationStore(
    (state) => state.resetRegistrationStore
  );

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
    <header className="text-blue-500 mx-auto flex justify-between items-center p-4 w-11/12 lg:hidden">
      <button
        onClick={() => (isRegisterPage ? handlePrevStep() : goToHome())}
        className="w-8"
      >
        <FontAwesomeIcon size="xl" icon={faChevronLeft} />
      </button>
      <SektorFullHorizontalLogo width={130} onClick={goToHome} />
      <div />
    </header>
  );
};
export default Header;
