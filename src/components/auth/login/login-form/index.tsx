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

const { EMAIL, PASSWORD } = INPUT_ERROR_MESSAGES;

const LoginForm = () => {
  const { push } = useRouter();
  const [login, { loading }] = useMutation(LOGIN);

  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const [input, setInput] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({
    email: [],
    password: [],
  });

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInput((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: REGEX.EMAIL.test(value) ? [] : [EMAIL.EXAMPLE],
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: value.trim().length >= 8 ? [] : [PASSWORD.MIN_LENGTH],
      }));
    }
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login({ variables: { input } })
      .then((response) => {
        const { user, token } = response.data.login;
        setAccessToken(token);
        setUser(user);
        push(ROUTES.HOME);
      })
      .catch((error) => {
        console.log("Error on login", error?.message);
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
        required
        error={Boolean(errors.email.length)}
        errors={errors.email}
        disabled={loading}
        onChange={handleChange}
        value={input.email}
      />
      <PasswordInput
        required
        name="password"
        placeholder="Contraseña"
        error={Boolean(errors.password.length)}
        errors={errors.password}
        disabled={loading}
        onChange={handleChange}
        value={input.password}
      />
      <Button
        variant="link"
        className="ml-auto mt-3"
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
