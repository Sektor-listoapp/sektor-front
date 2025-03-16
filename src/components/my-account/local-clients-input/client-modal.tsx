import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import UploadInput from "@/components/ui/upload-input";
import { OrganizationClientType } from "@/lib/sektor-api/__generated__/types";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, ModalProps } from "antd";
import { ObjectId } from "bson";

interface ClientModalProps extends ModalProps {
  clientToEdit?: OrganizationClientType | null;
  setOpenAddClientModal: (value: React.SetStateAction<boolean>) => void;
  localClients: OrganizationClientType[];
  setLocalClients: React.Dispatch<
    React.SetStateAction<OrganizationClientType[]>
  >;
}

const LocalClientModal = ({
  setOpenAddClientModal,
  localClients,
  setLocalClients,
  clientToEdit,
  ...modalProps
}: ClientModalProps) => {
  const isEditing = Boolean(clientToEdit?.id);
  const [input, setInput] = useState({
    name: clientToEdit?.name || "",
    logoUrl: clientToEdit?.logoUrl || " ",
  });

  useEffect(() => {
    if (clientToEdit?.id) {
      setInput({
        name: clientToEdit?.name || "",
        logoUrl: clientToEdit?.logoUrl || " ",
      });
    }
  }, [clientToEdit]);

  const handleClose = () => {
    setInput({ name: "", logoUrl: " " });
    setOpenAddClientModal(false);
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
    if (clientToEdit?.id) {
      const updatedClients = localClients.map((client) =>
        client.id === clientToEdit?.id ? { ...client, ...input } : client
      );
      setLocalClients(updatedClients);
    }
    handleClose();
  };

  const handleSubmit = () => {
    if (isEditing) {
      handleEdit();
      return;
    }

    setLocalClients([
      ...localClients,
      {
        id: new ObjectId() as unknown as string,
        name: input?.name,
        logoUrl: input?.logoUrl,
      },
    ]);
    handleClose();
  };

  return (
    <Modal
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
            {isEditing ? "Editar cliente" : "Agregar cliente"}
          </h2>
        </header>
        <div className="flex flex-col gap-8 items-center">
          <TextInput
            name="name"
            placeholder="Nombre"
            value={input?.name}
            required
            onChange={(e) => handleInputChange("name", e?.target?.value)}
          />

          <UploadInput
            imageUrl={input?.logoUrl || " "}
            onImageChange={(url: string) => handleInputChange("logoUrl", url)}
          />

          <Button
            variant="solid-blue"
            onClick={handleSubmit}
            className="w-fit px-10"
            disabled={!input?.name?.trim() || !input?.logoUrl}
          >
            Guardar
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default LocalClientModal;
