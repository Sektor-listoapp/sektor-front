import { Empty } from "antd";
import React from "react";

interface NoQuotesProps {
  quotesError?: boolean;
}

const NoQuotes = ({ quotesError = false }: NoQuotesProps) => {
  const errorMessage =
    "No se pudo cargar la información de las cotizaciones, por favor intenta de nuevo más tarde.";
  const emptyMessage = "No hay cotizaciones registradas.";

  return (
    <section className="w-full flex flex-col items-center justify-center gap-4 font-century-gothic py-20">
      <Empty
        description={quotesError ? errorMessage : emptyMessage}
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

export default NoQuotes;
