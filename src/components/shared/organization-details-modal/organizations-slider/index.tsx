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
import { useRouter } from "next/router";
import { ROUTES } from "@/constants/router";

interface OrganizationsSliderProps extends SwiperOptions {
  organizations: Array<PublicOrganizationType | OrganizationClientType>;
}

const OrganizationsSlider = ({
  organizations,
  ...swiperOptions
}: OrganizationsSliderProps) => {
  const { push, query } = useRouter();
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
        {organizations.map((organization, index) => {
          const { id, name, logoUrl, type = "" } = organization;
          const organizationQuery = `${type}-${id}`;

          return (
            <SwiperSlide key={`${id}-${index}`}>
              <Image
                title={name}
                className="w-full cursor-pointer"
                src={logoUrl || "/images/placeholder.png"}
                alt={name}
                width={200}
                height={200}
                onClick={() =>
                  push({
                    pathname: ROUTES.ORGANIZATIONS,
                    query: { ...query, details: organizationQuery },
                  })
                }
              />
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

export default OrganizationsSlider;
