"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import React from "react";
import { useRegistrationStore } from "@/store/registration";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";

const Header = () => {
  const { push } = useRouter();
  const goToHome = () => {
    resetRegistrationStore();
    push("/");
  };

  const resetRegistrationStore = useRegistrationStore(
    (state) => state.resetRegistrationStore
  );

  return (
    <header className="text-blue-500 mx-auto flex justify-between items-center p-4 w-11/12 lg:hidden">
      <button onClick={goToHome} className="w-8">
        <FontAwesomeIcon size="xl" icon={faChevronLeft} />
      </button>
      <SektorFullHorizontalLogo width={130} />
      <div />
    </header>
  );
};
export default Header;
