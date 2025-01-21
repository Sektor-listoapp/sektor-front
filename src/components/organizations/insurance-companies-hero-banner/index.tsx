import Image from "next/image";
import HeroBannerNavbar from "../hero-banner-navbar";
import { useIsClient } from "@uidotdev/usehooks";

const InsuranceCompaniesHeroBanner = () => {
  const isClient = useIsClient();

  return (
    <header className="bg-blue-500 w-full sm:gap-8 md:bg-white">
      {isClient && <HeroBannerNavbar />}

      <div className="w-full bg-blue-500">
        <div className="max-w-screen-xl w-full px-7 flex flex-col items-start justify-start gap-5 xl:items-center md:gap-20 xl:gap-28 mx-auto 2xl:px-0">
          <div className="w-full gap-2 grid grid-cols-2 relative mx-auto sm:max-w-md md:max-w-full">
            <h1 className="text-balance text-start text-3xl sm:text-4xl lg:text-7xl w-full py-12 sm:py-16 md:py-24 z-10">
              Las opciones de Compañías de Seguros
            </h1>

            <div className="md:relative">
              <Image
                className="hidden md:block w-full bottom-0 left-0 absolute md:max-w-96 lg:max-w-full"
                src="/images/partners.webp"
                width={1000}
                height={1000}
                alt=""
              />
              <Image
                className="md:hidden w-full max-w-[450px] bottom-0 left-[5%] absolute -z-0 sm:left-[15%] "
                src="/images/partners-mobile.webp"
                width={700}
                height={700}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default InsuranceCompaniesHeroBanner;
