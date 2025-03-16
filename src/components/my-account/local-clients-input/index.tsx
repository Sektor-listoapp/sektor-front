import React, { useMemo, useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { OrganizationClientType } from "@/lib/sektor-api/__generated__/types";
import { useLocalStorage } from "@uidotdev/usehooks";
import Image from "next/image";
import LocalClientModal from "./client-modal";

interface ClientsInputProps {
  clients: OrganizationClientType[];
  disabled?: boolean;
}

const LocalClientsInput = ({ clients, disabled }: ClientsInputProps) => {
  const [localClients, setLocalClients] = useLocalStorage(
    "sektor-local-clients",
    clients ?? []
  );
  const localClientsOptions = useMemo(
    () =>
      localClients.map((client) => ({
        label: client?.name || "",
        value: client?.id || "",
        image: client?.logoUrl || "",
        data: client,
      })),
    [localClients]
  );
  const [openAddClientModal, setOpenAddClientModal] = useState(false);
  const [clientToEdit, setClientToEdit] =
    useState<OrganizationClientType | null>(null);

  return (
    <>
      <div className="w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4">
        <span className="">Clientes con los que has trabajado</span>
        <Select
          className="w-full absolute inset-0 h-full opacity-0"
          suffixIcon={null}
          size="large"
          disabled={disabled}
          value={null}
          options={localClientsOptions}
          notFoundContent="No hay clientes"
          optionRender={(option) => (
            <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
              <Image
                src={option.data.image || "/images/placeholder.png"}
                alt={option.data.label || "Client logo"}
                width={40}
                height={40}
              />
              {option.data.label}
              <FontAwesomeIcon
                className="ml-auto cursor-pointer"
                icon={faPen}
                size="lg"
                title="Editar"
                onClick={() => {
                  setClientToEdit(option?.data?.data);
                  setOpenAddClientModal(true);
                }}
              />
              <FontAwesomeIcon
                className="ml-2 cursor-pointer text-red-500"
                icon={faTrashCan}
                size="lg"
                title="Eliminar"
                onClick={() => {
                  const updatedClients = localClients.filter(
                    (client) => client.id !== option.data.value
                  );
                  setLocalClients(updatedClients);
                }}
              />
            </div>
          )}
        />
        <div className="flex items-center justify-center gap-3 h-full w-fit bg-white z-10">
          <FontAwesomeIcon
            icon={faPlus}
            size="xl"
            onClick={() => {
              setClientToEdit(null);
              setOpenAddClientModal(true);
            }}
          />
        </div>
      </div>
      <LocalClientModal
        open={openAddClientModal}
        setOpenAddClientModal={setOpenAddClientModal}
        localClients={localClients}
        setLocalClients={setLocalClients}
        clientToEdit={clientToEdit}
      />
    </>
  );
};

export default LocalClientsInput;
