import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import {
  OrganizationClientType,
  PublicOrganizationType,
} from "@/lib/sektor-api/__generated__/types";
import { Swiper as SwiperType, SwiperOptions } from "swiper/types";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface OrganizationsSliderProps extends SwiperOptions {
  organizations: PublicOrganizationType[] | OrganizationClientType[];
}

const OrganizationsSlider = ({
  organizations,
  ...swiperOptions
}: OrganizationsSliderProps) => {
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
        slidesPerView={3}
        spaceBetween={30}
        autoplay={{ delay: 1500 }}
        rewind={true}
        className="w-full"
        {...swiperOptions}
      >
        {organizations.map(({ id, name, logoUrl }, index) => (
          <SwiperSlide key={`${id}-${index}`}>
            <Image
              title={name}
              className="w-full"
              src={logoUrl || "/images/placeholder.png"}
              alt={name}
              width={200}
              height={200}
            />
          </SwiperSlide>
        ))}
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

export default OrganizationsSlider;
