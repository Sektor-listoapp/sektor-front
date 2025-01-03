import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import { SEND_VERIFICATION_EMAIL } from "@/lib/sektor-api/mutations";
import { useRegistrationStore } from "@/store/registration";
import { useMutation } from "@apollo/client";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";
import { GENERIC_ERROR_MESSAGE, GENERIC_SUCCESS_MESSAGE } from "./constants";

const SentEmailVerification = () => {
  const { replace } = useRouter();
  const [sendVerificationEmail, { loading }] = useMutation(
    SEND_VERIFICATION_EMAIL
  );
  const resetRegistrationStore = useRegistrationStore(
    (state) => state.resetRegistrationStore
  );
  const email =
    useRegistrationStore(useShallow((state) => state.newUser.email)) || "";

  const handleSendVerificationEmail = () => {
    sendVerificationEmail({ variables: { email } })
      .then((response) => {
        const wasEmailSent = response?.data?.sendVerificationEmail;

        if (!wasEmailSent) {
          toast.error(GENERIC_ERROR_MESSAGE);
          return;
        }
        toast.success(GENERIC_SUCCESS_MESSAGE, {
          onClose: () => {
            resetRegistrationStore();
            replace(ROUTES.HOME);
          },
        });
      })
      .catch((error) => {
        toast.error(error?.message || GENERIC_ERROR_MESSAGE);
      });
  };

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
        <Button
          variant="link-blue"
          className="font-bold md:text-xl"
          disabled={loading}
          loading={loading}
          onClick={handleSendVerificationEmail}
        >
          Volver a enviarme el link a mi correo
        </Button>
      </footer>
    </section>
  );
};

export default SentEmailVerification;
