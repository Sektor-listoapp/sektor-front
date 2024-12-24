"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../button";
import { usePathname, useRouter } from "next/navigation";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { Drawer } from "antd";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/utils/class-name";

const Navbar = () => {
  const { push } = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <nav className="w-full">
      <Drawer title="Basic Drawer" onClose={onClose} open={open}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>

      {/* Mobile/Tablet version */}
      <div className="flex items-center justify-between lg:hidden">
        <div />
        <SektorFullHorizontalLogo width={100} className="ml-[15%] sm:ml-[7%]" />

        <Button onClick={showDrawer} variant="base" className="p-0">
          <FontAwesomeIcon icon={faBars} size="2x" />
        </Button>
      </div>

      {/* Desktop version */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-screen-2xl mx-auto">
        <SektorFullHorizontalLogo width={180} className="lg:w-60" />

        <div className="transition-all duration-300 flex items-center justify-center gap-8 font-century-gothic xl:ml-auto xl: mr-20">
          <Link
            className={cn(" hover:text-gray-200 focus:outline-none", {
              "font-bold": pathname === "/",
            })}
            href="#"
          >
            Inicio
          </Link>
          <Link
            className={cn(" hover:text-gray-200 focus:outline-none", {
              "font-bold": pathname === "/insurance",
            })}
            href="#"
          >
            Seguros
          </Link>
          <Link
            className={cn(" hover:text-gray-200 focus:outline-none", {
              "font-bold": pathname === "/about-us",
            })}
            href="#"
          >
            Nosotros
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={() => push("/login")}>Iniciar sesión</Button>
          <Button onClick={() => push("/register")}>Registrarse</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
