import IphoneDesktop from "@/components/icons/iphone-desktop";
import IphoneMobile from "@/components/icons/iphone-mobile";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import { cn } from "@/utils/class-name";
import { Carousel } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { INTERMEDIARIES_LIST } from "./constants";
import { OrganizationTypes } from "@/lib/sektor-api/__generated__/types";

const Intermediaries = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { push } = useRouter();

  return (
    <section
      className={cn(
        "w-full z-10 flex flex-col items-center justify-center gap-5 md:gap-8",
        className
      )}
      {...props}
    >
      <header className="text-pretty text-center flex flex-col items-center justify-center gap-3 md:max-w-lg lg:max-w-3xl">
        <h2 className="text-3xl lg:text-6xl">Nuestros intermediarios</h2>
        <p className="font-century-gothic text-base lg:text-xl lg:max-w-xl lg:text-balance">
          Ofrecemos a nuestros usuarios una amplia variedad de opciones y
          expertos en seguros, todo en un solo lugar.
        </p>
      </header>

      {/* Mobile/Table version */}
      <section className="bg-blue-400 text-white w-full p-4 py-6 rounded-3xl max-w-lg lg:hidden flex flex-col items-center justify-center">
        <header className="text-center mb-6">
          <h3 className="text-2xl">
            Elige el intermediario de seguros que mejor se adapte a ti
          </h3>
          <p className="font-century-gothic text-base lg:text-xl">
            Entra aquí y conoce sus perfil, los seguros con los que trabajan,
            <b> contacta</b> y <b>conecta</b> con ellos
          </p>
        </header>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="w-full bg-blue-200 text-blue-500 text-center flex flex-col justify-center items-center gap-1 min-h-32 rounded-3xl">
            <b className="text-4xl">30k</b>
            <span className="font-century-gothic text-sm">
              corredores a elegir
            </span>
          </div>
          <div className="w-full bg-blue-200 text-blue-500 text-center flex flex-col justify-center items-center gap-1 min-h-32 rounded-3xl">
            <b className="text-4xl">+100</b>
            <span className="font-century-gothic text-sm">
              cotizaciones realizadas
            </span>
          </div>
          <div className="w-full bg-blue-200 text-blue-500 text-center flex flex-col justify-center items-center gap-1 h-32 rounded-3xl">
            <b className="text-4xl">+90%</b>
            <span className="font-century-gothic text-sm">
              satifacción de nuestro clientes
            </span>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 h-16 w-16 sm:h-28 sm:w-28 z-10 rounded-3xl">
              <Carousel
                autoplay
                dots={false}
                draggable
                fade
                speed={1000}
                className="flex items-center justify-center w-full relative h-16 sm:h-28 rounded-3xl overflow-hidden"
              >
                {INTERMEDIARIES_LIST.map(({ name, location, image }, index) => (
                  <div
                    key={`intermediary-${name}-${location}-${index}`}
                    className="bg-white h-16 sm:h-28"
                  >
                    <Image
                      className="w-full h-10 sm:h-20 object-cover object-top"
                      src={image}
                      width={400}
                      height={400}
                      alt=""
                    />
                    <h4 className="text-[6px] text-center px-1">
                      <b>{name}</b>, {location}
                    </h4>
                  </div>
                ))}
              </Carousel>
            </div>
            <IphoneMobile className="w-full scale-110 sm:scale-110 translate-x-6 -translate-y-2 sm:translate-x-10" />
          </div>
        </div>

        <Button
          className="w-full max-w-xs mt-6"
          onClick={() =>
            push({
              pathname: ROUTES.ORGANIZATIONS,
            })
          }
        >
          Conocer intermediarios
        </Button>
      </section>

      {/* Desktop version */}
      <section className="hidden lg:grid grid-cols-12 gap-8 bg-blue-400 text-white w-full px-8 pt-12 rounded-3xl">
        <div className="col-span-7 pb-10 flex flex-col items-center justify-center gap-4">
          <header className="text-center mb-6">
            <h3 className="text-4xl text-balance">
              Elige el intermediario de seguros que mejor se adapte a ti
            </h3>
            <p className="font-century-gothic text-xl mt-4 xl:max-w-lg mx-auto">
              Entra aquí y conoce sus perfil, los seguros con los que trabajan,
              <b> contacta</b> y <b>conecta</b> con ellos
            </p>
          </header>

          <div className="flex justify-around items-center gap-4">
            <div className="w-full bg-blue-200 text-blue-500 text-center flex flex-col justify-center items-center gap-1 min-h-32 rounded-3xl">
              <b className="text-4xl">1k</b>
              <span className="font-century-gothic text-sm">
                potenciales corredores
              </span>
            </div>
            <div className="w-full bg-blue-200 text-blue-500 text-center flex flex-col justify-center items-center gap-1 min-h-32 rounded-3xl">
              <b className="text-4xl">+100</b>
              <span className="font-century-gothic text-sm">
                cotizaciones realizadas
              </span>
            </div>
            <div className="w-full bg-blue-200 text-blue-500 text-center flex flex-col justify-center items-center gap-1 h-32 rounded-3xl">
              <b className="text-4xl">+90%</b>
              <span className="font-century-gothic text-sm">
                satifacción de nuestro clientes
              </span>
            </div>
          </div>
          <Button
            className="mt-6"
            onClick={() =>
              push({
                pathname: ROUTES.ORGANIZATIONS,
              })
            }
          >
            Conocer intermediarios
          </Button>
        </div>

        <div className="relative col-span-5 flex justify-center items-end ">
          <div className="absolute right-0 top-0 h-52 w-52 z-10 rounded-3xl xl:top-20 xl:left-0 xl:-translate-x-14">
            <Carousel
              autoplay
              dots={false}
              draggable
              fade
              speed={1000}
              className="flex items-center justify-center w-full relative h-52 rounded-3xl overflow-hidden"
            >
              {INTERMEDIARIES_LIST.map(
                ({ name, location, image, description }, index) => (
                  <div
                    key={`intermediary-${name}-${location}-${index}`}
                    className="bg-white h-52"
                  >
                    <Image
                      className="w-full h-32 object-cover object-top"
                      src={image}
                      width={700}
                      height={700}
                      alt=""
                    />
                    <h4 className="text-[10px] text-start px-2">
                      <b>{name}</b>, {location}
                    </h4>
                    <p className="text-xs text-start px-2">{description}</p>
                  </div>
                )
              )}
            </Carousel>
          </div>
          <IphoneDesktop className="scale-110 translate-x-2 -translate-y-5 xl:scale-100 xl:translate-y-0 xl:translate-x-14 2xl:translate-x-24 xl:w-full" />
        </div>
      </section>
    </section>
  );
};

export default Intermediaries;
