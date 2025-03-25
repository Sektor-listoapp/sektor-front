import Button from "@/components/ui/button";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import React from "react";

interface ImportCompaniesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ImportCompaniesModal = ({ open, setOpen }: ImportCompaniesModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      footer={null}
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
    >
      <section className="flex flex-col items-center justify-center gap-12 text-blue-500 px-5 py-10">
        <h2 className="text-2xl font-bold font-arial-rounded">
          Subir documento excel
        </h2>

        <FontAwesomeIcon icon={faFileUpload} size="6x" />

        <footer className="flex flex-col gap-5 w-full">
          <Button
            className="w-full bg-blue-200"
            variant="soft"
            onClick={handleClose}
          >
            Subir archivo
          </Button>

          <Button
            className="w-full"
            variant="solid-blue"
            onClick={handleClose}
          >
            Descargar plantilla de ejemplo
          </Button>
        </footer>
      </section>
    </Modal>
  );
};

export default ImportCompaniesModal;
