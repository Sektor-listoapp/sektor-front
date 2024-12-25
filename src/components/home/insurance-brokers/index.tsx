import Button from "@/components/ui/button";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import React from "react";

const InsuranceBrokers = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn(
        "w-full flex flex-col items-center justify-center border-2 border-green-500 pt-12 lg:flex-row-reverse lg:items-center lg:justify-between lg:pt-0",
        className
      )}
      {...props}
    >
      {/* <div className="absolute top-0 left-0 w-96 h-96 scale-150 rounded-full bg-blue-200 z-0" /> */}

      <header className="text-start font-century-gothic flex flex-col items-start justify-start gap-3 border-2 border-yellow-500 z-10 sm:text-center text-balance lg:justify-center">
        <h2 className="text-2xl">
          Somos una plataforma que conecta a los
          <b> mejores corredores de seguros</b> con personas <b>como tú.</b>
        </h2>
        <p className="text-base w-full">
          Entra y descubre las <b>sociedades de corretaje</b> cerca de ti.
        </p>
        <Button
          variant="solid-blue"
          className="hidden lg:block w-full max-w-sm"
        >
          Descubre
        </Button>
      </header>

      {/* Cards - Mobile/Tablet version */}
      <div className="w-full border-2 border-blue-500 relative flex justify-center items-center pb-20 mt-6 max-w-sm lg:mt-0">
        <article className="w-28 h-36 rounded-2xl overflow-hidden bg-white border-2 border-orange-500 absolute top-6 left-0 shadow-lg z-10">
          <Image
            className="h-28 object-cover object-center"
            src="/images/office-1.webp"
            alt="Oficina de seguros"
            width={300}
            height={300}
          />
          <h3 className="w-full px-1 text-[8px]">
            Oficinas en Puerto La Cruz, Antoategui
          </h3>
        </article>
        <article className="w-48 h-56 rounded-2xl overflow-hidden bg-white border-2 border-red-500 shadow-lg z-[5] ">
          <Image
            className="h-44 object-cover object-center"
            src="/images/office-2.webp"
            alt="Oficina de seguros"
            width={300}
            height={300}
          />
          <h3 className="w-full px-1 text-xs">
            Oficinas en Caracas, Distrito Capital
          </h3>
        </article>
        <article className="w-28 h-36 rounded-2xl overflow-hidden bg-white border-2 border-yellow-500 absolute bottom-9 right-0 shadow-lg">
          <Image
            className="h-28 object-cover object-center"
            src="/images/office-3.webp"
            alt="Oficina de seguros"
            width={300}
            height={300}
          />
          <h3 className="w-full px-1 text-[8px] ">
            Oficinas en Valencia, Carabobo
          </h3>
        </article>
      </div>

      <footer className="border-2 border-red-500 w-full flex justify-center items-center z-10 lg:hidden">
        <Button variant="solid-blue" className="w-full max-w-sm">
          Descubre
        </Button>
      </footer>
    </section>
  );
};

export default InsuranceBrokers;
