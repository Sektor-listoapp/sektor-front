import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { ROUTES } from "@/constants/router";
import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import { SEND_PASSWORD_RESET_REQUEST } from "@/lib/sektor-api/mutations";
import { useMutation } from "@apollo/client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const { EMAIL, GENERAL } = INPUT_ERROR_MESSAGES;

const GENERIC_ERROR_MESSAGE =
  "Ocurrió un error al enviar el correo de recuperación de contraseña, por favor intente de nuevo más tarde.";

const SendRecoveryLinkForm = () => {
  const { replace } = useRouter();
  const [sendPasswordResetRequest, { loading }] = useMutation(
    SEND_PASSWORD_RESET_REQUEST
  );

  const [email, setEmail] = useState("");
  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  const handleEmailChange = (e: FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const trimmedValue = value.trim();
    setEmail(trimmedValue);
    setEmailErrors(REGEX.EMAIL.test(trimmedValue) ? [] : [EMAIL.EXAMPLE]);
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email.trim().length === 0) {
      setEmailErrors([GENERAL.REQUIRED]);
      return;
    }

    if (emailErrors.length) {
      return;
    }

    sendPasswordResetRequest({ variables: { email } })
      .then((response) => {
        const wasEmailSent = response?.data?.sendPasswordResetRequest;

        if (!wasEmailSent) {
          toast.error(GENERIC_ERROR_MESSAGE);
          return;
        }
        toast.success(
          "Si tu cuenta se encuentra registrada, recibirás un correo que te permitirá cambiar tu contraseña",
          {
            onClose: () => replace(ROUTES.HOME),
          }
        );
      })
      .catch((error) => {
        toast.error(error?.message || GENERIC_ERROR_MESSAGE);
      });
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm flex flex-col items-center my-4"
    >
      <label
        htmlFor="email"
        className="font-century-gothic w-full text-left mb-2"
      >
        Correo electrónico <br />
        <span className="text-sm -mt-1 block">asegúrate de tener acceso</span>
      </label>
      <TextInput
        name="email"
        wrapperClassName={emailErrors.length ? "mb-4" : "mb-10"}
        icon={faUser}
        error={Boolean(emailErrors.length)}
        errors={emailErrors}
        disabled={loading}
        onChange={handleEmailChange}
        value={email}
      />
      <Button
        variant="solid-blue"
        className="w-full md:w-fit mt-4 md:px-12"
        type="submit"
        disabled={loading}
        loading={loading}
      >
        Enviarme link
      </Button>
    </form>
  );
};

export default SendRecoveryLinkForm;
