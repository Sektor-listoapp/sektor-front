import React from "react";
import {
  OrganizationPlans,
  OrganizationType,
  StateType,
} from "@/lib/sektor-api/__generated__/types";
import { Collapse } from "antd";
import styles from "./index.module.css";
import { cn } from "@/utils/class-name";
import { faChevronDown, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Switch from "@/components/ui/switch";
import { ORGANIZATION_TYPE_SELECT_OPTIONS } from "@/constants/forms";
import dayjs from "dayjs";

const { Panel } = Collapse;

interface CompaniesAccordionProps {
  data: OrganizationType[];
  disabled: boolean;
  countryStates: StateType[];
  changeOrgVisibility: (id: string, isACtive: boolean) => void;
  changeOrgPlan: (id: string, plan: OrganizationPlans) => void;
}

const { Premium, Standard } = OrganizationPlans;

const CompaniesAccordion = ({
  data,
  disabled,
  countryStates,
  changeOrgPlan,
  changeOrgVisibility,
}: CompaniesAccordionProps) => {
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
      {data?.map(
        (
          {
            id,
            coverageStates,
            createdAt,
            isActive,
            name,
            plan,
            type,
            clicks,
            email,
          },
          index
        ) => {
          const label = ORGANIZATION_TYPE_SELECT_OPTIONS?.find(
            (option) => option.value === type
          )?.label;
          const isPremium = plan === Premium;
          const newPlan = isPremium ? Standard : Premium;
          const state = countryStates?.find(
            (state) => state?.id === coverageStates?.[0]
          )?.name;

          const listItems = [
            { title: "Tipo de usuario:", value: label ?? "No disponible" },
            {
              title: "Fecha de creación:",
              value: createdAt
                ? dayjs(createdAt)?.format("DD/MM/YYYY")
                : "No disponible",
            },
            { title: "Email:", value: email ?? "No disponible" },
            { title: "Ubicaciòn:", value: state ?? "No disponible" },
            { title: "Clicks:", value: clicks ? clicks : 0 },
          ];

          return (
            <Panel header={name} key={`${id}-${index}`}>
              <section className="w-full flex flex-col items-center justify-center gap-4 bg-gray-300 rounded-xl p-5 text-blue-500 text-sm sm:text-base">
                <ul className="w-full flex flex-col items-start justify-start gap-3">
                  {listItems?.map(({ title, value }, index) => (
                    <li
                      key={index}
                      className="w-full flex items-start justify-start gap-1"
                    >
                      <span className="font-bold">{title}</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>

                <footer className="w-full flex items-center gap-1 justify-evenly font-bold">
                  <button
                    className="w-fit flex flex-col items-center justify-center gap-3"
                    onClick={() => changeOrgVisibility(id, !isActive)}
                    disabled={disabled}
                  >
                    <span>Activo</span>
                    <Switch checked={isActive} />
                  </button>

                  <button
                    className="w-fit flex flex-col items-center justify-center gap-3"
                    onClick={() => changeOrgPlan(id, newPlan)}
                    disabled={disabled}
                  >
                    <span>Premiun</span>
                    <Switch checked={isPremium} />
                  </button>

                  <button
                    className="w-fit flex flex-col items-center justify-center gap-3"
                    onClick={() => console.log("Delete company", { id, name })}
                  >
                    <span>Eliminar</span>
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size="xl"
                      className="text-blue-500"
                    />
                  </button>
                </footer>
              </section>
            </Panel>
          );
        }
      )}
    </Collapse>
  );
};

export default CompaniesAccordion;
