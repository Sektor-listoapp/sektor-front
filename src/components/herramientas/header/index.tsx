import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { ROUTES } from "@/constants/router";
import { cn } from "@/utils/class-name";

const HerramientasHeader = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <header className="w-full bg-white py-6 px-8">
      <div className="max-w-screen-xl mx-auto flex items-center">
        {/* Logo */}
        <SektorFullHorizontalLogo
          width={140}
          className="text-blue-500 cursor-pointer"
          onClick={() => router.push(ROUTES.HOME)}
        />


        <nav className="flex-1 flex items-center justify-center gap-8 font-century-gothic text-sm">
          <Link
            href={ROUTES.HOME}
            className="text-blue-500 hover:text-blue-400 transition-colors focus:outline-none"
          >
            Inicio
          </Link>
          <Link
            href={ROUTES.NEWS}
            className={cn(
              "text-blue-500 hover:text-blue-400 transition-colors focus:outline-none",
              {
                "underline underline-offset-4": pathname === ROUTES.NEWS,
              }
            )}
          >
            Noticias
          </Link>
          <Link
            href={ROUTES.MODULES}
            className={cn(
              "text-blue-500 hover:text-blue-400 transition-colors focus:outline-none",
              {
                "underline underline-offset-4": pathname === ROUTES.MODULES,
              }
            )}
          >
            Modulos
          </Link>
        </nav>

        {/* Empty div for balance */}
        <div className="w-[140px]" />
      </div>
    </header>
  );
};

export default HerramientasHeader;
