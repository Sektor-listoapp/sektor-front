"use client";

import LoginForm from "@/components/auth/login/login-form";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { useRegistrationStore } from "@/store/registration";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const Login = () => {
  const resetRegistrationStore = useRegistrationStore(
    (state) => state.resetRegistrationStore
  );

  return (
    <main className="w-full lg:grid lg:grid-cols-12 lg:items-start lg:justify-center lg:relative lg:gap-4">
      <section className="bg-white p-4 pt-8 w-11/12  max-w-lg rounded-3xl mx-auto pb-40 text-blue-500 flex flex-col items-center gap-4 h-full lg:col-span-6 xl:col-span-5 lg:w-full lg:order-1 lg:h-fit lg:mt-20 lg:pb-10 lg:z-10 xl:max-w-[700px] xl:px-8 lg:mb-10">
        <LoginForm />

        <Link
          href="/"
          className="hidden lg:flex gap-2 justify-center items-center text-blue-500 font-bold text-sm hover:underline mr-auto ml-2 mt-10"
          onClick={resetRegistrationStore}
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
        <div className="bg-blue-500 px-4 pt-6 pb-12 flex flex-col items-center justify-start gap-8 -mt-1 lg:bg-transparent lg:pt-12">
          <div className="w-full max-w-md lg:max-w-full lg:w-3/4">
            <SektorFullHorizontalLogo className="hidden lg:block w-44 text-white lg:mb-16" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
