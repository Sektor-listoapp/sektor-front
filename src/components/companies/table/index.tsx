import React from "react";
import {
  OrganizationPlans,
  OrganizationTypes,
  StateType,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "antd";
import { ADMIN_USER_TYPE_SELECT_OPTIONS } from "@/constants/forms";
import Switch from "@/components/ui/switch";
import styles from "./index.module.css";
import { cn } from "@/utils/class-name";
import { ColumnProps } from "antd/es/table";
import dayjs from "dayjs";
import Link from "next/link";
import { AdminCompanyListItem, DeleteCompanyTarget } from "../types";

interface CompaniesTableProps {
  data: AdminCompanyListItem[];
  disabled: boolean;
  changeOrgVisibility: (id: string, isACtive: boolean) => void;
  changeOrgPlan: (id: string, plan: OrganizationPlans) => void;
  countryStates: StateType[];
  setOpenDeleteModal: React.Dispatch<
    React.SetStateAction<DeleteCompanyTarget | null>
  >;
}

const { Premium, Standard } = OrganizationPlans;

const CompaniesTable = ({
  data,
  disabled,
  changeOrgPlan,
  changeOrgVisibility,
  countryStates,
  setOpenDeleteModal,
}: CompaniesTableProps) => {
  const columns: ColumnProps<AdminCompanyListItem>[] = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: AdminCompanyListItem) => {
        const { id } = record;

        return (
          <Link
            href={`/account/${id}`}
            className="cursor-pointer hover:text-blue-700 transition-all leading-snug break-words"
          >
            {name}
          </Link>
        );
      },
    },
    {
      title: "Tipo de usuario",
      dataIndex: "type",
      key: "type",
      width: 160,
      render: (type: OrganizationTypes | UserGroups.Customer) => {
        const label = ADMIN_USER_TYPE_SELECT_OPTIONS.find(
          (option) => option.value === type
        )?.label;
        return <p>{label}</p>;
      },
    },
    {
      title: "Clicks",
      dataIndex: "clicks",
      key: "clicks",
      width: 80,
      align: "center",
      render: (clicks: number | undefined, record: AdminCompanyListItem) => {
        if (record.isCustomer) {
          return <p>—</p>;
        }

        return <p>{clicks ? clicks : 0}</p>;
      },
    },
    {
      title: "Fecha de creación",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      align: "center",
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
      width: 200,
      ellipsis: true,
      align: "center",
      render: (email: string | undefined) => (
        <span
          className="block overflow-hidden whitespace-nowrap text-ellipsis"
          title={email ?? "No disponible"}
        >
          {email ? email : "No disponible"}
        </span>
      ),
    },
    {
      title: "Ubicación",
      dataIndex: "coverageStates",
      key: "coverageStates",
      width: 130,
      align: "center",
      render: (
        coverageStates: number[] | undefined,
        record: AdminCompanyListItem
      ) => {
        if (record.isCustomer) {
          return <span>—</span>;
        }

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
      width: 80,
      align: "center",
      render: (isActive: boolean, record: AdminCompanyListItem) => (
        <div className="w-full flex justify-center items-center">
          {record.isCustomer ? (
            <span>{isActive ? "Sí" : "No"}</span>
          ) : (
            <Switch
              disabled={disabled}
              checked={isActive}
              onChange={() => changeOrgVisibility(record?.id, !isActive)}
            />
          )}
        </div>
      ),
    },
    {
      title: "Premium",
      dataIndex: "plan",
      key: "plan",
      width: 90,
      align: "center",
      render: (plan: OrganizationPlans, record: AdminCompanyListItem) => {
        if (record.isCustomer) {
          return <span>—</span>;
        }

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
      width: 60,
      align: "center",
      render: (_, record: AdminCompanyListItem) => (
        <div className="text-blue-500">
          <button
            onClick={() =>
              setOpenDeleteModal({
                id: record.id,
                isCustomer: record.isCustomer,
              })
            }
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
      scroll={{ x: 1160 }}
      pagination={{
        defaultPageSize: 6,
        pageSizeOptions: [6, 10, 20, 50, 100],
        showSizeChanger: true,
        position: ["bottomCenter"],
        showLessItems: true,
      }}
    />
  );
};

export default CompaniesTable;
