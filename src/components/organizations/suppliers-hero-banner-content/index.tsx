import Image from "next/image";

const SupplierHeroBannerContent = () => {
  return (
    <div className="w-full gap-2 grid grid-cols-2 relative mx-auto lg:grid-cols-12">
      <h1 className="text-start text-3xl sm:text-4xl md:text-5xl lg:text-7xl w-full py-10 md:py-20 lg:py-16 z-10 lg:col-span-5">
        Conoce a nuestros proveedores
      </h1>

      <div className="md:relative lg:col-span-7">
        <Image
          className="w-3/4 bottom-0 right-0 absolute sm:max-w-96 md:w-[150%] md:max-w-lg lg:max-w-xl xl:max-w-3xl"
          src="/images/suppliers.webp"
          width={1000}
          height={1000}
          alt=""
        />
      </div>
    </div>
  );
};

export default SupplierHeroBannerContent;
