import React, { useMemo, useState, useEffect, useRef } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import {
  OrganizationOfficeInputType,
  OrganizationOfficeType,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { useLocalStorage } from "@uidotdev/usehooks";
import LocalOfficeModal from "./office-modal";
import { useQuery } from "@apollo/client";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries";
import clsx from "clsx";

interface LocalOfficesInputProps {
  offices?: OrganizationOfficeInputType[];
  error?: boolean;
  disabled?: boolean;
}

const LocalOfficesInput = ({
  offices,
  disabled,
  error = false,
}: LocalOfficesInputProps) => {

  const [localOffices, setLocalOffices] = useLocalStorage<OrganizationOfficeInputType[]>(
    "sektor-local-offices",
    []
  );

  const { data: countryDataResponse, loading: isLoadingCountryData } =
    useQuery<Query>(COUNTRY_BY_CODE_QUERY, { variables: { code: "VE" } });

  const prevOfficesRef = useRef<OrganizationOfficeInputType[] | undefined>(undefined);

  useEffect(() => {
    if (offices === undefined) {
      return;
    }

    const normalizeOffice = (office: OrganizationOfficeInputType) => ({
      id: office?.id || "",
      phone: office?.phone || "",
      photoUrl: office?.photoUrl || undefined,
      schedule: office?.schedule || [],
      address: {
        cityId: office?.address?.cityId || 0,
        countryId: office?.address?.countryId || 1,
        stateId: office?.address?.stateId || 0,
        street: office?.address?.street || "",
      },
    });

    const normalizeOffices = (officesList: OrganizationOfficeInputType[]) => {
      return officesList
        .map(normalizeOffice)
        .filter((office, index, self) => {
          return index === self.findIndex((o) => o.id === office.id && o.id !== "");
        });
    };

    const propOffices = offices || [];
    const currentOffices = localOffices || [];

    const prevOffices = prevOfficesRef.current || [];
    const normalizedPrev = normalizeOffices(prevOffices);
    const normalizedProp = normalizeOffices(propOffices);
    const normalizedCurrent = normalizeOffices(currentOffices);

    const propsChanged =
      normalizedPrev.length !== normalizedProp.length ||
      normalizedPrev.some((prevOffice) => {
        return !normalizedProp.some(
          (propOffice) =>
            propOffice.id === prevOffice.id &&
            propOffice.id !== "" &&
            JSON.stringify(propOffice) === JSON.stringify(prevOffice)
        );
      });

    const areDifferent =
      normalizedProp.length !== normalizedCurrent.length ||
      normalizedProp.some((propOffice) => {
        return !normalizedCurrent.some(
          (currentOffice) =>
            currentOffice.id === propOffice.id &&
            currentOffice.id !== "" &&
            JSON.stringify(currentOffice) === JSON.stringify(propOffice)
        );
      });

    if (propsChanged && areDifferent) {
      if (propOffices.length > 0) {
        const uniqueOffices = propOffices.filter((office, index, self) => {
          const officeId = office?.id || "";
          return officeId === "" || index === self.findIndex((o) => (o?.id || "") === officeId);
        });
        setLocalOffices(uniqueOffices);
      } else {
        setLocalOffices([]);
      }
    }

    prevOfficesRef.current = offices;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offices, setLocalOffices]);

  const localOfficeOptions = useMemo(
    () => {
      const officesArray = Array.isArray(localOffices) ? localOffices : [];
      const countryStates = countryDataResponse?.getCountryByCode?.states || [];
      return officesArray.map((office) => {
        const { stateId = "", street = "" } = office?.address || {};
        const state =
          countryStates?.find((state) => state?.id === stateId)?.name || "";
        const label = `${street}, ${state}`;

        return {
          label,
          value: office?.id || "",
          data: office,
        };
      });
    },
    [localOffices, countryDataResponse]
  );

  const [openOfficeModal, setOpenOfficeModal] = useState(false);
  const [officeToEdit, setOfficeToEdit] =
    useState<OrganizationOfficeInputType | null>(null);

  return (
    <>
      <div
        className={clsx(
          "w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4",
          error && "border-red-500"
        )}
      >
        <span className="text-sm">Oficinas</span>
        <Select
          className="w-full absolute inset-0 h-full opacity-0"
          suffixIcon={null}
          size="large"
          disabled={disabled || isLoadingCountryData}
          value={null}
          options={localOfficeOptions}
          notFoundContent="No hay oficinas"
          optionRender={(option) => {
            return (
              <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
                <span className="truncate">{option?.data?.label}</span>
                <FontAwesomeIcon
                  className="ml-auto cursor-pointer"
                  icon={faPen}
                  size="lg"
                  title="Editar"
                  onClick={() => {
                    setOfficeToEdit(option?.data?.data);
                    setOpenOfficeModal(true);
                  }}
                />
                <FontAwesomeIcon
                  className="ml-2 cursor-pointer text-red-500"
                  icon={faTrashCan}
                  size="lg"
                  title="Eliminar"
                  onClick={() => {
                    const officesArray = Array.isArray(localOffices) ? localOffices : [];
                    const updatedOffices = officesArray.filter(
                      (office) => office?.id !== option?.data?.value
                    );
                    setLocalOffices(updatedOffices);
                  }}
                />
              </div>
            );
          }}
        />
        <div className="flex items-center justify-center gap-3 h-full w-fit bg-white z-10">
          <FontAwesomeIcon
            icon={faPlus}
            size="xl"
            onClick={() => {
              setOfficeToEdit(null);
              setOpenOfficeModal(true);
            }}
          />
        </div>
      </div>
      <LocalOfficeModal
        open={openOfficeModal}
        officeToEdit={officeToEdit}
        setLocalOffices={setLocalOffices}
        setOpenOfficeModal={setOpenOfficeModal}
        localOffices={localOffices as unknown as OrganizationOfficeType[]}
      />
    </>
  );
};

export default LocalOfficesInput;
