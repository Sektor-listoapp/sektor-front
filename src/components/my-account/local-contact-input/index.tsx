import React, { useMemo, useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { SocialMediaLinkType } from "@/lib/sektor-api/__generated__/types";
import LocalContactModal from "./contact-modal";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";
import { cn } from "@/utils/class-name";

interface LocalContactInputProps {
  links?: SocialMediaLinkType[];
  contact?: { [platform: string]: string };
  onContactChange?: (contact: { [platform: string]: string }) => void;
  setHasLocalContact?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}

const LocalContactInput = ({
  links = [],
  contact,
  onContactChange,
  disabled,
  setHasLocalContact,
}: LocalContactInputProps) => {
  const contactData = useMemo(() => {
    if (contact) return contact;
    if (links && Array.isArray(links) && links.length > 0) {
      const linksMap: { [platform: string]: string } = {};
      links.forEach(({ url, platform }) => {
        linksMap[platform] = url;
      });
      return linksMap;
    }
    return {};
  }, [contact, links]);

  React.useEffect(() => {
    if (setHasLocalContact) {
      setHasLocalContact(Object?.keys(contactData)?.length > 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData]);

  const localContactOptions = Object.entries(contactData)?.map(
    ([key, value]) => {
      return {
        value,
        label: `${PLATFORM_LABELS_MAP[key]}: ${value}`,
        data: {
          label: `${PLATFORM_LABELS_MAP[key]}`,
          value: key,
          platform: key,
          url: value as string,
        },
      };
    }
  );

  const [openContactModal, setOpenContactModal] = useState(false);

  return (
    <>
      <div
        className={cn(
          "w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4",
          {
            "border-red-500": Object?.keys(contactData)?.length === 0,
          }
        )}
      >
        <span className="text-sm">Contacto</span>
        <Select
          className="w-full absolute inset-0 h-full opacity-0"
          suffixIcon={null}
          size="large"
          disabled={disabled}
          value={null}
          options={localContactOptions}
          notFoundContent="No hay formas de contacto"
          optionRender={(option) => {
            return (
              <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
                <div>
                  <b>{option?.data?.data?.label}: </b>
                  {option?.data?.data?.url || ""}
                </div>
                <FontAwesomeIcon
                  className="ml-auto cursor-pointer"
                  icon={faPen}
                  size="lg"
                  title="Editar"
                />
                <FontAwesomeIcon
                  className="ml-2 cursor-pointer text-red-500"
                  icon={faTrashCan}
                  size="lg"
                  title="Eliminar"
                  onClick={() => {
                    if (onContactChange) {
                      const newContact = { ...contactData };
                      delete newContact[option?.data?.data?.value];
                      onContactChange(newContact);
                    }
                  }}
                />
              </div>
            );
          }}
        />
        <div className="flex items-center justify-center gap-3 h-full w-fit bg-white z-10">
          <FontAwesomeIcon
            size="xl"
            icon={faPlus}
            onClick={() => setOpenContactModal(true)}
          />
        </div>
      </div>
      <LocalContactModal
        open={openContactModal}
        contact={contactData}
        onContactChange={onContactChange}
        setOpenContactModal={setOpenContactModal}
      />
    </>
  );
};

export default LocalContactInput;
