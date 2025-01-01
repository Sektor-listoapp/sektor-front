import Button from "@/components/ui/button";
import { PUBLIC_ORGANIZATIONS_QUERY } from "@/lib/sektor-api/queries";
import { PublicOrganizationType } from "@/types/public";
import { cn } from "@/utils/class-name";
import { useQuery } from "@apollo/client";
import { Carousel, Spin } from "antd";
import Image from "next/image";
import React from "react";

const InsuranceCompaniesInfo = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { data, loading, error } = useQuery(PUBLIC_ORGANIZATIONS_QUERY, {
    variables: { type: "InsuranceCompany" },
  });

  if (error) {
    console.error(error);
    return null;
  }

  const insuranceCompanies = (data?.getPublicOrganizations?.items ||
    []) as PublicOrganizationType[];

  console.log(insuranceCompanies);
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
          <span className="md:hidden">
            Trabajamos con las mejores Compañias de Seguros
          </span>
          <span>
            Con nosotros, accede a información detallada sobre las principales
            aseguradoras
          </span>
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
      <div className="w-11/12 max-w-sm md:max-w-full">
        {loading ? (
          <Spin className="m-auto w-full" size="large" />
        ) : (
          <Carousel
            autoplay
            dots={false}
            draggable
            speed={1000}
            className="flex items-center justify-center w-full relative h-36 md:h-60 xl:h-36"
          >
            {insuranceCompanies?.map(({ id, logoUrl, name }, index) => (
              <Image
                key={`insurance-company-${id}-${index}`}
                className="w-11/12 h-32 m-auto max-w-full object-contain md:h-60 xl:h-36"
                src={logoUrl}
                width={700}
                height={700}
                alt={name}
              />
            ))}
          </Carousel>
        )}
      </div>
      <footer className="w-full max-w-sm md:col-span-2 md:max-w-full flex items-center justify-center">
        <Button variant="solid-blue" className="w-full md:max-w-sm">
          Ver más
        </Button>
      </footer>
    </section>
  );
};

export default InsuranceCompaniesInfo;
