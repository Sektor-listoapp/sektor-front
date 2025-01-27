import { PublicInsuranceBroker } from "@/types/public";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import React from "react";
import OrganizationModality from "../../modality";
import LineOfBusiness from "../../line-of-business";
import { getFormattedYearsOfExperience } from "@/utils/formatters";

interface InsuranceBrokerCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: PublicInsuranceBroker;
}

const InsuranceBrokerCard = ({
  data,
  className,
  ...props
}: InsuranceBrokerCardProps) => {
  const { name } = data;

  const yearsOfExperience = getFormattedYearsOfExperience(data?.startDate);

  return (
    <article
      className={cn(
        "w-full min-w-60 min-h-64 overflow-hidden rounded-2xl shadow-lg font-century-gothic flex flex-col justify-between relative md:max-w-80 2xl:max-w-96",
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
      <div className="w-full p-2 text-xs rounded-b-2xl border border-blue-500 border-opacity-20 h-full flex flex-col justify-between gap-1 md:text-sm md:gap-2 md:p-4 2xl:text-base">
        <h3 className="w-full">{name}</h3>
        <div className="w-full flex justify-between items-center">
          <OrganizationModality modality={data?.modality} />
          <LineOfBusiness lineOfBusiness={data?.lineOfBusiness} />
        </div>
      </div>
    </article>
  );
};

export default InsuranceBrokerCard;
