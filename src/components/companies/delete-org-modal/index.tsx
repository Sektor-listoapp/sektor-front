import Button from "@/components/ui/button";
import { Modal } from "antd";
import React from "react";

interface DeleteOrgModalProps {
  id: string | null;
  open: boolean;
  setOpen: (open: string | null) => void;
  handleDeleteCompany: (id: string) => void;
  isDeletingOrganization: boolean;
}

const DeleteOrgModal = ({
  id,
  open,
  setOpen,
  handleDeleteCompany,
  isDeletingOrganization,
}: DeleteOrgModalProps) => {
  const handleClose = () => setOpen(null);

  return (
    <Modal
      footer={null}
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
    >
      <section className="flex flex-col items-center justify-center gap-12 text-blue-500 px-5 py-10">
        <h2 className="text-2xl font-bold font-arial-rounded text-center">
          ¿Estás seguro de que deseas eliminar esta organización? {id}
        </h2>

        <footer className="flex flex-col gap-5 w-full md:flex-row md:gap-10">
          <Button
            className="w-full"
            variant="solid-blue"
            loading={isDeletingOrganization}
            disabled={isDeletingOrganization}
            onClick={() => handleDeleteCompany(id as string)}
          >
            Confirmar
          </Button>

          <Button
            className="w-full bg-blue-200"
            variant="soft"
            onClick={handleClose}
            disabled={isDeletingOrganization}
          >
            Cancelar
          </Button>
        </footer>
      </section>
    </Modal>
  );
};

export default DeleteOrgModal;
