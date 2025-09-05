import Button from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


const DefaultHeroBannerContent = () => {


  return (
    <div className="w-full gap-2 grid grid-cols-2 relative mx-auto sm:max-w-md md:max-w-full">
      <header className="py-6 sm:py-16 md:py-24 z-10">
        <h1 className="text-balance text-start text-lg sm:text-4xl lg:text-7xl w-full mb-6 sm:mb-8 md:mb-10">
          Nuestros Intermediarios
        </h1>

        <Link href="/clinic-list">
          <Button className="text-xs sm:text-base px-4 sm:px-6 py-2 sm:py-3">
            Ver listado de clínicas y seguros disponibles
          </Button>
        </Link>


      </header>

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
  );
};

export default DefaultHeroBannerContent;
