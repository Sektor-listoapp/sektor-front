import React, { useEffect, useMemo, useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { useLocalStorage } from "@uidotdev/usehooks";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";
import { cn } from "@/utils/class-name";
import SocialMediaModal from "./social-media-modal";
import { SocialMediaLinkType } from "@/lib/sektor-api/__generated__/types";

interface SocialMediaInputProps {
    disabled?: boolean;
    setHasSocialLinks: React.Dispatch<React.SetStateAction<boolean>>;
    socialMediaLinks?: SocialMediaLinkType[];
}

const SocialMediaInput = ({
    disabled,
    setHasSocialLinks,
    socialMediaLinks = [],
}: SocialMediaInputProps) => {
    const [socialLinks, setSocialLinks] = useLocalStorage<SocialMediaLinkType[]>(
        "social-links",
        []
    );

    const [openModal, setOpenModal] = useState(false);
    const [platformToEdit, setPlatformToEdit] = useState<string | null>(null);

    useEffect(() => {
        setHasSocialLinks(socialLinks.length > 0);
    }, [socialLinks, setHasSocialLinks]);

    useEffect(() => {
        if (socialMediaLinks && socialMediaLinks.length > 0) {
            setSocialLinks(socialMediaLinks);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Solo al montar

    const options = useMemo(() => {
        return socialLinks.map((link) => {
            const label = PLATFORM_LABELS_MAP[link.platform] || link.platform;
            return {
                label: `${label}: ${link.url}`,
                value: link.platform,
                data: {
                    label,
                    value: link.platform,
                    platform: link.platform,
                    url: link.url,
                },
            };
        });
    }, [socialLinks]);

    return (
        <>
            <div
                className={cn(
                    "w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4",
                    {
                        "border-red-500": socialLinks.length === 0,
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
                                    const updatedLinks = socialLinks.filter(
                                        (link) => link.platform !== option?.data?.data?.platform
                                    );
                                    setSocialLinks(updatedLinks);
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
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
            />
        </>
    );
};

export default SocialMediaInput;
