"use client";
import Button from "@/components/ui/button";
import { faBuilding, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Register = () => {
  const [userType, setUserType] = React.useState<"natural" | "empresa" | null>(
    null
  );
  return (
    <main className="border-2relative min-h-[85svh] flex flex-col justify-between mt-4">
      <section className="bg-white p-4 pt-8 w-11/12 rounded-3xl mx-auto pb-28 text-blue-500 flex flex-col items-center gap-4 h-full">
        <header className="text-center w-11/12 flex flex-col items-center gap-4">
          <h1 className="text-2xl">
            Únete a nuestra comunidad aseguradora. ¡Selecciona tu perfil!
          </h1>
          <h2 className="text-sm">
            Para vivir una mejor experiencia y darte la información que
            necesitas
          </h2>
        </header>
        <div className="w-11/12 flex justify-evenly items-center text-base">
          <button
            className="flex flex-col items-center gap-3"
            onClick={() =>
              setUserType(userType === "natural" ? null : "natural")
            }
          >
            <div
              className={`w-24 h-24 border-2 rounded-xl flex items-center justify-center transition-all ${
                userType === "natural"
                  ? "border-blue-500 scale-105"
                  : "border-gray-300"
              }`}
            >
              <FontAwesomeIcon size="3x" icon={faUser} />
            </div>
            <span>Persona natural</span>
          </button>

          <button
            className="flex flex-col items-center gap-3"
            onClick={() =>
              setUserType(userType === "empresa" ? null : "empresa")
            }
          >
            <div
              className={`w-24 h-24 border-2 rounded-xl flex items-center justify-center transition-all ${
                userType === "empresa"
                  ? "border-blue-500 scale-105"
                  : "border-gray-300"
              }`}
            >
              <FontAwesomeIcon size="3x" icon={faBuilding} />
            </div>
            <span>Empresa</span>
          </button>
        </div>
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
          {userType && <Button className="w-full">Siguiente</Button>}

          <div className="py-4 w-full">stepper</div>
        </div>
      </section>
    </main>
  );
};

export default Register;
