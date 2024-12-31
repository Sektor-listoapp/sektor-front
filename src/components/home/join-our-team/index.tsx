import Button from "@/components/ui/button";
import { cn } from "@/utils/class-name";
import React from "react";
import MobileAsset from "./mobile-asset";
import DesktopAsset from "./desktop-asset";

const JoinOurTeam = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn(
        "w-full mt-10 flex flex-col items-center justify-center gap-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:items-center lg:justify-center lg:my-10",
        className
      )}
      {...props}
    >
      <header className="w-full text-start flex flex-col items-center justify-center gap-2 max-w-sm md:text-center lg:text-start lg:max-w-full lg:gap-10">
        <h2 className="text-3xl lg:text-7xl w-full xl:pr-28">
          Forma parte de nuestro equipo
        </h2>
        <p className="text-base w-full lg:text-xl font-century-gothic">
          Llega a miles de clientes potenciales cada mes y aumenta tu cartera de
          clientes
        </p>
        <Button variant="solid-blue" className="hidden lg:block px-10 mx-auto w-fit text-nowrap">
          Conoce nuestros planes de suscripcion
        </Button>
      </header>

      <MobileAsset className="w-full max-w-sm lg:hidden" />
      <DesktopAsset className="hidden lg:block w-full" />

      <footer className="w-full flex flex-col items-center justify-center gap-2 lg:hidden">
        <Button variant="solid-blue" className="w-full sm:max-w-fit px-10">
          Conoce nuestros planes de suscripcion
        </Button>
      </footer>
    </section>
  );
};

export default JoinOurTeam;
