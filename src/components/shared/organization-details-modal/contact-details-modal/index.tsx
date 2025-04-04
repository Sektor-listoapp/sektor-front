import {
  BrokerageSocietyType,
  ExclusiveAgentType,
  InsuranceBrokerType,
} from "@/lib/sektor-api/__generated__/types";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import React from "react";

interface ContactDetailsModalProps {
  contact: InsuranceBrokerType | BrokerageSocietyType | ExclusiveAgentType;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactDetailsModal = ({
  open,
  setOpen,
  contact,
}: ContactDetailsModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      footer={null}
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      className="!w-fit"
      centered
      closeIcon={
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-blue-500"
          size="lg"
        />
      }
    >
      <section className="flex flex-col items-center justify-center gap-5 text-blue-500 p-5 px-16 font-century-gothic w-full">
        <h3 className="text-center font-bold">Datos de contacto</h3>

        <div className="flex flex-col gap-4 w-full items-start text-lg">
          <div className="flex gap-2 w-full items-center justify-start">
            <span>Teléfono:</span>
            <b>{"phone" in contact ? contact?.phone : "No disponible"}</b>
          </div>
          <div className="flex gap-2 w-full items-center justify-start">
            <span>Correo:</span>
            <b className="font-bold">
              {"email" in contact
                ? (contact?.email as string)
                : "No disponible"}
            </b>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default ContactDetailsModal;
