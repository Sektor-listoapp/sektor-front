import Image from "next/image";

const DefaultHeroBannerContent = () => {
  return (
    <div className="w-full gap-2 grid grid-cols-2 relative mx-auto sm:max-w-md md:max-w-full">
      <h1 className="text-balance text-start text-3xl sm:text-4xl lg:text-7xl w-full py-12 sm:py-16 md:py-24 z-10">
        Nuestros Intermediarios
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
  );
};

export default DefaultHeroBannerContent;
