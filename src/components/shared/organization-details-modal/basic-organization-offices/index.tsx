import { OrganizationOfficeType } from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BasicOrganizationOfficesProps
  extends React.HTMLAttributes<HTMLDivElement> {
  offices: OrganizationOfficeType[];
}

const BasicOrganizationOffices = ({
  offices,
  className,
  ...props
}: BasicOrganizationOfficesProps) => {
  return (
    <section
      className={cn(
        "w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-10",
        className
      )}
      {...props}
    >
      {offices.map((office, index) => {
        const street = office?.address?.street || "";
        const stateName = office?.address?.state?.name || "";
        const cityName = office?.address?.city?.name || "";
        const countryName = office?.address?.country?.name || "";
        const formattedAddress = `${
          street ? `${street}, ` : ""
        }${cityName}, ${stateName}`;
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;

        return (
          <article
            key={`office-${office.id}-${index}`}
            className={cn(
              "w-full min-w-60 min-h-64 rounded-2xl mx-auto font-century-gothic flex flex-col max-w-sm justify-between relative md:max-w-80 2xl:max-w-96 2xl:h-96 md:hover:shadow-xl md:hover:cursor-pointer transition-shadow duration-300 md:active:shadow-sm"
            )}
            onClick={() => window.open(googleMapsUrl, "_blank")}
          >
            <Image
              className="w-full h-full object-cover object-center 2xl:h-72 rounded-t-2xl"
              src={office?.photoUrl || "/images/placeholder.png"}
              alt={office?.address?.state?.name}
              width={500}
              height={400}
            />
            <div className="w-full shadow-lg p-2 text-xs rounded-b-2xl border border-blue-500 border-opacity-20 h-full flex flex-col justify-between gap-1 md:text-sm md:gap-2 md:p-4 2xl:text-base">
              <h3 className="w-full">{`${stateName}, ${countryName}`}</h3>
              <Link
                href={googleMapsUrl}
                passHref
                target="_blank"
                className="w-full underline"
              >
                Ir al mapa
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default BasicOrganizationOffices;
