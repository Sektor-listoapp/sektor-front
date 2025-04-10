import { cn } from "@/utils/class-name";
import Image from "next/image";
import React from "react";
import OrganizationModality from "../../modality";
import LineOfBusiness from "../../line-of-business";
import { getFormattedYearsOfExperience } from "@/utils/formatters";
import { ExclusiveAgentType } from "@/lib/sektor-api/__generated__/types";
import { showOrganizationDetails } from "@/utils/organizations";
import { useRouter } from "next/router";

interface ExclusiveAgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ExclusiveAgentType;
}

const ExclusiveAgentCard = ({
  data,
  className,
  ...props
}: ExclusiveAgentCardProps) => {
  const router = useRouter();
  const { name } = data;
  const foundationYear = data?.foundationYear;
  const yearsOfExperience = Boolean(foundationYear)
    ? getFormattedYearsOfExperience(foundationYear as number)
    : null;

  const organizationLogoUrl = data?.allies?.[0]?.logoUrl;

  return (
    <article
      className={cn(
        "w-full h-full min-w-60 min-h-64 overflow-hidden rounded-2xl shadow-lg font-century-gothic flex flex-col justify-between relative md:max-w-80 2xl:max-w-96 md:hover:shadow-xl md:hover:cursor-pointer transition-shadow duration-300 md:active:shadow-sm",
        className
      )}
      onClick={() => showOrganizationDetails({ router, data })}
      {...props}
    >
      {Boolean(yearsOfExperience) && (
        <div className="w-fit rounded-2xl px-4 rounded-e-none absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold p-1 rounded-t-2xl">
          {yearsOfExperience}
        </div>
      )}
      <Image
        className="w-full min-h-72 h-72 object-cover object-center rounded-t-2x"
        src={data?.logoUrl || "/images/placeholder.png"}
        alt={name}
        width={500}
        height={400}
      />
      <div className="w-full p-2 text-xs rounded-b-2xl border border-blue-500 border-opacity-20 h-full grid grid-cols-6 gap-1 md:text-sm md:gap-2 md:p-4">
        <div className="w-full flex flex-col justify-evenly gap-2 col-span-4">
          <h3 className="w-full truncate md:text-balance" title={name}>
            {name}
          </h3>
          <LineOfBusiness lineOfBusiness={data?.lineOfBusiness} />
          <OrganizationModality modality={data?.modality} />
        </div>
        {Boolean(organizationLogoUrl) && (
          <Image
            className="w-full col-span-2 max-w-20 m-auto 2xl:max-w-24"
            src={organizationLogoUrl as string}
            alt={name}
            width={500}
            height={400}
          />
        )}
      </div>
    </article>
  );
};

export default ExclusiveAgentCard;
