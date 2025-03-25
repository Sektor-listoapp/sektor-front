import React from "react";
import { Table } from "antd";
import Switch from "@/components/ui/switch";
import styles from "./index.module.css";
import { cn } from "@/utils/class-name";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { QuoteType } from "@/lib/sektor-api/__generated__/types";

interface QuotesTableProps {
  data: QuoteType[];
  disabled: boolean;
}

const QuotesTable = ({ data, disabled }: QuotesTableProps) => {
  const columns: ColumnProps<QuoteType>[] = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: QuoteType) => {
        return (
          <p className="cursor-pointer hover:text-blue-700 transition-all hover:scale-105">
            {name}
          </p>
        );
      },
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      className: "text-center",
      render: (clicks: number | undefined) => {
        return <p>{clicks ? clicks : 0}</p>;
      },
    },
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      className: "text-center",
      render: (createdAt: string) => (
        <span>
          {createdAt ? dayjs(createdAt)?.format("DD/MM/YYYY") : "No disponible"}
        </span>
      ),
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
      className: "text-center",
      render: (email: string | undefined) => (
        <span>{email ? email : "No disponible"}</span>
      ),
    },
    {
      title: "Activo",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: QuoteType) => (
        <div className="w-full flex justify-center items-center">
          <Switch disabled={disabled} checked={isActive} />
        </div>
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
