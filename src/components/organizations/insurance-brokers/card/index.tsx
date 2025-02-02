import React from "react";
import Image from "next/image";
import OrganizationModality from "../../modality";
import LineOfBusiness from "../../line-of-business";
import { cn } from "@/utils/class-name";
import { getFormattedYearsOfExperience } from "@/utils/formatters";
import { InsuranceBrokerType } from "@/lib/sektor-api/__generated__/types";
import { useRouter } from "next/router";
import { showOrganizationDetails } from "@/utils/organizations";

interface InsuranceBrokerCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: InsuranceBrokerType;
}

const InsuranceBrokerCard = ({
  data,
  className,
  ...props
}: InsuranceBrokerCardProps) => {
  const router = useRouter();
  const { name } = data;
  const foundationYear = data?.foundationYear;
  const yearsOfExperience = Boolean(foundationYear)
    ? getFormattedYearsOfExperience(foundationYear as number)
    : null;

  return (
    <article
      className={cn(
        "w-full min-w-60 min-h-64 overflow-hidden rounded-2xl shadow-lg font-century-gothic flex flex-col justify-between relative md:max-w-80 2xl:max-w-96 md:hover:shadow-xl md:hover:cursor-pointer transition-shadow duration-300 md:active:shadow-sm",
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
        className="w-full h-full object-cover object-center rounded-t-2xl"
        src={data?.logoUrl || "/images/placeholder.png"}
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
