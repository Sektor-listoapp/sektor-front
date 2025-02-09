import React from "react";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import {
  OrganizationClientType,
  OrganizationTeamMemberType,
  PublicOrganizationType,
} from "@/lib/sektor-api/__generated__/types";

interface OrganizationPartnersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  partners: Array<
    OrganizationClientType | PublicOrganizationType | OrganizationTeamMemberType
  >;
}

const OrganizationPartners = ({
  partners = [],
  className,
  ...props
}: OrganizationPartnersProps) => {
  return (
    <section className={cn("flex flex-col gap-6 mt-5", className)} {...props}>
      {partners.map(({ id, name = "", ...props }, index) => {
        return (
          <article
            key={`${id}-${index}`}
            className="w-full flex items-center justify-start gap-4"
          >
            {"logoUrl" in props && (
              <Image
                className="w-20 h-20 border border-blue-500 border-opacity-20 rounded-xl object-cover object-center"
                src={props.logoUrl || "/images/placeholder.png"}
                alt={name}
                width={200}
                title={name}
                height={200}
              />
            )}
            {"photoUrl" in props && (
              <Image
                className="w-20 h-20 border border-blue-500 border-opacity-20 rounded-xl object-cover object-center"
                src={props.photoUrl || "/images/placeholder.png"}
                alt={name}
                title={name}
                width={200}
                height={200}
              />
            )}
            <div className="w-full">
              <h3 className="text-lg font-semibold font-century-gothic text-blue-500 lg:text-xl">
                {name}
              </h3>
              {"position" in props && (
                <h4 className="font-light font-century-gothic text-blue-500 lg:text-lg">
                  {props.position}
                </h4>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
};

export default OrganizationPartners;
