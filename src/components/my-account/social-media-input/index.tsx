import React, { useEffect, useMemo, useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";
import { cn } from "@/utils/class-name";
import SocialMediaModal from "./social-media-modal";
import { SocialMediaLinkType, SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";

interface SocialMediaInputProps {
    disabled?: boolean;
    setHasSocialLinks?: React.Dispatch<React.SetStateAction<boolean>>;
    socialMediaLinks?: SocialMediaLinkType[];
    onSocialLinksChange?: (links: SocialMediaLinkType[]) => void;
}

const SocialMediaInput = ({
    disabled,
    setHasSocialLinks,
    socialMediaLinks = [],
    onSocialLinksChange,
}: SocialMediaInputProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [platformToEdit, setPlatformToEdit] = useState<string | null>(null);

    useEffect(() => {
        if (setHasSocialLinks) {
            setHasSocialLinks(socialMediaLinks.length > 0);
        }
    }, [socialMediaLinks, setHasSocialLinks]);

    const options = useMemo(() => {
        const uniqueLinks = socialMediaLinks.filter((link, index, self) => {
            const normalizedUrl = link.url.toLowerCase().trim();
            return index === self.findIndex((l) =>
                l.platform === link.platform &&
                l.url.toLowerCase().trim() === normalizedUrl
            );
        });

        return uniqueLinks.map((link, index) => {
            const label = PLATFORM_LABELS_MAP[link.platform as SocialMediaPlatform] || link.platform;

            const uniqueValue = `${link.platform}-${link.url}-${index}`;
            return {
                label: `${label}: ${link.url}`,
                value: uniqueValue,
                data: {
                    label,
                    value: link.platform,
                    platform: link.platform,
                    url: link.url,
                },
            };
        });
    }, [socialMediaLinks]);

    return (
        <>
            <div
                className={cn(
                    "w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4",
                    {
                        "border-red-500": socialMediaLinks.length === 0,
                    }
                )}
            >
                <span className="text-sm">Redes Sociales</span>
                <Select
                    className="w-full absolute inset-0 h-full opacity-0"
                    suffixIcon={null}
                    size="large"
                    disabled={disabled}
                    value={null}
                    options={options}
                    notFoundContent="No hay redes agregadas"
                    optionRender={(option) => (
                        <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
                            <div>
                                <b>{option?.data?.data?.label}:</b> {option?.data?.data?.url}
                            </div>
                            <FontAwesomeIcon
                                className="ml-auto cursor-pointer"
                                icon={faPen}
                                size="lg"
                                title="Editar"
                                onClick={() => {
                                    setPlatformToEdit(option?.data?.data?.platform);
                                    setOpenModal(true);
                                }}
                            />
                            <FontAwesomeIcon
                                className="ml-2 cursor-pointer text-red-500"
                                icon={faTrashCan}
                                size="lg"
                                title="Eliminar"
                                onClick={() => {
                                    if (onSocialLinksChange) {
                                        const platformToDelete = option?.data?.data?.platform;
                                        const urlToDelete = option?.data?.data?.url;
                                        const updatedLinks = socialMediaLinks.filter(
                                            (link) => {
                                                const normalizedUrl = link.url.toLowerCase().trim();
                                                const normalizedDeleteUrl = urlToDelete?.toLowerCase().trim();
                                                return !(
                                                    link.platform === platformToDelete &&
                                                    normalizedUrl === normalizedDeleteUrl
                                                );
                                            }
                                        );
                                        onSocialLinksChange(updatedLinks);
                                    }
                                }}
                            />
                        </div>
                    )}
                />
                <div className="flex items-center justify-center gap-3 h-full w-fit bg-white z-10">
                    <FontAwesomeIcon
                        icon={faPlus}
                        size="xl"
                        title="Agregar"
                        onClick={() => {
                            setPlatformToEdit(null);
                            setOpenModal(true);
                        }}
                    />
                </div>
            </div>

            <SocialMediaModal
                open={openModal}
                platform={platformToEdit}
                setOpen={setOpenModal}
                socialLinks={socialMediaLinks}
                onSocialLinksChange={onSocialLinksChange}
            />
        </>
    );
};

export default SocialMediaInput;
