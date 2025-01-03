import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const EmailVerificationSuccess = () => {
  return (
    <section className="flex flex-col items-center gap-4 py-20 text-center text-balance lg:gap-8 lg:pb-10">
      <FontAwesomeIcon size="5x" icon={faCircleCheck} />
      <h1 className="text-2xl md:text-5xl">
        ¡Te doy la bienvenida a nuestra plataforma!
      </h1>
      <p className="font-century-gothic md:text-xl">
        <b>Descubre </b>todo lo que nuestra comunidad aseguradora tiene para ti
      </p>
    </section>
  );
};

export default EmailVerificationSuccess;
