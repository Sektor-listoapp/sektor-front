import React from "react";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { ROUTES } from "@/constants/router";

const Header = () => {
  const router = useRouter();

  return (
    <header className="w-11/12 p-4 text-blue-500 flex justify-between items-center gap-4 border-b-2 border-b-blue-200 max-w-screen-xl mt-5 md:justify-start">
      <FontAwesomeIcon
        size="xl"
        icon={faArrowLeft}
        onClick={() => router.back()}
        className="cursor-pointer"
      />
      <SektorFullHorizontalLogo
        className="w-28 md:w-36"
        onClick={() => router.push(ROUTES.HOME)}
      />
      <div />
    </header>
  );
};

export default Header;
