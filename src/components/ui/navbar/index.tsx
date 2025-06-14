import { useState } from "react";
import Link from "next/link";
import Button from "../button";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { Drawer } from "antd";
import { faBars } from "@fortawesome/free-solid-svg-icons";
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

  const isAuthenticated = useAuthStore((state) => state.getIsAuthenticated)();
  const resetAuthStore = useAuthStore((state) => state.resetAuthStore);
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = isAuthenticated && userGroup === UserGroups.Admin;
  const isCustomer = isAuthenticated && userGroup === UserGroups.Customer;

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleLogout = () => {
    resetAuthStore();
    window?.localStorage?.clear();
    push(ROUTES.HOME);
  };

  const { BrokerageSociety, InsuranceBroker, ExclusiveAgent } = OrganizationTypes;
  const allowedTypes = [BrokerageSociety, InsuranceBroker, ExclusiveAgent];
  const { organizationData } = useOrganizationData();
  const isCompany = allowedTypes.includes(organizationData?.type as OrganizationTypes);
  

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
            {isAdmin && (
              <Link
                className={cn(
                  " hover:text-blue-400 border-b border-b-gray-300 pb-2 focus:outline-none text-blue-500 text-lg",
                  { "font-bold": pathname === ROUTES.COMPANIES }
                )}
                href={ROUTES.COMPANIES}
              >
                Empresa
              </Link>
            )}

            {isAuthenticated && (isCustomer || isCompany) &&(
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
          {isAdmin && (
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
