import IphoneDesktop from "@/components/icons/iphone-desktop";
import IphoneMobile from "@/components/icons/iphone-mobile";
import Button from "@/components/ui/button";
import { cn } from "@/utils/class-name";
import { Carousel } from "antd";
import Image from "next/image";
import React from "react";

const testIntermediaries = [
  {
    name: "Maria rojas",
    location: "Distrito Capital",
    description: "Especialista en seguros de vida y salud",
    image:
      "https://s3-alpha-sig.figma.com/img/d4ce/ce7b/ef793499111f44bac03d9c7e151bb19d?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SA4izksfTN7bnAWyx9KRpjxb4WnG6ABFMXcPsfPKdT8s9EogCDiTj-LWOIUaE7xxmNUMaH05lo8Ed6HgwkOs0afSOYb4fxkpB7WTjTmaDddA9t8kwyLx37Q59LPCURvX05Tq8vk8eyF2608DmzZjxxm1bpkdpKxio90fU3dU3yzorC9vY-VKrUUJEKMly-mPbkX76UnVsFKmjWkzYAar6raNQSvVtDbl9k4XCm79WQM3VY-9RUukLn-9FOOb5qqz2A3N~kLjX28wX2oYuYNNcTvkuaPmjfHTbuON3TdfVQ1a6bYrKjKn5hwWG7wBNjbfdpyHq9POl1o9utQYBT5R2w__",
  },
  {
    name: "Sergio Montolla",
    location: "Bolívar",
    description:
      "Innovador, nuevo en el mercado, proactivo, lo ultimo del mercado",
    image:
      "https://s3-alpha-sig.figma.com/img/146b/25ee/c79472b457f0edb99e2833d1fd808807?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ktYlbTIwCl7lRIp-BgUGV-VdBegh9ZXao9kTCXhbr17hVSUrhIW~4jc2G50YzNB1RxXkqnAowf860FEBU2ljyT0HlEJhkikOoeTF8al68TxgQ76Wl-QsMw-Jvlhk9LdxRe8kiN2xopO4Ia4fJ~AOVx-A2sp7TYFBrN5W~1YRvzZqa~9exDQuky1YKEL6~dG8Eg3pzsyafv2~3owRlzzut6KdpJJ~8RjPEEN307PTsyDdLObLepaNNvMSgsv-z3Vz1tYTdmhQ5oDcMIUt0lozhzDRsBx2AwnAa9Cip3CfkmOpDYoRJcSu2RvJ0xBCX-M9dJkL4XrogIEEX0idWTXX8g__",
  },
  {
    name: "José Manuel Ferrer",
    location: "Valencia",
    description: "Amplia experiencia en el mercado asegurador.",
    image:
      "https://s3-alpha-sig.figma.com/img/7173/c8e7/e832df70cc0a97852ed0c22d97d1884e?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=P9R1PnKqaS72ASsc7KBSM6xlNifbcRUJls-~4hb~U03OLcTCBNv4fpcULzzX7VWX-QwM8UFoEX8kjlDppdROVCSgh78F~ja2iicjP3zZIdGfn~ocjFvXvA7PC5-0ZwsasZMtButgDlNa~r-rAzuPi0oHBs30VsEfP5OZ8LnyIA6OcTrWHsA0y~DsAZBhkDVB7hn-HtJECUByF5UB6ql12-vwsxtS7VcyGtdoAwBslxAJd--eyFjO42uNkhh-SzCqmVMcDQT0aSR7YRhne9lSWg6elELW05mZ3jX5OCJ3DeDN5ONJOcK22UkwlslF938CWmvD2tgSp3eupTWwxOM5IQ__",
  },
];

const Intermediaries = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn(
        "w-full flex flex-col items-center justify-center gap-5 md:gap-8",
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
                {testIntermediaries.map(({ name, location, image }, index) => (
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

        <Button className="w-full max-w-xs mt-6">Conocer intermediarios</Button>
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
          <Button className="mt-6">Conocer intermediarios</Button>
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
              {testIntermediaries.map(
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
