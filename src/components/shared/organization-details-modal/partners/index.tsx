/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import {
  BrokerageSocietyTeamMemberType,
  OrganizationClientType,
  PublicOrganizationType,
} from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { ROUTES } from "@/constants/router";

interface OrganizationPartnersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  partners: Array<
    OrganizationClientType | PublicOrganizationType | BrokerageSocietyTeamMemberType
  >;
}

const OrganizationPartners = ({
  partners = [],
  className,
  ...props
}: OrganizationPartnersProps) => {
  const { push, query } = useRouter();
  return (
    <section className={cn("flex flex-col gap-6 mt-5", className)} {...props}>
      {partners.map(({ id, name = "", type = "", ...props }: any, index) => {
        const organizationQuery = `${type || ""}-${id || ""}`;
        const hasOrganizationQuery = Boolean(type) && Boolean(id);

        return (
          <article
            key={`${id}-${index}`}
            onClick={() => {
              if (!hasOrganizationQuery) return;
              push({
                pathname: ROUTES.ORGANIZATIONS,
                query: { ...query, details: organizationQuery },
              });
            }}
            className={cn(
              "w-full flex items-center justify-start gap-4",
              hasOrganizationQuery && "cursor-pointer"
            )}
          >
            {"logoUrl" in props && (
              <Image
                className="w-20 h-20 border border-blue-500 border-opacity-20 rounded-xl object-cover object-center"
                src={props.logoUrl || "/images/placeholder.webp"}
                alt={name}
                width={200}
                title={name}
                height={200}
              />
            )}
            {"photoUrl" in props && (
              <Image
                className="w-20 h-20 border border-blue-500 border-opacity-20 rounded-xl object-cover object-center"
                src={props.photoUrl || "/images/placeholder.webp"}
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
