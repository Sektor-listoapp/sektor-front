import clsx from "clsx";
import React from "react";

const RegisterFormHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <header
      className={clsx(
        "w-full border-2 border-red-500 text-center text-balance flex flex-col items-center gap-2 justify-center lg:gap-4",
        className
      )}
      {...props}
    >
      <h1 className="text-2xl lg:text-4xl">
        ¡Sé parte de nuestra comunidad aseguradora!
      </h1>
      <h2 className="font-century-gothic">
        Completa los datos para ser parte de la red ¡Somos experto en el área,
        <strong> más de 20 años de experiencia!</strong>
      </h2>
    </header>
  );
};

export default RegisterFormHeader;
