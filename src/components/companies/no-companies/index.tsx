import { Empty } from "antd";
import React from "react";

interface NoCompaniesProps {
  companiesError?: boolean;
}

const NoCompanies = ({ companiesError = false }: NoCompaniesProps) => {
  const errorMessage =
    "No se pudo cargar la información de las empresas, por favor intenta de nuevo más tarde.";
  const emptyMessage = "No hay empresas disponibles.";

  return (
    <section className="w-full flex flex-col items-center justify-center gap-4 font-century-gothic py-20">
      <Empty
        description={companiesError ? errorMessage : emptyMessage}
        style={{
          maxWidth: "450px",
          color: "#aaa",
          fontWeight: "500",
          fontFamily: "Century Gothic",
          textWrap: "balance",
        }}
      />
    </section>
  );
};

export default NoCompanies;
