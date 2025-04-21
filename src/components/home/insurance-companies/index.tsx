import React from "react";
import InsuranceCompaniesCarousel from "@/components/shared/insurance-companies-carousel";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import { OrganizationTypes } from "@/lib/sektor-api/__generated__/types";

const InsuranceCompanies = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { push } = useRouter();

  return (
    <section
      className={cn(
        "w-full flex flex-col items-center justify-center gap-5 mb-10 md:mb-16 lg:mb-28 md:grid md:grid-cols-2 md:gap-10",
        className
      )}
      {...props}
    >
      <div className="text-pretty text-center flex flex-col items-center justify-center gap-3 md:text-start md:gap-4">
        <h2 className="text-3xl lg:text-6xl">
          Con nosotros, accede a información detallada sobre las principales
          aseguradoras
        </h2>
        <p className="font-century-gothic text-base lg:text-xl">
          <span className="md:hidden">
            Elige una póliza que se ajuste perfectamente a tus necesidades
            ¡Conoce nuestras opciones de seguros y elige la que mejor se adapte
            a tu estilo de vida!
          </span>
          <span className="hidden md:block">
            Elige una póliza que se ajuste perfectamente a tus necesidades
            ¡Conoce las opciones de las compañías de seguros autorizadas por
            <b> SUDEASEG</b> y elige la que mejor se adapte a tu estilo de vida!
          </span>
        </p>
      </div>
      <InsuranceCompaniesCarousel />
      <footer className="w-full max-w-sm md:col-span-2 md:max-w-full flex items-center justify-center">
        <Button
          variant="solid-blue"
          className="w-full md:max-w-sm"
          onClick={() =>
            push({
              pathname: ROUTES.ORGANIZATIONS,
              query: { type: OrganizationTypes.InsuranceCompany },
            })
          }
        >
          Ver más
        </Button>
      </footer>
    </section>
  );
};

export default InsuranceCompanies;
