import Button from "@/components/ui/button";
import { Modal } from "antd";
import React from "react";
import { DeleteCompanyTarget } from "../types";

interface DeleteOrgModalProps {
  target: DeleteCompanyTarget | null;
  open: boolean;
  setOpen: (open: DeleteCompanyTarget | null) => void;
  handleDeleteCompany: (target: DeleteCompanyTarget) => void;
  isDeletingOrganization: boolean;
}

const DeleteOrgModal = ({
  target,
  open,
  setOpen,
  handleDeleteCompany,
  isDeletingOrganization,
}: DeleteOrgModalProps) => {
  const handleClose = () => setOpen(null);
  const isCustomer = target?.isCustomer;

  return (
    <Modal
      footer={null}
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
    >
      <section className="flex flex-col items-center justify-center gap-12 text-blue-500 px-5 py-10">
        <h2 className="text-2xl font-bold font-arial-rounded text-center">
          {isCustomer
            ? "¿Estás seguro de que deseas eliminar esta persona natural?"
            : "¿Estás seguro de que deseas eliminar esta organización?"}
        </h2>

        <footer className="flex flex-col gap-5 w-full md:flex-row md:gap-10">
          <Button
            className="w-full"
            variant="solid-blue"
            loading={isDeletingOrganization}
            disabled={isDeletingOrganization || !target}
            onClick={() => target && handleDeleteCompany(target)}
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
