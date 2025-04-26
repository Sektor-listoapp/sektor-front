import React, { useState, useEffect } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { useLocalStorage } from "@uidotdev/usehooks";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";
import { cn } from "@/utils/class-name";
import SocialMediaModal from "./social-media-modal";
// import SocialMediaModal from "./social-media-modal";

interface SocialMediaInputProps {
    disabled?: boolean;
    setHasSocialLinks: React.Dispatch<React.SetStateAction<boolean>>;
}

const SocialMediaInput = ({
    disabled,
    setHasSocialLinks,
}: SocialMediaInputProps) => {
    const [socialLinks, setSocialLinks] = useLocalStorage<Record<string, string>>(
        "social-links",
        {}
    );
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setHasSocialLinks(Object.keys(socialLinks).length > 0);
    }, [socialLinks, setHasSocialLinks]);

    const options = Object.entries(socialLinks).map(([platform, url]) => ({
        value: platform,
        label: `${PLATFORM_LABELS_MAP[platform]}: ${url}`,
        data: {
            platform,
            url,
            label: PLATFORM_LABELS_MAP[platform],
        },
    }));

    return (
        <>
            <div
                className={cn(
                    "w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4",
                    {
                        "border-red-500": Object.keys(socialLinks).length === 0,
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
                    optionRender={() => (
                        <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
                            <div>
                                {/* <b>{option.data.label}:</b> {option.data.url} */}
                            </div>
                            <FontAwesomeIcon
                                className="ml-auto cursor-pointer"
                                icon={faPen}
                                size="lg"
                                title="Editar"
                                onClick={() => {
                                    // setSelectedPlatform(option.data.platform);
                                    setOpenModal(true);
                                }}
                            />
                            <FontAwesomeIcon
                                className="ml-2 cursor-pointer text-red-500"
                                icon={faTrashCan}
                                size="lg"
                                title="Eliminar"
                                onClick={() => {
                                    const updated = { ...socialLinks };
                                    // delete updated[option.data.platform];
                                    setSocialLinks(updated);
                                }}
                            />
                        </div>
                    )}
                />
                <div className="flex items-center justify-center gap-3 h-full w-fit bg-white z-10">
                    <FontAwesomeIcon
                        size="xl"
                        icon={faPlus}
                        onClick={() => {
                            setSelectedPlatform(null);
                            setOpenModal(true);
                        }}
                    />

                </div>
            </div>

            <SocialMediaModal
                open={openModal}
                platform={selectedPlatform}
                setOpen={setOpenModal}
                socialLinks={socialLinks}
                setSocialLinks={setSocialLinks}
            />

        </>
    );
};

export default SocialMediaInput;
