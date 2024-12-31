import Button from "@/components/ui/button";
import { cn } from "@/utils/class-name";
import { Carousel } from "antd";
import Image from "next/image";
import React from "react";

const testImages = [
  "https://s3-alpha-sig.figma.com/img/c042/0a34/7eefde7830ccd656a3aa60a2b1ea6d4f?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=X1HRLsw8rfrG5baeRYGk0a6V-saxV-TJCRJvDaOGAfGgO7yV-gqw549JR5k7q6Zn0O2HfTjiTIsaPrdvh6HDO5JEphvVvjzsXuBLbBAw5r5hjv1wpURFlHu65t0xtwVqA6zN7dEEgzdLUhq6JtBFVn38FDW6m8K5Y~jnpeUS2hhVW7btuCe88Kksl-dpsgMEwXSOeV7OUoTiCLE7sJFKD9PuYCf-DIEbvGFTVrWYYDUFUxPCOcpTDdn7Z2A0VnDiVgotruqb2zIxKVE0LdUpPhjvIDtllKzX9JENNll00sevMF6pkcEcUBFfilAw37Yp2mXgQlzbeN~5d8PtTbtmCg__",
  "https://s3-alpha-sig.figma.com/img/c45d/5da1/dcb45171647db02ba74db29211d37fcf?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=dUp9MDOmPTRswBAyD-vfQnzS-1QDRBKT23kty-tHMy22yRkcZN0HtX~HJ8U7B2WmZ4wzdaPl99V3b~Y-Jx5z7cYvWtgzMAZYmq1NU0xqbQzkygVotwMJJk79lsji3gFmDsIfAOM3zYy4FDV9ixtfXRSWQtKRXh76XVzeDsAtmBCwOzfPACY-3jlNrmyMkEoCq8n0GqquNtdkFLKzgE4NLK1mYsyyFLSeoaLMVT9ML60j3LVfnWTAAjZKdRQ2ZnqGoysx~Q4IFuJ22wzZ8-HFjRdt9yjIfBqp~TVtj~u~wul5tr8nfRqxaj3eChG-~AFcOunny1gNYvfxM-NWqT~S9w__",
  "https://s3-alpha-sig.figma.com/img/b04a/de64/a47f95f724a5a4578c29811bb339be1a?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=e~zxnjC0R67w8S5nUs5bcb7FWf4J5oaYZcMByYvIYrOZnnaFl3Q0od-cRVfv4KO4~WMByOQRB~69DK~p3AHtNxlaPg4VvFM40yvTwHgLny8hzNtbNxP0OxVoSkBvuDRIEKEipYMQlfwgVmBapOst68KlP~8whoFKrMMBczGX~AeXq2JLMQ-mFQ-HFyoFvJnHrvaQpq~-euda4lpR~sDifT175R7yHlqHJ~raKzRIgvFYXe-qWVY19Te8qJ4uy8Y8Rf8HHP75pTFsL3n-yb6nP8fDVfKSco-yBiorQ87mYsXx36MGL78TNBlmkhqTEYtIn6mI8~9gqJAvcvA3G~~2yQ__",
  "https://s3-alpha-sig.figma.com/img/76e6/9d70/56516863d603a6a3ef9e47d9450a3903?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=kDlUDVgXHZAwHGeGwOVJS7pzXwG~ofosnKBwpGbgR59KykvPr3W782wUaeGHex4PtSmEGh72ydPxkah78SrOrOMwIl5F7oO8Oj5PZIvHQG88fgcvkE2DkCTtN8QdUZXW8lEYcNSks11rclzkMZXW6MgFbDO-xiYvmody35I87sOpdo9qah2FX2tv-8yp-509OIUN4t5YNpAm89yZRSuDOxH8DZlaBOrnHNp0Bh5H7Q8TT2vaGIpVnXrEKkA50BUBQT-VXjhU2QT6rwMwtbES0A2dsbQRDsf1IJ-yKGiCJ7x8G9762aE4-DSTFX7e-~li-be4Lb7RoRlSL2j9~Am2-g__",
  "https://s3-alpha-sig.figma.com/img/69a1/ac4e/d1a34956277d1992fe79b0e89853f0f3?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=IgHCb2Nbys6wxTq4vwu6shFalSJ112FFVt2uzkddPxXxHYDuls8XzKaYdhNvvxtADQyP3nWt2S0bSigu8l8T06aCj-580xiYuAM0U5ei4FKK27vgawijaawLWQ~xuyvEUljZ1fMX2MJC8-vOmHI0MtJ4xx6DeNxpp7NLu1nDaD8HWmTA455tRshq3LELVF~4XlRDjBCdSfMcUsQkeYK-4DIs3M4kuq84VGAKACuJFusx07n9fOeDnUJKhjO0rNI6Gqi7r-FxF-OCMDiJwSEKLmRcQb2mhwlK1ncnPc4oPjfhqZVmBrQvAx~1e5AJUUbOP1i4GNBTPKyjMdhi9boIEA__",
  "https://s3-alpha-sig.figma.com/img/3a8d/dfe9/aed1f9d749a1cef3b5226cbcc94fb61f?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WVaaPPLgZW519zRJGuT~4OaZtisrfrdRRIpoEpZkLQ~3u4XRqWokpdC2HaBG9ppJv-qCcDmIQHCAutipo3QKix45eOVaaNI0F-Ju1DVEOf53ACYIiEQSSg1VXoJY1z73xlkZQj-2~BxYbQxZicyBr0~6XGEIek-FGIU9ivWbeEpe0k4NCTQxc8XETWODDW6-NcziJsjFScbh1bEQcSzv9vYkxZ2G7ZN9SpCtEyUfYpxZc-B-BqLkUaNzyLKMahTSwO41z79RD2HCeoEkxDLvIt6Qbjr8FfH~G7zNszGuNwL9V01m9DzGAqCdaiA-gaLHXBJujgRduTvBnwu82jtFgQ__",
  "https://s3-alpha-sig.figma.com/img/4e88/62ca/043ce54a0072d4f398c7a1b09ef220d6?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Wffh~ir4Glp348t04T-VlQeWtHszm20wdNSlkikb3FpwrdOXRqWvAtFL9KnMGSk3Cbc~6uvZqMhEX2e3cwX6ONgheY~r-U8k2E2I3P5otmZ6cQYSSu9jg~H7plDXhZbW1sb-A-P1M4VCS0LYjft45H0qnfj-CFy2kjj9UzEoSSGAzcDA498lAJaGF~4BeZkjEGJseAKk9Nx3AlR-10y3gFy7TZBI~CHEHm4nF0AjuDlodN1NgMNKUroUYQTq2HtTaMsTOysHPlxQB1eHgKAO~BQYYIDa-MDzfxnCYGeza8Iha2CQb8mRyrUZZ7OIUotRTG5h4XvWfiTxEWxrqVt2gQ__",
  "https://s3-alpha-sig.figma.com/img/833a/138a/82dcf1b17f1d5b25b76a904b0a399a49?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=aA3IQpvAYZYYAX1Vig37ZAwxxZkU-ImVJA7h37RJgUsBhktWL3kqrDEpAlZ-1sPCw-e9NdTNb~C7nXKvwVdOC94jggCNE7JQTgVV2Ep~IsVnBmS1Qk4n0zT0WxoJ8~VVr4G4XD95BNkKNLI1YUlwDKLhHvE3IMtejViUWKFWi4d3AHU5oj0FeipphXLbSN9FMlAJgZ4niUOLmBv5KktMnFhiBDum5Ne7dXM-rXJ5uuHbKJX3KOo54cfEkGEJZFiSFE44Vw0wzQRuyu1SbOOmWYtgq-8IfHQUfB6N64~BaBUgTafIgopvw-l5YiMzM5pnbTqsotC4SAFdKoIeUwhKAg__",
  "https://s3-alpha-sig.figma.com/img/7b94/7ba0/424ee737899b430e44d2fad32e713e4d?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=joZztUIUaRke1laSsf7ifm1cEJMnWUCXOuSkOt9iXRJ~mytua5iWzf31blhSq3uCKaK7dKIzHV6Bv-Icvpycpw95MW1lRiQ3hCfztE-0oGdohcU3DAMhJEw0koqQseAjTefLrZeAkd65qR7f33atjAqqX1PLDJ9vwEA-D7hz70yUzQ-DGOhVSVsF8YMSPKaMTdUkh7pYt3TB87UrWeQpHrAzhthYrfqKy2Rbakm3GpXAW~uhHnwkjYYzJtyZ4NQivW3ee8RwzUx-LzCUGKwz2eG-1ybcFCev549m63WgxAbyPmuDj9ko6T858ZBZ2qLseStlO1fO0pFYK20uYhYm9A__",
  "https://s3-alpha-sig.figma.com/img/71a1/916e/c2b6131b364e1e4e87047f9a4600095f?Expires=1736121600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gvUDNAEd4i4bbBgU6clWurqXlLyNO77M0o-8G5z0DhNLL6z2Z0Mv49wBHKcdZLYaI0BfhVLqL5~qmPmRQ0HhIoXGMB26DRu5h3DOTHugzMOy6zPdoaz4muBz28QgjWf~u5kweXFtZgdblg0V-54fEdpOyxYzHDW0zhlpfLZVD-CTtinR3j7Ac2WOeHCrP7nfLbOFr6Sglr38KIcr8h2GQRWbZZUY4Nl0xkbbjBAIsOlZwx92zQMtDxY62QpMz~djk5SS4xlyezyDEQl-oKOd1N6xSFTjG87giOR42~-IQwjW2sEnuKYxFNOuaWqdDow5dmVDcuw-dxQuaAO4yFzwCw__",
];

