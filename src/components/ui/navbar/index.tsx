import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Button from "../button";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { Drawer } from "antd";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "@/utils/class-name";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/auth";
import { ROUTES } from "@/constants/router";
import { useShallow } from "zustand/shallow";
import { OrganizationTypes, UserGroups } from "@/lib/sektor-api/__generated__/types";
import { useOrganizationData } from "@/hooks/use-organization-data";


interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark";
}


const Navbar = ({ className, variant = "dark", ...props }: NavbarProps) => {
  const { push, pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);


  const isAuthenticated = useAuthStore((state) => state.getIsAuthenticated)();
  const resetAuthStore = useAuthStore((state) => state.resetAuthStore);
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = isAuthenticated && userGroup === UserGroups.Admin;
  const isCustomer = isAuthenticated && userGroup === UserGroups.Customer;



  useEffect(() => {
    setIsHydrated(true);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);


  const handleLogout = () => {
    resetAuthStore();
    window?.localStorage?.clear();
    push(ROUTES.HOME);
  };

  const handleToolsNavigation = (href: string) => {
    push(href);
    setIsToolsDropdownOpen(false);
    onClose();
  };

  const toolsMenuItems = [
   { label: "Módulos", href: ROUTES.MODULES },
   { label: "Noticias", href: ROUTES.ADMIN_NEWS },
  ];


  const { BrokerageSociety, InsuranceBroker, ExclusiveAgent } = OrganizationTypes;
  const allowedTypes = [BrokerageSociety, InsuranceBroker, ExclusiveAgent];
  const { organizationData } = useOrganizationData();
  const isCompany = allowedTypes.includes(organizationData?.type as OrganizationTypes);


  // Don't render authentication-dependent content until hydrated
  if (!isHydrated) {
    return (
      <nav className={cn("w-full", className)} {...props}>
        {/* Mobile/Tablet version */}
        <div className="flex items-center justify-between lg:hidden">
          <div />
          <SektorFullHorizontalLogo
            width={100}
            className={cn(
              "ml-[15%] sm:ml-[7%]",
              variant === "light" ? "text-blue-500" : "text-white",
              {
                "cursor-pointer": pathname !== ROUTES.HOME,
              }
            )}
            onClick={() => pathname !== ROUTES.HOME && push(ROUTES.HOME)}
          />


          <Button onClick={showDrawer} variant="base" className="p-0">
            <FontAwesomeIcon
              icon={faBars}
              size="2x"
              className={variant === "light" ? "text-blue-500" : "text-white"}
            />
          </Button>
        </div>


        {/* Desktop version */}
        <div className="hidden lg:flex items-center justify-between w-full max-w-screen-2xl mx-auto">
          <SektorFullHorizontalLogo
            width={200}
            onClick={() => pathname !== ROUTES.HOME && push(ROUTES.HOME)}
            className={cn(
              "lg:w-52",
              variant === "light" ? "text-blue-500" : "text-white",
              {
                "cursor-pointer": pathname !== ROUTES.HOME,
              }
            )}
          />


          <div
            className={cn(
              "transition-all duration-300 flex items-center justify-center gap-8 font-century-gothic xl:ml-auto xl: mr-20",
              variant === "light" ? "text-blue-500" : "text-white"
            )}
          >
            <Link
              className={cn(
                "focus:outline-none",
                variant === "light"
                  ? "hover:text-blue-400"
                  : "hover:text-gray-200",
                {
                  "font-bold": pathname === "/",
                }
              )}
              href={ROUTES.HOME}
            >
              Inicio
            </Link>
            <Link
              className={cn(
                "focus:outline-none",
                variant === "light"
                  ? "hover:text-blue-400"
                  : "hover:text-gray-200",
                {
                  "font-bold": pathname === ROUTES.ORGANIZATIONS,
                }
              )}
              href={ROUTES.ORGANIZATIONS}
            >
              Seguros
            </Link>
            <Link
              className={cn(
                "focus:outline-none",
                variant === "light"
                  ? "hover:text-blue-400"
                  : "hover:text-gray-200",
                {
                  "font-bold": pathname.startsWith(ROUTES.NOTICIAS),
                }
              )}
              href={ROUTES.NOTICIAS}
            >
              Noticias
            </Link>
          </div>


          <div className="flex items-center gap-6">
            {/* Placeholder buttons to prevent layout shift */}
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }


  return (
    <nav className={cn("w-full", className)} {...props}>
      <Drawer
        title={null}
        onClose={onClose}
        open={open}
        closeIcon={null}
        width={250}
        rootStyle={{ color: "#182F48" }}
        footer={
          <div className="flex flex-col gap-6 pb-8">
            {isAuthenticated ? (
              <>
                <Button
                  variant="solid-blue"
                  onClick={() => push(ROUTES.MY_ACCOUNT)}
                >
                  Mi cuenta
                </Button>
                <Button variant="solid-blue" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="solid-blue"
                  onClick={() => push(ROUTES.REGISTER)}
                >
                  Registrarte
                </Button>
                <Button variant="solid-blue" onClick={() => push(ROUTES.LOGIN)}>
                  Iniciar sesión
                </Button>
              </>
            )}
          </div>
        }
      >
        <div className="text-blue-500 pt-6 flex flex-col gap-8 items-center justify-center font-arial-rounded">
          <h3 className=" font-bold text-lg">Menu</h3>
          <nav className="flex flex-col gap-4 p-4 w-full font-century-gothic">
            <Link
              className={cn(
                " hover:text-blue-400 border-b border-b-gray-300 pb-2 focus:outline-none text-blue-500 text-lg",
                { "font-bold": pathname === "/" }
              )}
              href={ROUTES.HOME}
            >
              Inicio
            </Link>
            <Link
              className={cn(
                " hover:text-blue-400 border-b border-b-gray-300 pb-2 focus:outline-none text-blue-500 text-lg",
                { "font-bold": pathname === ROUTES.ORGANIZATIONS }
              )}
              href={ROUTES.ORGANIZATIONS}
            >
              Seguros
            </Link>
            <Link
              className={cn(
                " hover:text-blue-400 border-b border-b-gray-300 pb-2 focus:outline-none text-blue-500 text-lg",
                { "font-bold": pathname.startsWith(ROUTES.NOTICIAS) }
              )}
              href={ROUTES.NOTICIAS}
            >
              Noticias
            </Link>
            {isAdmin && (
              <>
                <Link
                  className={cn(
                    " hover:text-blue-400 border-b border-b-gray-300 pb-2 focus:outline-none text-blue-500 text-lg",
                    { "font-bold": pathname === ROUTES.COMPANIES }
                  )}
                  href={ROUTES.COMPANIES}
                >
                  Empresa
                </Link>

                <div className="border-b border-b-gray-300 pb-2">
                  <button
                    onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                    className={cn(
                      "w-full flex items-center justify-between hover:text-blue-400 focus:outline-none text-blue-500 text-lg",
                      { "font-bold": pathname.startsWith(ROUTES.HERRAMIENTAS) }
                    )}
                  >
                    Herramientas
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={cn("text-xs transition-transform", {
                        "rotate-180": isMobileToolsOpen,
                      })}
                    />
                  </button>
                  {isMobileToolsOpen && (
                    <div className="mt-2 pl-4 flex flex-col gap-2">
                      {toolsMenuItems.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => handleToolsNavigation(item.href)}
                          className={cn(
                            "text-left text-blue-500 hover:text-blue-400 text-base py-1",
                            { "font-bold": pathname === item.href }
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}


            {isAuthenticated && (isCustomer || isCompany) && (
              <Link
                className={cn(
                  " hover:text-blue-400 border-b border-b-gray-300 pb-2 focus:outline-none text-blue-500 text-lg",
                  { "font-bold": pathname === ROUTES.MY_QUOTES }
                )}
                href={ROUTES.MY_QUOTES}
              >
                Mis cotizaciones
              </Link>
            )}
          </nav>
        </div>
      </Drawer>


      {/* Mobile/Tablet version */}
      <div className="flex items-center justify-between lg:hidden">
        <div />
        <SektorFullHorizontalLogo
          width={100}
          className={cn(
            "ml-[15%] sm:ml-[7%]",
            variant === "light" ? "text-blue-500" : "text-white",
            {
              "cursor-pointer": pathname !== ROUTES.HOME,
            }
          )}
          onClick={() => pathname !== ROUTES.HOME && push(ROUTES.HOME)}
        />


        <Button onClick={showDrawer} variant="base" className="p-0">
          <FontAwesomeIcon
            icon={faBars}
            size="2x"
            className={variant === "light" ? "text-blue-500" : "text-white"}
          />
        </Button>
      </div>


      {/* Desktop version */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-screen-2xl mx-auto">
        <SektorFullHorizontalLogo
          width={200}
          onClick={() => pathname !== ROUTES.HOME && push(ROUTES.HOME)}
          className={cn(
            "lg:w-52",
            variant === "light" ? "text-blue-500" : "text-white",
            {
              "cursor-pointer": pathname !== ROUTES.HOME,
            }
          )}
        />


        <div
          className={cn(
            "transition-all duration-300 flex items-center justify-center gap-8 font-century-gothic xl:ml-auto xl: mr-20",
            variant === "light" ? "text-blue-500" : "text-white"
          )}
        >
          <Link
            className={cn(
              "focus:outline-none",
              variant === "light"
                ? "hover:text-blue-400"
                : "hover:text-gray-200",
              {
                "font-bold": pathname === "/",
              }
            )}
            href={ROUTES.HOME}
          >
            Inicio
          </Link>
          <Link
            className={cn(
              "focus:outline-none",
              variant === "light"
                ? "hover:text-blue-400"
                : "hover:text-gray-200",
              {
                "font-bold": pathname === ROUTES.ORGANIZATIONS,
              }
            )}
            href={ROUTES.ORGANIZATIONS}
          >
            Seguros
          </Link>
          <Link
            className={cn(
              "focus:outline-none",
              variant === "light"
                ? "hover:text-blue-400"
                : "hover:text-gray-200",
              {
                "font-bold": pathname.startsWith(ROUTES.NOTICIAS),
              }
            )}
            href={ROUTES.NOTICIAS}
          >
            Noticias
          </Link>
          {isAdmin && (
            <>
              <Link
                className={cn(
                  "focus:outline-none",
                  variant === "light"
                    ? "hover:text-blue-400"
                    : "hover:text-gray-200",
                  {
                    "font-bold": pathname === ROUTES.COMPANIES,
                  }
                )}
                href={ROUTES.COMPANIES}
              >
                Empresa
              </Link>

              <div className="relative" ref={toolsDropdownRef}>
                <button
                  onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                  className={cn(
                    "flex items-center gap-2 focus:outline-none",
                    variant === "light"
                      ? "hover:text-blue-400"
                      : "hover:text-gray-200",
                    {
                      "font-bold": pathname.startsWith(ROUTES.HERRAMIENTAS),
                    }
                  )}
                >
                  Herramientas
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cn("text-xs transition-transform", {
                      "rotate-180": isToolsDropdownOpen,
                    })}
                  />
                </button>

                {isToolsDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[150px] z-50">
                    {toolsMenuItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleToolsNavigation(item.href)}
                        className={cn(
                          "w-full px-4 py-2 text-left text-blue-500 hover:bg-gray-50 transition-colors",
                          {
                            "font-medium bg-gray-50": pathname === item.href,
                          }
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          {isAuthenticated && (isCustomer || isCompany) && (
            <Link
              className={cn(
                "focus:outline-none",
                variant === "light"
                  ? "hover:text-blue-400"
                  : "hover:text-gray-200",
                {
                  "font-bold": pathname === ROUTES.MY_QUOTES,
                }
              )}
              href={ROUTES.MY_QUOTES}
            >
              Mis cotizaciones
            </Link>
          )}
        </div>


        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Button
                variant="link"
                onClick={() => push(ROUTES.MY_ACCOUNT)}
                className={cn("text-white no-underline text-base", {
                  "text-blue-500": pathname === ROUTES.ORGANIZATIONS,
                })}
              >
                Mi cuenta
              </Button>
              <Button onClick={handleLogout}>Cerrar sesión</Button>
            </>
          ) : (
            <>
              <Button onClick={() => push(ROUTES.REGISTER)}>Registrarte</Button>
              <Button onClick={() => push(ROUTES.LOGIN)}>Iniciar sesión</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
