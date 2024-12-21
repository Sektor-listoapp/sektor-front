"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import SektorLogo from "@assets/images/sektor-blue-logo.webp";
import { useRouter } from "next/navigation";

import React from "react";

const Header = () => {
  const { push } = useRouter();
  const goToHome = () => push("/");
  return (
    <header className="text-blue-500 mx-auto flex justify-between items-center p-4 w-11/12 border-2 border-green-500">
      <button onClick={goToHome} className="w-8">
        <FontAwesomeIcon size="xl" icon={faChevronLeft} />
      </button>
      <Image
        src={SektorLogo}
        alt="Sektor Logo"
        priority
        width={130}
        onClick={goToHome}
      />
      <div />
    </header>
  );
};
export default Header;
