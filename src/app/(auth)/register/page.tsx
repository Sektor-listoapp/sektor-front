"use client";
import Stepper from "@/components/auth/register/stepper";
import UserTypes from "@/components/auth/register/user-types";
import Button from "@/components/ui/button";
import { useRegistrationStore } from "@/store/registration";
import clsx from "clsx";
import React from "react";

const Register = () => {
  const userType = useRegistrationStore((state) => state.userType);
  // const setUserType = useRegistrationStore((state) => state.setUserType);

  return (
    <main className="border-2 border-cyan-300 w-full">
      <section className="bg-white p-4 pt-8 w-11/12 rounded-3xl mx-auto pb-28 text-blue-500 flex flex-col items-center gap-4 h-full">
        <UserTypes />
      </section>

      <section className="text-white -mt-28">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="text-blue-500"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,256L120,229.3C240,203,480,149,720,149.3C960,149,1200,203,1320,229.3L1440,256L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
          ></path>
        </svg>
        <div className="bg-blue-500 px-4 pt-6 pb-12 flex flex-col items-center justify-start gap-8 -mt-1">
          <Button
            className={clsx("w-full", {
              invisible: !userType,
            })}
            disabled={!userType}
            data-hs-stepper-next-btn="test-id"
          >
            Siguiente
          </Button>

          <Stepper className="py-4 w-full" />
        </div>
      </section>
    </main>
  );
};

export default Register;
