import Button from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const DefaultHeroBannerContent = () => {
  return (
    <div className="w-full gap-2 grid grid-cols-2 relative mx-auto lg:grid-cols-12">
      <header className="z-10 lg:col-span-5 py-10 md:py-20 lg:py-16">
        <h1 className="text-start text-3xl sm:text-4xl md:text-5xl lg:text-7xl w-full mb-10">
          Nuestros Intermediarios
        </h1>

        <div className="hidden md:flex flex-col sm:flex-row gap-3">
          <Link href="/clinic-list">
            <Button>Ver listado de clínicas</Button>
          </Link>
          <Link href="/workshop-list">
            <Button>Ver listado de talleres</Button>
          </Link>
        </div>
      </header>

      <div className="relative lg:col-span-7 flex items-end justify-end">
        <Image
          className="w-full h-auto object-contain object-bottom"
          src="/images/intermediaries-team.webp"
          width={900}
          height={441}
          alt="Equipo de intermediarios de Sektor"
          priority
        />
      </div>
    </div>
  );
};

export default DefaultHeroBannerContent;
