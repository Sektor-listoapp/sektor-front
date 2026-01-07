import React, { useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { BrokerageSocietyTeamMemberType } from "@/lib/sektor-api/__generated__/types";
import LocalWorkTeamModal from "./work-team-modal";
import Image from "next/image";

interface RecognitionsInputProps {
  workTeam?: BrokerageSocietyTeamMemberType[];
  onWorkTeamChange?: (workTeam: BrokerageSocietyTeamMemberType[]) => void;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[];
}

const LocalWorkTeamInput = ({
  workTeam = [],
  onWorkTeamChange,
  disabled,
  options,
}: RecognitionsInputProps) => {

  const [openWorkTeamModal, setOpenWorkTeamModal] = useState(false);
  const [teamMemberToEdit, setTeamMemberToEdit] = useState<
    BrokerageSocietyTeamMemberType | null | undefined
  >(null);

  const localWorkTeamOptions = workTeam.map((teamMember) => {
    const memberData = options?.find(
      (option) => option?.value === teamMember?.id
    );
    return memberData || {};
  });

  return (
    <>
      <div className="w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4">
        <span className="text-sm">Equipo de trabajo</span>
        <Select
          className="w-full absolute inset-0 h-full opacity-0"
          suffixIcon={null}
          size="large"
          disabled={disabled}
          value={null}
          options={localWorkTeamOptions}
          notFoundContent="No hay miembros en el equipo de trabajo"
          optionRender={(option) => (
            <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
              {option.data.image && (
                <Image
                  src={option.data?.image}
                  alt={option.data?.label}
                  width={30}
                  height={30}
                  className="rounded-full"
                />
              )}
              {option.data.label}
              <FontAwesomeIcon
                className="ml-auto cursor-pointer"
                icon={faPen}
                size="lg"
                title="Editar"
                onClick={() => {
                  const memberData = workTeam.find(
                    (teamMember) => teamMember.id === option.data.value
                  );
                  setTeamMemberToEdit(memberData);
                  setOpenWorkTeamModal(true);
                }}
              />
              <FontAwesomeIcon
                className="ml-2 cursor-pointer text-red-500"
                icon={faTrashCan}
                size="lg"
                title="Eliminar"
                onClick={() => {
                  if (onWorkTeamChange) {
                    const updatedWorkTeam = workTeam.filter(
                      (member) => member.id !== option.data.value
                    );
                    onWorkTeamChange(updatedWorkTeam);
                  }
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
              setTeamMemberToEdit(null);
              setOpenWorkTeamModal(true);
            }}
          />
        </div>
      </div>
      <LocalWorkTeamModal
        options={options ?? []}
        open={openWorkTeamModal}
        setOpenWorkTeamModal={setOpenWorkTeamModal}
        workTeam={workTeam}
        onWorkTeamChange={onWorkTeamChange}
        teamMemberToEdit={teamMemberToEdit ?? undefined}
      />
    </>
  );
};

export default LocalWorkTeamInput;
