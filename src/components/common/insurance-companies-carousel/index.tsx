import React from "react";
import Spinner from "@/components/ui/spinner";
import { PUBLIC_INSURANCE_COMPANIES_QUERY } from "@/lib/sektor-api/queries";
import { PublicInsuranceCompany } from "@/types/public/public-insurance-companies";
import { useQuery } from "@apollo/client";
import { Carousel } from "antd";
import Image from "next/image";
import { cn } from "@/utils/class-name";

interface InsuranceCompaniesCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  carouselClassName?: string;
  imageClassName?: string;
}

const InsuranceCompaniesCarousel = ({
  className,
  imageClassName,
  carouselClassName,
}: InsuranceCompaniesCarouselProps) => {
  const { data, loading, error } = useQuery(PUBLIC_INSURANCE_COMPANIES_QUERY);

  if (error) {
    console.error("Error fetching insurance companies", error);
  }

  const insuranceCompanies = (data?.publicInsuranceCompanies?.items ||
    []) as PublicInsuranceCompany[];

  return (
    <div className={cn("w-11/12 max-w-sm md:max-w-full", className)}>
      {loading ? (
        <Spinner className="m-auto w-10 h-10 text-blue-500 transition-all my-24 md:my-auto text-opacity-70" />
      ) : (
        <Carousel
          autoplay
          dots={false}
          draggable
          speed={1000}
          className={cn(
            "flex items-center justify-center w-full relative h-36 md:h-60 xl:h-36",
            carouselClassName
          )}
        >
          {insuranceCompanies?.map(({ id, logoUrl, name }, index) => (
            <Image
              key={`insurance-company-${id}-${index}`}
              className={cn(
                "w-11/12 h-32 m-auto max-w-full object-contain md:h-60 xl:h-36",
                imageClassName
              )}
              src={logoUrl}
              width={700}
              height={700}
              alt={name}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default InsuranceCompaniesCarousel;