const InsuranceCompaniesInfo = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <section
      className={cn(
        "w-full flex flex-col items-center justify-center gap-5 mb-10 md:mb-16 lg:mb-28 md:grid md:grid-cols-2 md:gap-10",
        className
      )}
      {...props}
    >
      <div className="text-pretty text-center flex flex-col items-center justify-center gap-3 md:text-start md:gap-4">
        <h2 className="text-3xl lg:text-6xl">
          <span className="md:hidden">
            Trabajamos con las mejores Compañias de Seguros
          </span>
          <span>
            Con nosotros, accede a información detallada sobre las principales
            aseguradoras
          </span>
        </h2>
        <p className="font-century-gothic text-base lg:text-xl">
          <span className="md:hidden">
            Elige una póliza que se ajuste perfectamente a tus necesidades
            ¡Conoce nuestras opciones de seguros y elige la que mejor se adapte
            a tu estilo de vida!
          </span>
          <span className="hidden md:block">
            Elige una póliza que se ajuste perfectamente a tus necesidades
            ¡Conoce las opciones de las compañías de seguros autorizadas por
            <b> SUDEASEG</b> y elige la que mejor se adapte a tu estilo de vida!
          </span>
        </p>
      </div>
      <div className="w-11/12 max-w-sm md:max-w-full">
        <Carousel
          autoplay
          dots={false}
          draggable
          speed={1000}
          className="flex items-center justify-center w-full relative h-36 md:h-60 xl:h-36"
        >
          {testImages.map((image, index) => (
            <Image
              key={`insurance-company-${index}`}
              className="w-11/12 h-32 m-auto max-w-full object-contain md:h-60 xl:h-36"
              src={image}
              width={700}
              height={700}
              alt=""
            />
          ))}
        </Carousel>
      </div>
      <footer className="w-full max-w-sm md:col-span-2 md:max-w-full flex items-center justify-center">
        <Button variant="solid-blue" className="w-full md:max-w-sm">
          Ver más
        </Button>
      </footer>
    </section>
  );
};

export default InsuranceCompaniesInfo;
