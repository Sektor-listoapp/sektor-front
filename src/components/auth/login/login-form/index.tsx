import Button from "@/components/ui/button";
import { LOGIN } from "@/lib/sektor-api/mutations";
import { useMutation } from "@apollo/client";
import React from "react";

const LoginForm = () => {
  const [login] = useMutation(LOGIN);

  const handleLogin = async () => {
    try {
      const response = await login({
        variables: {
          input: {
            email: "test@test.com",
            password: "Sektor2025",
          },
        },
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Login Form</h1>
      <Button variant="solid-blue" className="px-12 mt-4" onClick={handleLogin}>
        Iniciar sesión
      </Button>
    </div>
  );
};

export default LoginForm;
