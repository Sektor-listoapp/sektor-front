import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { OrganizationOfficeType } from "@/lib/sektor-api/__generated__/types";
import { Swiper as SwiperType, SwiperOptions } from "swiper/types";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/class-name";
import Link from "next/link";

interface OrganizationOfficesSliderProps extends SwiperOptions {
  offices: OrganizationOfficeType[];
}

const OrganizationOfficesSlider = ({
  offices,
  ...swiperOptions
}: OrganizationOfficesSliderProps) => {
  const sliderRef = useRef<SwiperType | null>(null);

  return (
    <div className="w-full text-blue-500 flex items-center justify-between gap-2">
      <FontAwesomeIcon
        icon={faChevronLeft}
        size="lg"
        className="cursor-pointer"
        onClick={() => sliderRef.current?.slidePrev()}
      />
      <Swiper
        onSwiper={(it) => (sliderRef.current = it)}
        spaceBetween={30}
        breakpoints={{
          740: {
            slidesPerView: 2,
          },
          300: {
            slidesPerView: 1,
          },
        }}
        autoplay={{ delay: 1500 }}
        rewind={true}
        className="w-full"
        {...swiperOptions}
      >
        {offices.map((office, index) => {
          const address = office?.address || {};
          const street = address?.street || "";
          const stateName = address?.state?.name || "";
          const cityName = address?.city?.name || "";
          const countryName = address?.country?.name || "";
          const formattedAddress = `${
            street ? `${street}, ` : ""
          }${cityName}, ${stateName}`;
          const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;

          return (
            <SwiperSlide key={`${office.id}-${index}`}>
              <article
                key={`office-${office.id}-${index}`}
                className={cn(
                  "w-full min-h-64 rounded-2xl mx-auto font-century-gothic flex flex-col max-w-sm justify-between relative md:max-w-80 2xl:max-w-96 2xl:h-96 md:hover:shadow-xl md:hover:cursor-pointer transition-shadow duration-300 md:active:shadow-sm"
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
                <div className="w-full shadow-lg p-2 text-xs rounded-b-2xl border border-blue-500 border-opacity-20 h-full grid grid-cols-3 gap-1 md:text-sm md:gap-2 md:p-4">
                  <div className="col-span-2">
                    <h3 className="w-full">{`${stateName}, ${countryName}`}</h3>
                    {office?.phone && (
                      <h3 className="w-full">{office.phone}</h3>
                    )}
                  </div>

                  <div className="col-span-1 flex items-start">
                    <Link
                      href={googleMapsUrl}
                      passHref
                      target="_blank"
                      className="w-full underline text-sm"
                    >
                      Ir al mapa
                    </Link>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          );
        })}
      </Swiper>
      <FontAwesomeIcon
        className="cursor-pointer"
        icon={faChevronRight}
        size="lg"
        onClick={() => sliderRef.current?.slideNext()}
      />
    </div>
  );
};

export default OrganizationOfficesSlider;
