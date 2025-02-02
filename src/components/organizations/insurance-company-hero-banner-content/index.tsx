import InsuranceCompaniesCarousel from "@/components/shared/insurance-companies-carousel";

const InsuranceCompanyHeroBannerContent = () => {
  return (
    <div className="w-full gap-2 grid grid-cols-2 items-center relative mx-auto md:gap-10">
      <div className="w-full pb-10 sm:py-16 md:py-24 z-10 flex flex-col items-start justify-start gap-6 md:gap-10">
        <h1 className="text-start text-2xl sm:text-4xl md:text-5xl md:leading-tight lg:text-7xl w-full">
          Las opciones de compañías de seguros
        </h1>
        <h2 className="hidden md:block text-2xl font-century-gothic w-full font-light">
          Elige la que mejor se adapte a tu estilo de vida
        </h2>
      </div>

      <InsuranceCompaniesCarousel
        className="w-full relative"
        carouselClassName="my-auto w-full h-full relative"
      />
    </div>
  );
};

export default InsuranceCompanyHeroBannerContent;
