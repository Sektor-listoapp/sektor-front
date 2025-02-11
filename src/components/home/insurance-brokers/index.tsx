import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import { OrganizationTypes } from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const InsuranceBrokers = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { push } = useRouter();

  return (
    <section
      className={cn(
        "w-full relative flex flex-col items-center justify-center pt-8 lg:pt-0 lg:grid lg:grid-cols-12 lg:gap-10",
        className
      )}
      {...props}
    >
      {/* Background pattern for mobile */}
      <div className="absolute -top-1/4 w-[170%] h-[130%] rounded-full bg-blue-200 z-0 sm:w-[120%] sm:h-[145%] sm:-top-[40%] md:hidden" />

      {/* Background pattern for tablet and desktop devices */}
      <Image
        src="/images/map-view.webp"
        className="hidden md:block absolute -top-[15%] -left-2/4 z-0"
        width={1400}
        height={1323}
        alt=""
      />

      <header className="text-start font-century-gothic flex flex-col items-start justify-start gap-3 z-10 sm:text-center text-balance lg:justify-center lg:col-span-6 lg:order-1 lg:text-start lg:gap-10 lg:items-center lg:mb-auto lg:mt-24 xl:mt-32">
        <h2 className="text-2xl lg:text-5xl">
          Somos una plataforma que conecta a los
          <b> mejores corredores de seguros</b> con personas <b>como tú.</b>
        </h2>
        <p className="text-base w-full lg:text-xl">
          Entra y descubre las <b>sociedades de corretaje</b> cerca de ti.
        </p>
        <Button
          variant="solid-blue"
          className="hidden lg:block w-full max-w-fit px-20"
          onClick={() =>
            push({
              pathname: ROUTES.ORGANIZATIONS,
              query: { type: OrganizationTypes.InsuranceBroker },
            })
          }
        >
          Conecta
        </Button>
      </header>

      <div className="w-full relative flex justify-center items-center pb-20 mt-6 max-w-sm lg:mt-0 lg:flex-col-reverse lg:items-start lg:py-10 lg:col-span-6 lg:max-w-md lg:mx-auto xl:max-w-full">
        <article className="w-28 h-36 rounded-2xl overflow-hidden bg-white absolute top-6 left-0 shadow-lg z-10 lg:static lg:h-60 lg:w-48 lg:z-10 xl:h-80 xl:w-72 xl:-translate-x-6 2xl:-translate-x-10 xl:-translate-y-16">
          <Image
            className="h-28 object-cover object-center lg:h-[200px] xl:h-[280px]"
            src="/images/office-1.webp"
            alt="Oficina de seguros"
            width={300}
            height={300}
          />
          <h3 className="w-full px-1 text-[8px] lg:text-[10px] xl:text-sm lg:pt-1">
            Oficinas en Puerto La Cruz, Antoategui
          </h3>
        </article>
        <article className="w-48 h-56 rounded-2xl overflow-hidden bg-white shadow-lg z-[5] lg:static lg:order-1 lg:h-60 lg:w-48 lg:z-10 xl:h-80 xl:w-72 xl:-translate-x-6 2xl:-translate-x-10">
          <Image
            className="h-44 object-cover object-center lg:h-[200px] xl:h-[280px]"
            src="/images/office-2.webp"
            alt="Oficina de seguros"
            width={300}
            height={300}
          />
          <h3 className="w-full px-1 text-xs lg:text-[10px] xl:text-sm lg:pt-1">
            Oficinas en Caracas, Distrito Capital
          </h3>
        </article>
        <article className="w-28 h-36 rounded-2xl overflow-hidden bg-white absolute bottom-9 right-0 shadow-lg  lg:ml-auto lg:h-60 lg:w-48 lg:static xl:h-80 xl:w-72 lg:z-10">
          <Image
            className="h-28 object-cover object-center lg:h-[200px] xl:h-[280px]"
            src="/images/office-3.webp"
            alt="Oficina de seguros"
            width={300}
            height={300}
          />
          <h3 className="w-full px-1 text-[8px] lg:text-[10px] xl:text-sm lg:pt-1">
            Oficinas en Valencia, Carabobo
          </h3>
        </article>
        <div className="hidden lg:block w-64 h-px bg-red-500 absolute top-1/4 right-1/4 rotate-45 xl:top-[40%] xl:right-1/3" />
        <div className="hidden lg:block w-64 h-px bg-red-500 absolute bottom-1/4 right-1/4 -rotate-45 xl:bottom-[38%] xl:right-1/3" />
      </div>

      <footer className="w-full flex justify-center items-center z-10 lg:hidden lg:col-span-0s">
        <Button
          variant="solid-blue"
          className="w-full max-w-fit px-20 "
          onClick={() =>
            push({
              pathname: ROUTES.ORGANIZATIONS,
              query: { type: OrganizationTypes.InsuranceBroker },
            })
          }
        >
          Descubre
        </Button>
      </footer>
    </section>
  );
};

export default InsuranceBrokers;
