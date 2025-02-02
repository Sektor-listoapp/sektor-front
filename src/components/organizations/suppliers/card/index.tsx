import React from "react";
import Image from "next/image";
import { cn } from "@/utils/class-name";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { SUPPLIER_SERVICE_TYPE_LABEL } from "../constants";
import { SupplierType } from "@/lib/sektor-api/__generated__/types";

interface SupplierCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: SupplierType;
}

const SupplierCard = ({ data, className, ...props }: SupplierCardProps) => {
  const { name } = data;

  const address = data?.offices?.[0]?.address || {};
  const { city, state } = address;
  const stateName = state?.name || "";
  const cityName = city?.name || "";
  const formattedAddress = `${cityName}${stateName ? `, ${stateName}` : ""}`;

  const supplierServiceType =
    SUPPLIER_SERVICE_TYPE_LABEL[
      data?.serviceType as keyof typeof SUPPLIER_SERVICE_TYPE_LABEL
    ];

  const allies = data?.allies?.slice(0, 3) || [];

  return (
    <article
      className={cn(
        "w-full h-full min-w-96 overflow-hidden rounded-2xl shadow-lg font-century-gothic grid grid-cols-3 relative sm:min-w-[500px] lg:min-w-full",
        className
      )}
      {...props}
    >
      <div className="w-fit rounded-2xl px-2 sm:px-4 rounded-e-none absolute top-0 right-0 bg-blue-500 text-white text-[10px] md:text-xs font-bold p-1 rounded-t-2xl lg:text-xs">
        {supplierServiceType}
      </div>
      <Image
        className="w-full h-full object-cover object-center rounded-l-2xl"
        src={data?.logoUrl || "/images/placeholder.png"}
        alt={name}
        width={500}
        height={400}
      />
      <div className="w-full h-full col-span-2 p-2 text-xs rounded-r-2xl border-l-0 border border-blue-500 border-opacity-10 md:text-sm flex flex-col justify-between gap-2 lg:p-4">
        <h3
          className="w-full mt-2 text-base sm:text-lg font-semibold pb-1 border-b border-b-blue-500"
          title={name}
        >
          {name}
        </h3>
        {Boolean(allies.length) && (
          <div className="w-full text-xs sm:text-sm">
            <h4 className="text-sm sm:text-base">Trabaja con</h4>
            <ul className="list-disc list-inside pl-2">
              {allies.map((ally, index) => (
                <li key={`${ally?.name}-${index}`}>{ally?.name}</li>
              ))}
            </ul>
          </div>
        )}

        {address && (
          <div className="w-full flex justify-start items-center gap-2">
            <FontAwesomeIcon icon={faLocationDot} size="lg" />
            <span>{formattedAddress}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default SupplierCard;
