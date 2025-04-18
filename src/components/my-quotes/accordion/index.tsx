import React from "react";
import { QuoteType } from "@/lib/sektor-api/__generated__/types";
import { Collapse } from "antd";
import styles from "./index.module.css";
import { cn } from "@/utils/class-name";
import { faChevronDown, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const { Panel } = Collapse;

interface QuotesAccordionProps {
  data: QuoteType[];
  disabled: boolean;
}

const QuotesAccordion = ({ data, disabled }: QuotesAccordionProps) => {
  const { replace } = useRouter();

  return (
    <Collapse
      expandIconPosition="right"
      accordion
      className={cn("w-full max-w-xl xl:hidden", styles.accordion)}
      ghost
      expandIcon={({ isActive }) => (
        <FontAwesomeIcon
          icon={faChevronDown}
          size="2xl"
          className={cn(
            "text-blue-500",
            isActive ? "transform rotate-180" : "transform rotate-0"
          )}
        />
      )}
    >
      {data?.map(({ customer, read, createdAt, lineOfBusiness, id }, index) => {
        const { name, email, phone } = customer;
        const quoteQuery = `${lineOfBusiness || ""}-${id || ""}`;
        const hasValidQuery = quoteQuery?.length > 5;

        const listItems = [
          { title: "Nombre:", value: name ?? "No disponible" },
          { title: "Teléfono:", value: phone ?? "No disponible" },
          { title: "Correo electrónico:", value: email ?? "No disponible" },
          {
            title: "Fecha de solicitud:",
            value: createdAt
              ? dayjs(createdAt)?.format("DD/MM/YYYY")
              : "No disponible",
          },
          { title: "Abierto:", value: read ? "Sí" : "No" },
        ];

        return (
          <Panel header={name} key={`${id}-${index}`}>
            <section className="w-full flex flex-row items-start justify-between gap-2 bg-gray-300 rounded-xl p-5 text-blue-500 text-sm sm:text-base">
              <ul className="w-full flex flex-col items-start justify-start gap-3">
                {listItems?.map(({ title, value }, index) => (
                  <li
                    key={`${id}-${index}`}
                    className="w-full flex items-start justify-start gap-1"
                  >
                    <span className="font-bold">{title}</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-fit flex flex-col items-center justify-center gap-3"
                onClick={() => {
                  if (disabled) return;
                  if (!hasValidQuery) {
                    toast.error(
                      "No se pudo obtener la información de la cotización, por favor intenta de nuevo más tarde."
                    );
                    return;
                  }
                  replace({ query: { quote: quoteQuery } });
                }}
              >
                <span className="text-xs">Detalles</span>
                <FontAwesomeIcon
                  icon={faEye}
                  size="xl"
                  className="text-blue-500"
                />
              </button>
            </section>
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default QuotesAccordion;
