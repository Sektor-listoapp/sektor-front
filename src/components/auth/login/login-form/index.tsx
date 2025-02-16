import Button from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import TextInput from "@/components/ui/text-input";
import { ROUTES } from "@/constants/router";
import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import { LOGIN } from "@/lib/sektor-api/mutations";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@apollo/client";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

const { EMAIL, PASSWORD, GENERAL } = INPUT_ERROR_MESSAGES;

const LoginForm = () => {
  const { push, replace, query } = useRouter();
  const [login, { loading }] = useMutation(LOGIN);
  const redirectTo = (query?.redirectTo || "") as string;

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [input, setInput] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({
    email: [],
    password: [],
  });

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    const trimmedValue = value.trim();
    setInput((prev) => ({ ...prev, [name]: trimmedValue }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: REGEX.EMAIL.test(trimmedValue) ? [] : [EMAIL.EXAMPLE],
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: trimmedValue.length >= 8 ? [] : [PASSWORD.MIN_LENGTH],
      }));
    }
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.email.trim().length || !input.password.trim().length) {
      setErrors((prev) => ({
        ...prev,
        email: !input.email.trim().length ? [GENERAL.REQUIRED] : prev.email,
        password: !input.password.trim().length
          ? [GENERAL.REQUIRED]
          : prev.password,
      }));
      return;
    }

    const hasErrors = Object.values(errors).some((error) => error.length > 0);
    if (hasErrors) {
      return;
    }

    login({ variables: { input } })
      .then((response) => {
        const { user, token } = response.data.login;
        setAccessToken(token);
        setUser(user);
        replace(Boolean(redirectTo.length) ? redirectTo : ROUTES.HOME);
      })
      .catch((error) => {
        toast.error(
          error?.message ||
            "Ocurrió un error al iniciar sesión, por favor intenta de nuevo más tarde."
        );
      });
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm flex flex-col items-center lg:mt-4"
    >
      <TextInput
        placeholder="Correo electrónico"
        name="email"
        wrapperClassName={errors.email.length ? "mb-4" : "mb-10"}
        icon={faUser}
        error={Boolean(errors.email.length)}
        errors={errors.email}
        disabled={loading}
        onChange={handleChange}
        value={input.email}
      />
      <PasswordInput
        name="password"
        placeholder="Contraseña"
        error={Boolean(errors.password.length)}
        errors={errors.password}
        disabled={loading}
        onChange={handleChange}
        value={input.password}
      />
      <Button
        variant="link-blue"
        className="ml-auto mt-3 text-sm"
        onClick={() => push(ROUTES.FORGOT_PASSWORD)}
      >
        Olvide mi contraseña
      </Button>
      <Button
        variant="solid-blue"
        className="w-full mt-12 md:w-fit md:px-12 lg:mt-16"
        type="submit"
        disabled={loading}
        loading={loading}
      >
        Iniciar sesión
      </Button>
    </form>
  );
};

export default LoginForm;
