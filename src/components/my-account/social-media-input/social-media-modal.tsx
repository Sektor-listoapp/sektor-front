import React, { useEffect, useState } from "react";
import { Modal, ModalProps, Space } from "antd";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import SelectMultiple from "@/components/ui/select-multiple";
import { SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";
import { pickBy } from "lodash";

interface SocialMediaModalProps extends ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  platform: string | null;
  socialLinks: Record<string, string>;
  setSocialLinks: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const SocialMediaModal = ({
  open,
  setOpen,
  platform,
  socialLinks,
  setSocialLinks,
  ...modalProps
}: SocialMediaModalProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>(platform ?? undefined);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    setSelectedPlatform(platform ?? undefined);
    setUrl(platform && socialLinks?.[platform] ? socialLinks[platform] : "");
  }, [platform, socialLinks]);

  const handleClose = () => {
    setSelectedPlatform(undefined);
    setUrl("");
    setOpen(false);
  };

  const handleSubmit = () => {
    if (!selectedPlatform || !url.trim()) return;
  
   
    const updatedLinks = {
      ...socialLinks,
      [selectedPlatform]: url.trim(),
    };
  

    const cleanedLinks = pickBy(updatedLinks, (value) => Boolean(value));
  
    setSocialLinks(cleanedLinks);
    handleClose();
  };
  const isEditMode = Boolean(platform);
  const isDisabled = !selectedPlatform || !url.trim();

  const availablePlatforms = Object.values(SocialMediaPlatform).filter(
    (p) => isEditMode || !(p in socialLinks)
  );

  const allowedPlatforms = [
    SocialMediaPlatform.Facebook,
    SocialMediaPlatform.Instagram,
    SocialMediaPlatform.Twitter,
  ];
  
  const platformsOptions = availablePlatforms
    .filter((p) => allowedPlatforms.includes(p))
    .map((p) => ({
      label: PLATFORM_LABELS_MAP[p],
      value: p,
      data: {
        label: PLATFORM_LABELS_MAP[p],
      },
    }));

 

  return (
    <Modal
      open={open}
      footer={null}
      closeIcon={null}
      onCancel={handleClose}
      width={600}
      className="!w-11/12 md:!w-3/4 lg:!w-11/12 !max-w-[843px]"
      bodyStyle={{
        padding: "3rem 2rem",
        borderRadius: "1.5rem",
      }}
      {...modalProps}
    >
      <section className="text-[#11284B] flex flex-col gap-10">
        <header className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-start">
            {isEditMode ? "Editar red social" : "Añadir tus redes sociales"}
          </h2>
        </header>

        <div className="flex flex-col md:flex-row gap-6">
          <SelectMultiple
            label="Plataforma"
            showFloatingLabel
            wrapperClassName="w-full"
            selectProps={{
              disabled: isEditMode,
              placeholder: "Elige la red social (puedes elegir mas de 1)",
              options: platformsOptions,
              value: selectedPlatform,
              notFoundContent: "No hay plataformas disponibles",
              onChange: (value) => setSelectedPlatform(value),
              optionRender: (option) => (
                <Space>
                  {option?.data?.label}
                </Space>
              ),
            }}
          />

          <TextInput

            className="w-full h-[45px]"
            placeholder="Escribe el nombre aqui"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="w-full flex justify-center">
          <Button
            variant="solid-blue"
            className="rounded-full px-10 py-2 text-lg font-semibold"
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            Guardar
          </Button>
        </div>
      </section>
    </Modal>
  );
};

export default SocialMediaModal;
