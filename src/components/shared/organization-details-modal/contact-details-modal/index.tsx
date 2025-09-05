import {
  BrokerageSocietyType,
  EntityType,
  EventType,
  ExclusiveAgentType,
  InsuranceBrokerType,
  Mutation,
  UserGroups,
  TrackingUserInputType,
  SupplierType,
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
import OrganizationSocialMediaLinks from "../organization-social-media-links";

interface ContactDetailsModalProps {
  contact: InsuranceBrokerType | BrokerageSocietyType | ExclusiveAgentType | SupplierType;
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
    console.log("🔍 Debugging tracking creation:");
    console.log("Contact ID:", contact.id);
    console.log("User:", user);

    // Verificar si hay token de autenticación
    const token = useAuthStore.getState().accessToken;
    console.log("Auth token:", token ? "Present" : "Missing");

    // Asegurar que el group siempre tenga un valor válido
    const userGroup = user?.group || UserGroups.Customer;
    console.log("User group:", userGroup);

    // Crear el objeto de usuario solo si hay datos válidos
    let formattedUser: TrackingUserInputType | null = null;
    if (user?.id || user?.name || user?.email) {
      formattedUser = pickBy(
        {
          _id: user?.id,
          name: user?.name,
          email: user?.email,
          group: userGroup,
        },
        (value) => Boolean(value)
      ) as TrackingUserInputType;
    } else {

      formattedUser = {
        group: userGroup,
      };
    }

    console.log("Formatted user:", formattedUser);

    const trackingInput = {
      entityId: contact.id,
      eventType: EventType.Click,
      entityType: EntityType.Organization,
      ...(formattedUser && { user: formattedUser }),
    };

    console.log("Tracking input:", trackingInput);

    createTracking({
      variables: {
        input: trackingInput,
      },
    })
      .then((result) => {
        console.log("✅ Tracking created successfully:", result);
      })
      .catch((error) => {
        console.error(" Error creating tracking:", error);
        console.error("Error details:", error.graphQLErrors);
        console.error("Network error:", error.networkError);
      });
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

  const socialMediaLinks = contact?.socialMediaLinks || ('contact' in contact && 'links' in contact.contact ? contact.contact.links : []) || [];

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
        {/* Redes sociales */}
        {socialMediaLinks.length > 0 && (
          <div className="w-full mt-4">
            <h4 className="text-base font-semibold mb-2 text-center">Redes sociales</h4>
            <OrganizationSocialMediaLinks socialMediaLinks={socialMediaLinks} />
          </div>
        )}
      </section>
    </Modal>
  );
};

export default ContactDetailsModal;
