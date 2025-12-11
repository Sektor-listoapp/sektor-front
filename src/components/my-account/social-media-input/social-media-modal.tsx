import React, { useEffect, useState } from "react";
import { Modal, ModalProps } from "antd";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import Select from "@/components/ui/select";
import { SocialMediaPlatform, SocialMediaLinkType } from "@/lib/sektor-api/__generated__/types";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";

interface SocialMediaModalProps extends ModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  platform: string | null;
  socialLinks: SocialMediaLinkType[];
  setSocialLinks: React.Dispatch<React.SetStateAction<SocialMediaLinkType[]>>;
}

const SocialMediaModal = ({
  open,
  setOpen,
  platform,
  socialLinks,
  setSocialLinks,
  ...modalProps
}: SocialMediaModalProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(platform || "");
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (platform) {
      setSelectedPlatform(platform);
      const existingLink = socialLinks.find(link => link.platform === platform);
      setUrl(existingLink?.url || "");
    } else {
      setSelectedPlatform("");
      setUrl("");
    }
  }, [platform, socialLinks]);

  const handleClose = () => {
    setSelectedPlatform("");
    setUrl("");
    setOpen(false);
  };

  const buildSocialMediaUrl = (platform: string, inputUrl: string): string => {
    const trimmedUrl = inputUrl.trim();

    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }

    const platformUrls: Record<string, string> = {
      [SocialMediaPlatform.Facebook]: 'https://www.facebook.com/',
      [SocialMediaPlatform.Instagram]: 'https://www.instagram.com/',
      [SocialMediaPlatform.Twitter]: 'https://www.twitter.com/',
    };

    const baseUrl = platformUrls[platform] || 'https://';


    if (trimmedUrl.includes('.com/') || trimmedUrl.includes('.com')) {
      return trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`;
    }


    return `${baseUrl}${trimmedUrl}`;
  };

  const handleSubmit = () => {
    if (!selectedPlatform || !url.trim()) return;

    const newLink = {
      platform: selectedPlatform,
      url: buildSocialMediaUrl(selectedPlatform, url),
    };

    let updatedLinks;
    if (platform) {
      updatedLinks = socialLinks.map(link =>
        link.platform === platform
          ? newLink
          : link
      );
    } else {
      updatedLinks = [...socialLinks, newLink];
    }

    setSocialLinks(updatedLinks);
    handleClose();
  };

  const isEditMode = Boolean(platform);
  const isDisabled = !selectedPlatform || !url.trim();

  const availablePlatforms = Object.values(SocialMediaPlatform).filter(
    (p) => isEditMode || !socialLinks.some(link => link.platform === p)
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
          <Select
            className="w-full"
            disabled={isEditMode}
            wrapperClassName="w-full"
            options={[
              { label: "Elige una opción", value: "", disabled: true, hidden: false },
              ...platformsOptions
            ]}
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
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
