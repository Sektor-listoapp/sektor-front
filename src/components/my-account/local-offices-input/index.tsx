import React, { useMemo, useState } from "react";
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

interface LocalOfficesInputProps {
  offices: OrganizationOfficeInputType[];
  disabled?: boolean;
}

const LocalOfficesInput = ({ offices, disabled }: LocalOfficesInputProps) => {
  const [localOffices, setLocalOffices] = useLocalStorage(
    "sektor-local-offices",
    offices ?? []
  );
  const { data: countryDataResponse, loading: isLoadingCountryData } =
    useQuery<Query>(COUNTRY_BY_CODE_QUERY, { variables: { code: "VE" } });

  const countryStates = countryDataResponse?.getCountryByCode?.states || [];

  React.useEffect(() => {
    if (offices) {
      setLocalOffices(offices);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offices]);

  console.log("localOffices", { localOffices, offices });

  const localOfficeOptions = useMemo(
    () =>
      localOffices.map((office) => {
        const { stateId = "", street = "" } = office?.address || {};
        const state =
          countryStates?.find((state) => state?.id === stateId)?.name || "";
        const label = `${street}, ${state}`;

        return {
          label,
          value: office?.id || "",
          data: office,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localOffices]
  );

  const [openOfficeModal, setOpenOfficeModal] = useState(false);
  const [officeToEdit, setOfficeToEdit] =
    useState<OrganizationOfficeInputType | null>(null);

  return (
    <>
      <div className="w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4">
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
                {option?.data?.label}
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
                    const updatedOffices = localOffices?.filter(
                      (client) => client?.id !== option?.data?.value
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
