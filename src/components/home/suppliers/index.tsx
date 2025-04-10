import Button from "@/components/ui/button";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { SUPPLIER_SERVICES } from "./constants";
import { ROUTES } from "@/constants/router";
import { OrganizationTypes } from "@/lib/sektor-api/__generated__/types";

const Suppliers = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { push } = useRouter();

  return (
    <section
      className={cn(
        "w-full z-10 mt-10 flex flex-col items-center justify-center gap-6 lg:mt-0 lg:gap-16 xl:-mt-10",
        className
      )}
      {...props}
    >
      <header className="w-full text-center flex flex-col items-center justify-center gap-1 lg:gap-3 lg:max-w-screen-md">
        <h2 className="text-3xl lg:text-6xl">Proveedores</h2>
        <p className="text-base w-full lg:text-xl font-century-gothic">
          Conoce las empresas profesionales que dan soporte a los servicios
          ofrecidos en tu póliza de seguro para brindarte atención a ti como
          <b> asegurado</b>
        </p>
      </header>

      <div className="w-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SUPPLIER_SERVICES.map(({ image, info, type, url }, index) => (
          <article
            key={`${type}-${index}`}
            className="group w-full shadow-2xl h-72 relative rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 text-white bg-blue-400 bg-opacity-30 hover:bg-opacity-60 transition-all"
          >
            <Image
              src={image}
              alt={type}
              width={500}
              height={500}
              className="object-cover absolute top-0 left-0 w-full h-full object-center -z-10 transition-transform group-hover:scale-110"
            />
            <h3 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold w-full text-center text-balance lg:text-4xl group-hover:-translate-y-28 transition-all">
              {type}
            </h3>
            <ul className="transition-all list-disc font-century-gothic">
              {info.map((info, index) => (
                <li
                  className="text-base transition-all opacity-0 cursor-none group-hover:opacity-100"
                  key={`${info}-${index}`}
                >
                  {info}
                </li>
              ))}
            </ul>
            <Button
              className="px-10 transition-all absolute bottom-4 opacity-0 group-hover:opacity-100"
              onClick={() =>
                push({
                  pathname: url,
                  query: { type: OrganizationTypes.Supplier },
                })
              }
            >
              Ver más
            </Button>
          </article>
        ))}
      </div>

      <footer className="w-full flex flex-col items-center justify-center gap-2">
        <Button
          variant="solid-blue"
          className="w-full sm:max-w-fit px-10"
          onClick={() =>
            push({
              pathname: ROUTES.ORGANIZATIONS,
              query: { type: OrganizationTypes.Supplier },
            })
          }
        >
          Ver todos los servicios
        </Button>
      </footer>
    </section>
  );
};

export default Suppliers;
