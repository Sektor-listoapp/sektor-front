import Button from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import TextInput from "@/components/ui/text-input";
import { ROUTES } from "@/constants/router";
import { INPUT_ERROR_MESSAGES, REGEX } from "@/constants/validations";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const { EMAIL } = INPUT_ERROR_MESSAGES;

const LoginForm = () => {
  const { push } = useRouter();

  // const [login] = useMutation(LOGIN);

  // const handleLogin = async () => {
  //   try {
  //     const response = await login({
  //       variables: {
  //         input: {
  //           email: "test@test.com",
  //           password: "Sektor2025",
  //         },
  //       },
  //     });
  //     console.log(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({
    email: [],
    password: [],
  });

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    console.log({ email, password });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!REGEX.EMAIL.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: [EMAIL.EXAMPLE],
      }));
      return;
    }
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
  };

  return (
    <form onSubmit={handleLogin} className="border-2 border-blue-500 w-full">
      <TextInput
        placeholder="Correo electrónico"
        name="email"
        className="mb-10"
        value={email}
        icon={faUser}
        onChange={handleEmailChange}
        required
        error={Boolean(errors.email.length)}
        errors={errors.email}
      />
      <PasswordInput
        placeholder="Contraseña"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <Button
        variant="link"
        className="ml-auto mt-3"
        onClick={() => push(ROUTES.FORGOT_PASSWORD)}
      >
        Olvide mi contraseña
      </Button>
      <Button variant="solid-blue" className="w-full mt-12" type="submit">
        Iniciar sesión
      </Button>
    </form>
  );
};

export default LoginForm;
