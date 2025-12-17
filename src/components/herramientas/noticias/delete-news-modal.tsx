import React from "react";
import { Modal } from "antd";
import Button from "@/components/ui/button";

interface DeleteNewsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const DeleteNewsModal: React.FC<DeleteNewsModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closable={false}
      className="!w-11/12 !max-w-md"
    >
      <div className="flex flex-col items-center gap-6 py-4 font-century-gothic">
        <h2 className="text-xl font-bold text-blue-500 text-center">
          ¿Seguro que quieres<br />eliminar esta noticia?
        </h2>
        
        <p className="text-gray-500 text-sm text-center">
          Al eliminarla ya no saldrá en la sección de noticias y
          desaparecerá del sistema
        </p>

        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="solid-blue"
            className="!bg-red-500 hover:!bg-red-600 !px-8"
            onClick={onConfirm}
            loading={loading}
          >
            Eliminar
          </Button>
          <Button
            variant="outline"
            className="!px-8"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteNewsModal;

