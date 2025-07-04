import React, { useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { SocialMediaLinkType } from "@/lib/sektor-api/__generated__/types";
import { useLocalStorage } from "@uidotdev/usehooks";
import LocalContactModal from "./contact-modal";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";
import { cn } from "@/utils/class-name";

interface LocalContactInputProps {
  links: SocialMediaLinkType[];
  setHasLocalContact: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}

const LocalContactInput = ({
  links,
  disabled,
  setHasLocalContact,
}: LocalContactInputProps) => {
  const [localContact, setLocalContact] = useLocalStorage(
    "sektor-local-contact",
    {}
  );

  React.useEffect(() => {
    if (links && Array.isArray(links) && links.length > 0) {
      const linksMap = {};
      links.forEach(({ url, platform }) => {
        linksMap[platform] = url;
      });
      setLocalContact({ ...linksMap });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links]);

  const localContactOptions = Object.entries(localContact)?.map(
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

  React.useEffect(() => {
    setHasLocalContact(Object?.keys(localContact)?.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localContact]);

  const [openContactModal, setOpenContactModal] = useState(false);

  return (
    <>
      <div
        className={cn(
          "w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4",
          {
            "border-red-500": Object?.keys(localContact)?.length === 0,
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
                    const newLocalContact = { ...localContact };
                    delete newLocalContact[option?.data?.data?.value];
                    setLocalContact(newLocalContact);
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
        localContact={localContact}
        setLocalContact={setLocalContact}
        setOpenContactModal={setOpenContactModal}
      />
    </>
  );
};

export default LocalContactInput;
