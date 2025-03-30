import React from "react";
import { Table } from "antd";
import styles from "./index.module.css";
import { cn } from "@/utils/class-name";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import {
  QuoteCustomerType,
  QuoteType,
} from "@/lib/sektor-api/__generated__/types";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface QuotesTableProps {
  data: QuoteType[];
  disabled: boolean;
}

const QuotesTable = ({ data, disabled }: QuotesTableProps) => {
  const { replace } = useRouter();

  const columns: ColumnProps<QuoteType>[] = [
    {
      title: "Nombre",
      dataIndex: "customer",
      key: "name",
      render: ({ name }: QuoteCustomerType) => {
        return (
          <p className="cursor-pointer hover:text-blue-700 transition-all hover:scale-105">
            {name ? name : "No disponible"}
          </p>
        );
      },
    },
    {
      title: "Telefono",
      dataIndex: "customer",
      key: "phone",
      render: ({ phone }: QuoteCustomerType) => (
        <span>{phone ? phone : "No disponible"}</span>
      ),
    },
    {
      title: "Correo electrónico",
      dataIndex: "customer",
      key: "email",
      render: ({ email }: QuoteCustomerType) => (
        <span>{email ? email : "No disponible"}</span>
      ),
    },
    {
      title: "Fecha de solicitud",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => (
        <span>
          {createdAt ? dayjs(createdAt)?.format("DD/MM/YYYY") : "No disponible"}
        </span>
      ),
    },
    {
      title: "Acciòn",
      dataIndex: "id",
      key: "action",
      render: (id: string, record: QuoteType) => {
        const { lineOfBusiness } = record;
        const quoteQuery = `${lineOfBusiness || ""}-${id || ""}`;
        const hasValidQuery = quoteQuery?.length > 5;

        return (
          <span
            className="underline cursor-pointer"
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
            Ver
          </span>
        );
      },
    },
    {
      title: "Abierto",
      dataIndex: "read",
      key: "read",
      render: (read: boolean) => (
        <span className={cn(read ? styles.green : styles.red)}>
          {read ? "Si" : "No"}
        </span>
      ),
    },
  ];

  return (
    <Table
      dataSource={data}
      className={cn("hidden xl:block w-full !text-blue-500", styles.table)}
      columns={columns}
      pagination={{
        pageSize: 6,
        position: ["bottomCenter"],
        showLessItems: true,
      }}
    />
  );
};

export default QuotesTable;
