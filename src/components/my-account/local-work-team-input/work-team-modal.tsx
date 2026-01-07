/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { BrokerageSocietyTeamMemberType } from "@/lib/sektor-api/__generated__/types";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalProps } from "antd";
import Select from "@/components/ui/select";

interface LocalWorkTeamModalProps extends ModalProps {
  open: boolean;
  teamMemberToEdit?: BrokerageSocietyTeamMemberType | undefined;
  setOpenWorkTeamModal: (value: React.SetStateAction<boolean>) => void;
  workTeam?: BrokerageSocietyTeamMemberType[];
  onWorkTeamChange?: (workTeam: BrokerageSocietyTeamMemberType[]) => void;
  options: any[];
}

const LocalWorkTeamModal = ({
  open,
  setOpenWorkTeamModal,
  workTeam = [],
  onWorkTeamChange,
  teamMemberToEdit,
  options,
  ...modalProps
}: LocalWorkTeamModalProps) => {
  const isEditing = Boolean(teamMemberToEdit?.id);
  const [input, setInput] = useState({
    id: "",
    organization: "",
    position: "",
  });

  useEffect(() => {
    if (teamMemberToEdit?.id) {
      const organizationId = typeof teamMemberToEdit?.organization === 'string'
        ? teamMemberToEdit.organization
        : (teamMemberToEdit?.organization?.id || "");

      setInput({
        id: teamMemberToEdit?.id || "",
        organization: organizationId,
        position: teamMemberToEdit?.position || "",
      });
    } else {
      setInput({
        id: "",
        organization: "",
        position: "",
      });
    }
  }, [teamMemberToEdit]);

  const handleClose = () => {
    setInput({
      id: "",
      organization: "",
      position: "",
    });
    setOpenWorkTeamModal(false);
  };

  const handleInputChange = (
    field: keyof typeof input,
    value: string | string[] | React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (field in input) {
      setInput((prev) => ({
        ...prev,
        [field]: value || "",
      }));
    }
  };

  const handleEdit = () => {
    if (teamMemberToEdit?.id && onWorkTeamChange) {
      const updatedTeamMember = workTeam?.map((teamMember) =>
        teamMember?.id === teamMemberToEdit?.id
          ? {
            ...teamMember,
            organization: teamMemberToEdit?.organization,
            position: input.position
          }
          : teamMember
      );
      onWorkTeamChange(updatedTeamMember);
    }
    handleClose();
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEdit();
      return;
    }

    if (!onWorkTeamChange) return;

    const organizationId = input?.id || input?.organization || "";

    const newTeamMember: BrokerageSocietyTeamMemberType = {
      id: input?.id,
      organization: organizationId,
      position: input?.position,
    } as unknown as BrokerageSocietyTeamMemberType;

    const existingIndex = workTeam.findIndex(member => {
      const memberOrgId = typeof member.organization === 'string'
        ? member.organization
        : member.organization?.id;

      return member.id === newTeamMember.id ||
        (memberOrgId === organizationId && member.position === newTeamMember.position);
    });

    if (existingIndex !== -1) {
      const updatedTeam = workTeam.map((member, index) =>
        index === existingIndex ? newTeamMember : member
      );
      onWorkTeamChange(updatedTeam);
    } else {
      onWorkTeamChange([...workTeam, newTeamMember]);
    }

    handleClose();
  };

  const hasEmptyFields = !input?.position || !input?.organization;

  return (
    <Modal
      open={open}
      closeIcon={null}
      footer={null}
      onClose={handleClose}
      onCancel={handleClose}
      {...modalProps}
    >
      <section className="text-blue-500 flex flex-col gap-10 pb-10">
        <header className="flex flex-col gap-4">
          <div className="w-full flex justify-end">
            <FontAwesomeIcon
              icon={faCircleXmark}
              size="2xl"
              className="cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <h2 className="text-xl font-bold md:text-3xl">
            {isEditing
              ? "Editar miembro del equipo"
              : "Agregar miembro al equipo"}
          </h2>
        </header>
        <div
          className="flex flex-col gap-8 items-center"
          onSubmit={handleSubmit}
        >
          <Select
            value={input?.id}
            options={options}
            disabled={isEditing}
            onChange={(e) => {
              const newValue = e.target?.value;
              setInput((prev) => ({
                ...prev,
                id: newValue,
                organization: newValue,
              }));
            }}
          />

          <TextInput
            name="position"
            placeholder="Cargo en la organización"
            value={input?.position}
            required
            onChange={(e) => handleInputChange("position", e?.target?.value)}
          />

          <Button
            variant="solid-blue"
            onClick={handleSubmit}
            className="w-fit px-10"
            disabled={hasEmptyFields}
          >
            Guardar
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default LocalWorkTeamModal;
