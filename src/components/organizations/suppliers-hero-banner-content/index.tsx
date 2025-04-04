import Button from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import OrganizationsSheetModal from "../organizations-sheet-modal";

const SupplierHeroBannerContent = () => {
  const [openOrganizationsSheetModal, setOpenOrganizationsSheetModal] =
    useState(false);

  return (
    <div className="w-full gap-2 grid grid-cols-2 relative mx-auto lg:grid-cols-12">
      <header className="z-10 lg:col-span-5 py-10 md:py-20 lg:py-16">
        <h1 className="text-start text-3xl sm:text-4xl md:text-5xl lg:text-7xl w-full mb-10">
          Conoce a nuestros proveedores
        </h1>

        <Button onClick={() => setOpenOrganizationsSheetModal(true)} className="hidden md:block">
          Ver listado de clínicas y seguros disponibles
        </Button>
        <OrganizationsSheetModal
          open={openOrganizationsSheetModal}
          setOpen={setOpenOrganizationsSheetModal}
        />
      </header>

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
