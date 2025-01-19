import Navbar from "@/components/ui/navbar";
import Image from "next/image";

const HeroBanner = () => {
  return (
    <header className="bg-white w-full sm:gap-8">
      <div className="max-w-screen-xl py-6 px-7 w-full mx-auto lg:px-0">
        <Navbar variant="light" />
      </div>

      <div className="w-full bg-blue-500">
        <div className="max-w-screen-xl w-full px-7 flex flex-col items-start justify-start gap-5 xl:items-center md:gap-20 xl:gap-28 mx-auto lg:px-0">
          <div className="w-full gap-2 grid grid-cols-1 md:grid-cols-2">
            <h1 className="text-balance text-center text-4xl md:text-start lg:text-7xl w-full pt-14 pb-6 md:py-24 ">
              Nuestros Intermediarios
            </h1>

            <div className="relative">
              <Image
                className="w-full bottom-0 left-0 md:absolute md:max-w-96 lg:max-w-full"
                src="/images/partners.webp"
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

export default HeroBanner;
