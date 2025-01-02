import Button from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import { ROUTES } from "@/constants/router";
import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import { UPDATE_PASSWORD } from "@/lib/sektor-api/mutations";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const { PASSWORD, GENERAL } = INPUT_ERROR_MESSAGES;
const GENERIC_ERROR_MESSAGE =
  "Ocurrió un error al intentar cambiar tu contraseña, por favor intenta de nuevo más tarde.";

const ResetPasswordForm = () => {
  const { replace } = useRouter();
  const [updatePassword, { loading }] = useMutation(UPDATE_PASSWORD);

  const resetPasswordToken = useAuthStore((state) => state.resetPasswordToken);
  const resetAuthStore = useAuthStore((state) => state.resetAuthStore);

  const [input, setInput] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({
    password: [],
    confirmPassword: [],
  });

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const trimmedValue = value.trim();
    setInput((prev) => ({ ...prev, [name]: trimmedValue }));

    if (name === "password") {
      const hasCapitalLetter = REGEX.CAPITAL_LETTER.test(trimmedValue);
      const hasSpecialCharacter = REGEX.SPECIAL_CHARACTER.test(trimmedValue);
      const hasEightCharacters = REGEX.EIGHT_CHARACTERS.test(trimmedValue);

      setErrors((prev) => ({
        ...prev,
        password: [
          !hasEightCharacters ? PASSWORD.MIN_LENGTH_SHORT : "",
          !hasSpecialCharacter ? PASSWORD.MIN_SPECIAL_CHARACTERS : "",
          !hasCapitalLetter ? PASSWORD.CAPITAL_LETTER : "",
        ].filter(Boolean),
      }));
    }

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          trimmedValue === input.password ? [] : [PASSWORD.MATCH],
      }));
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.password.trim().length || !input.confirmPassword.trim().length) {
      setErrors((prev) => ({
        ...prev,
        password: !input.password.trim().length
          ? [GENERAL.REQUIRED]
          : prev.password,
        confirmPassword: !input.confirmPassword.trim().length
          ? [GENERAL.REQUIRED]
          : prev.confirmPassword,
      }));
      return;
    }

    const hasErrors = Object.values(errors).some((error) => error.length > 0);
    if (hasErrors) {
      return;
    }

    updatePassword({
      variables: {
        input: {
          token: resetPasswordToken,
          newPassword: input?.password,
        },
      },
    })
      .then((response) => {
        const wasPasswordUpdated = response?.data?.updatePassword;

        if (!wasPasswordUpdated) {
          toast.error(GENERIC_ERROR_MESSAGE);
          return;
        }
        toast.success(
          "Tu contraseña ha sido cambiada exitosamente, ahora puedes iniciar sesión con tu nueva contraseña.",
          {
            onClose: () => {
              resetAuthStore();
              replace(ROUTES.LOGIN);
            },
          }
        );
      })
      .catch((error) => {
        toast.error(error?.message || GENERIC_ERROR_MESSAGE);
      });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-full max-w-sm flex flex-col items-center gap-8 lg:mt-4"
    >
      <PasswordInput
        name="password"
        placeholder="Contraseña"
        error={Boolean(errors.password.length)}
        errors={errors.password}
        disabled={loading}
        onChange={handleChange}
        value={input.password}
      />
      <PasswordInput
        name="confirmPassword"
        placeholder="Confirmar contraseña"
        error={Boolean(errors.confirmPassword.length)}
        errors={errors.confirmPassword}
        disabled={loading}
        onChange={handleChange}
        value={input.confirmPassword}
      />
      <Button
        variant="solid-blue"
        className="w-full mt-2 md:w-fit md:px-12 lg:mt-16"
        type="submit"
        disabled={loading}
        loading={loading}
      >
        Siguiente
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
