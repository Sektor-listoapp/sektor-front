import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const DataSentToConfirm = () => {
  return (
    <section className="flex flex-col items-center gap-4 py-20 text-center text-balance lg:gap-8 lg:pb-10">
      <FontAwesomeIcon size="5x" icon={faCircleCheck} />
      <h1 className="text-2xl md:text-5xl">¡Tus datos han sido enviados!</h1>
      <p className="font-century-gothic md:text-xl">
        Nuestro equipo revisará tu información y te contactará en la brevedad
        posible.
      </p>
    </section>
  );
};

export default DataSentToConfirm;
