import {
  BrokerageSocietyType,
  EntityType,
  EventType,
  ExclusiveAgentType,
  InsuranceBrokerType,
  Mutation,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import { CREATE_TRACKING } from "@/lib/sektor-api/mutations";
import { useAuthStore } from "@/store/auth";
import { useMutation } from "@apollo/client";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import { pickBy } from "lodash";
import React, { useEffect } from "react";
import { useShallow } from "zustand/shallow";

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

  const [createTracking] = useMutation<Mutation>(CREATE_TRACKING);

  const user = useAuthStore(useShallow((state) => state?.user));

  const handleCreateTracking = () => {
    const formattedUser = pickBy(
      {
        _id: user?.id,
        name: user?.name,
        email: user?.email,
        group: user?.group || UserGroups.Customer,
      },
      (value) => Boolean(value)
    );
    createTracking({
      variables: {
        input: {
          entityId: contact.id,
          eventType: EventType.Click,
          entityType: EntityType.Organization,
          user: formattedUser,
        },
      },
    })
      .then(() => {})
      .catch((error) => console.log("Error creating tracking:", error));
  };

  useEffect(() => {
    if (open) {
      handleCreateTracking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // @ts-expect-error Unknown type
  const email = contact?.email || contact?.contact?.email || null;
  // @ts-expect-error Unknown type
  const phone = contact?.phone || contact?.contact?.phone || null;

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
      <section className="flex flex-col items-center justify-center gap-5 text-blue-500 p-5 font-century-gothic w-full">
        <h3 className="text-center font-bold">Datos de contacto</h3>

        <div className="flex flex-col gap-4 w-full items-start text-lg">
          <div className="flex gap-2 w-full items-center justify-start">
            <span>Teléfono:</span>
            <b>{phone ? phone : "No disponible"}</b>
          </div>
          <div className="flex gap-2 w-full items-center justify-start">
            <span>Correo:</span>
            <b className="font-bold truncate">
              {email ? (email as string) : "No disponible"}
            </b>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default ContactDetailsModal;
