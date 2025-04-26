import React, { useEffect, useState } from "react";
import { Modal, ModalProps, Select } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";

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
    setSocialLinks((prev) => ({
      ...prev,
      [selectedPlatform]: url.trim(),
    }));
    handleClose();
  };

  const isEditMode = Boolean(platform);
  const isDisabled = !selectedPlatform || !url.trim();

  const availablePlatforms = Object.values(SocialMediaPlatform).filter(
    (p) => isEditMode || !(p in socialLinks)
  );

  return (
    <Modal
      open={open}
      footer={null}
      closeIcon={null}
      onCancel={handleClose}
      width={600}
      {...modalProps}
    >
      <section className="text-blue-500 flex flex-col gap-10 pb-10">
        <header className="flex flex-col gap-4">
          <div className="w-full flex justify-end">
            <FontAwesomeIcon
              icon={faCircleXmark}
              size="2xl"
              className="cursor-pointer"
              onClick={handleClose}
            />
          </div>
          <h2 className="text-xl font-bold md:text-3xl">
            {isEditMode ? "Editar red social" : "Agregar red social"}
          </h2>
        </header>

        <div className="flex gap-8 items-center md:grid md:grid-cols-2 md:gap-8">
          <div className="w-full">
            {/* <label className="text-sm font-medium block mb-2">Plataforma</label> */}
            <Select
              className="w-full"
              disabled={isEditMode}
              placeholder="Selecciona una plataforma"
              value={selectedPlatform}
              onChange={(value) => setSelectedPlatform(value)}
              options={availablePlatforms.map((p) => ({
                label: PLATFORM_LABELS_MAP[p],
                value: p,
              }))}
            />
          </div>

          <TextInput
            className=""
            placeholder="URL del perfil"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="w-full col-span-2 flex justify-center">
            <Button
              variant="solid-blue"
              className="px-10"
              onClick={handleSubmit}
              disabled={isDisabled}
            >
              Guardar
            </Button>
          </div>
        </div>
      </section>
    </Modal>
  );
};

export default SocialMediaModal;
