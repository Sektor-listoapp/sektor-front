import { PublicExclusiveAgent } from "@/types/public";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import React from "react";
import OrganizationModality from "../../modality";
import LineOfBusiness from "../../line-of-business";
import { getFormattedYearsOfExperience } from "@/utils/formatters";

interface ExclusiveAgentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PublicExclusiveAgent;
}

const ExclusiveAgentCard = ({
  data,
  className,
  ...props
}: ExclusiveAgentCardProps) => {
  const { name } = data;

  const yearsOfExperience = getFormattedYearsOfExperience(data?.startDate);

  return (
    <article
      className={cn(
        "w-full h-full min-w-60 min-h-64 overflow-hidden rounded-2xl shadow-lg font-century-gothic flex flex-col justify-between relative md:max-w-80 2xl:max-w-96",
        className
      )}
      {...props}
    >
      <div className="w-fit rounded-2xl px-4 rounded-e-none absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold p-1 rounded-t-2xl">
        {yearsOfExperience}
      </div>
      <Image
        className="w-full h-full object-cover object-center rounded-t-2xl"
        src={data?.logoUrl}
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
        <Image
          className="w-full col-span-2 max-w-20 m-auto 2xl:max-w-24"
          src={data?.organizationLogoUrl}
          alt={name}
          width={500}
          height={400}
        />
      </div>
    </article>
  );
};

export default ExclusiveAgentCard;
