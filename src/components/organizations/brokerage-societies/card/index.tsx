import { PublicBrokerageSociety } from "@/types/public";
import { cn } from "@/utils/class-name";
import { getFormattedYearsOfExperience } from "@/utils/formatters";
import Image from "next/image";
import React from "react";
import LineOfBusiness from "../../line-of-business";
import OrganizationModality from "../../modality";

interface BrokerageSocietyCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  data: PublicBrokerageSociety;
}

const BrokerageSocietyCard = ({
  data,
  className,
  ...props
}: BrokerageSocietyCardProps) => {
  const { name } = data;
  const yearsOfExperience = getFormattedYearsOfExperience(data?.startDate);

  return (
    <article
      className={cn(
        "w-full h-full min-w-96 overflow-hidden rounded-2xl shadow-lg font-century-gothic grid grid-cols-3 relative sm:min-w-[500px] lg:min-w-full",
        className
      )}
      {...props}
    >
      <div className="w-fit rounded-2xl px-2 sm:px-4 rounded-e-none absolute top-0 right-0 bg-blue-500 text-white text-[10px] md:text-xs font-bold p-1 rounded-t-2xl lg:text-xs">
        {yearsOfExperience}
      </div>
      <Image
        className="w-full h-full object-cover object-center rounded-l-2xl"
        src={data?.logoUrl}
        alt={name}
        width={500}
        height={400}
      />
      <div className="w-full col-span-2 p-2 text-xs rounded-r-2xl border-l-0 border border-blue-500 border-opacity-10 md:text-sm flex flex-col justify-between gap-2 lg:p-4">
        <h3
          className="w-full mt-2 text-base sm:text-lg font-semibold pb-1 border-b border-b-blue-500"
          title={name}
        >
          {name}
        </h3>
        <div className="w-full text-xs sm:text-sm">
          <h4 className="text-sm sm:text-base">Trabaja con</h4>
          <ul className="list-disc list-inside pl-2">
            <li>Partner 1</li>
            <li>Partner 2</li>
            <li>Partner 3</li>
          </ul>
        </div>
        <div className="w-full flex justify-between gap-2">
          <OrganizationModality modality={data?.modality} />
          <LineOfBusiness lineOfBusiness={data?.lineOfBusiness} />
        </div>
      </div>
    </article>
  );
};

export default BrokerageSocietyCard;
