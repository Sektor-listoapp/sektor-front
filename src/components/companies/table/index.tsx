import React from "react";
import {
  OrganizationPlans,
  OrganizationType,
  OrganizationTypes,
  StateType,
} from "@/lib/sektor-api/__generated__/types";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "antd";
import { ORGANIZATION_TYPE_SELECT_OPTIONS } from "@/constants/forms";
import Switch from "@/components/ui/switch";
import styles from "./index.module.css";
import { cn } from "@/utils/class-name";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

interface CompaniesTableProps {
  data: OrganizationType[];
  disabled: boolean;
  changeOrgVisibility: (id: string, isACtive: boolean) => void;
  changeOrgPlan: (id: string, plan: OrganizationPlans) => void;
  countryStates: StateType[];
}

const { Premium, Standard } = OrganizationPlans;

const CompaniesTable = ({
  data,
  disabled,
  changeOrgPlan,
  changeOrgVisibility,
  countryStates,
}: CompaniesTableProps) => {
  const { replace } = useRouter();

  const columns: ColumnProps<OrganizationType>[] = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: OrganizationType) => {
        const { id, type } = record;
        const organizationQuery = `${type || ""}-${id || ""}`;
        const hasValidQuery = organizationQuery?.length > 5;

        return (
          <p
            onClick={() => {
              if (!hasValidQuery) {
                toast.error(
                  "No se pudo obtener la información de la organización, por favor intenta de nuevo más tarde."
                );
                return;
              }
              replace({ query: { details: organizationQuery } });
            }}
            className="cursor-pointer hover:text-blue-700 transition-all hover:scale-105"
          >
            {name}
          </p>
        );
      },
    },
    {
      title: "Tipo de usuario",
      dataIndex: "type",
      key: "type",
      render: (type: OrganizationTypes) => {
        const label = ORGANIZATION_TYPE_SELECT_OPTIONS.find(
          (option) => option.value === type
        )?.label;
        return <p>{label}</p>;
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
      title: "Ubicación",
      dataIndex: "coverageStates",
      key: "coverageStates",
      className: "text-center",
      render: (coverageStates: number[] | undefined) => {
        const state = countryStates?.find(
          (state) => state?.id === coverageStates?.[0]
        )?.name;
        return <span>{state ? state : "No disponible"}</span>;
      },
    },
    {
      title: "Activo",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: OrganizationType) => (
        <div className="w-full flex justify-center items-center">
          <Switch
            disabled={disabled}
            checked={isActive}
            onChange={() => changeOrgVisibility(record?.id, !isActive)}
          />
        </div>
      ),
    },
    {
      title: "Premium",
      dataIndex: "plan",
      key: "plan",
      render: (plan: OrganizationPlans, record: OrganizationType) => {
        const isPremium = plan === Premium;
        const newPlan = isPremium ? Standard : Premium;
        return (
          <div className="w-full flex justify-center items-center">
            <Switch
              disabled={disabled}
              checked={isPremium}
              onChange={() => changeOrgPlan(record?.id, newPlan)}
            />
          </div>
        );
      },
    },
    {
      title: "",
      key: "action",
      render: (_, record: OrganizationType) => (
        <div className="text-blue-500">
          <button
            onClick={() => console.log("Record", record)}
            disabled={disabled}
          >
            <FontAwesomeIcon icon={faTrashCan} size="xl" />
          </button>
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
        pageSize: 8,
        position: ["bottomCenter"],
        showLessItems: true,
      }}
    />
  );
};

export default CompaniesTable;
