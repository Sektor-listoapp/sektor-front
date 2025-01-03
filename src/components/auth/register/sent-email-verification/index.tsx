import Button from "@/components/ui/button";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const SentEmailVerification = () => {
  return (
    <section className="flex flex-col items-center gap-12">
      <header className="flex flex-col items-center gap-2 pt-10 text-center md:gap-4">
        <FontAwesomeIcon size="5x" icon={faEnvelope} className="mb-4" />
        <h1 className="text-2xl md:text-5xl">Verifica tu cuenta ahora</h1>
        <p className="font-century-gothic text-center text-balance md:text-xl">
          <b>¡Haz clic en el enlace que te envié para finalizar el proceso! </b>
          Esto me ayuda a verificar que tú correo sea el correcto y poder
          verificarte como usuario dentro de nuestra plataforma
        </p>
      </header>

      <footer className="flex flex-col items-center">
        <h2 className="font-century-gothic md:text-lg">¿No llego el correo?</h2>
        <Button variant="link-blue" className="font-bold md:text-xl">
          Volver a enviarme el link a mi correo
        </Button>
      </footer>
    </section>
  );
};

export default SentEmailVerification;
