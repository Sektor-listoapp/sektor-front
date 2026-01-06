import React, { useEffect, useMemo, useRef, useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { useLocalStorage } from "@uidotdev/usehooks";
import { PLATFORM_LABELS_MAP } from "@/constants/forms";
import { cn } from "@/utils/class-name";
import SocialMediaModal from "./social-media-modal";
import { SocialMediaLinkType, SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";

interface SocialMediaInputProps {
    disabled?: boolean;
    setHasSocialLinks: React.Dispatch<React.SetStateAction<boolean>>;
    socialMediaLinks?: SocialMediaLinkType[];
}

const SocialMediaInput = ({
    disabled,
    setHasSocialLinks,
    socialMediaLinks,
}: SocialMediaInputProps) => {
    const [socialLinks, setSocialLinks] = useLocalStorage<SocialMediaLinkType[]>(
        "social-links",
        []
    );

    const [openModal, setOpenModal] = useState(false);
    const [platformToEdit, setPlatformToEdit] = useState<string | null>(null);
    const prevSocialMediaLinksRef = useRef<SocialMediaLinkType[] | undefined>(undefined);

    useEffect(() => {
        setHasSocialLinks(socialLinks.length > 0);
    }, [socialLinks, setHasSocialLinks]);

    useEffect(() => {
     
        if (socialMediaLinks === undefined) {
           
            return;
        }

   
        const normalizeLink = (link: SocialMediaLinkType) => ({
            platform: link.platform,
            url: link.url.toLowerCase().trim(),
        });

        const normalizeLinks = (links: SocialMediaLinkType[]) => {
            return links
                .map(normalizeLink)
                .filter((link, index, self) => {
                    return index === self.findIndex((l) =>
                        l.platform === link.platform && l.url === link.url
                    );
                });
        };

        const propLinks = socialMediaLinks || [];
        const currentLinks = socialLinks || [];

      
        const prevLinks = prevSocialMediaLinksRef.current || [];
        const normalizedPrev = normalizeLinks(prevLinks);
        const normalizedProp = normalizeLinks(propLinks);
        const normalizedCurrent = normalizeLinks(currentLinks);

      
        const propsChanged =
            normalizedPrev.length !== normalizedProp.length ||
            normalizedPrev.some((prevLink) => {
                return !normalizedProp.some(
                    (propLink) =>
                        propLink.platform === prevLink.platform &&
                        propLink.url === prevLink.url
                );
            });

    
        const areDifferent =
            normalizedProp.length !== normalizedCurrent.length ||
            normalizedProp.some((propLink) => {
                return !normalizedCurrent.some(
                    (currentLink) =>
                        currentLink.platform === propLink.platform &&
                        currentLink.url === propLink.url
                );
            });

        if (propsChanged && areDifferent) {
            if (propLinks.length > 0) {
                const uniqueLinks = propLinks.filter((link, index, self) => {
                    const normalizedUrl = link.url.toLowerCase().trim();
                    return index === self.findIndex((l) =>
                        l.platform === link.platform &&
                        l.url.toLowerCase().trim() === normalizedUrl
                    );
                });
                setSocialLinks(uniqueLinks);
            } else {
                setSocialLinks([]);
            }
        }

        prevSocialMediaLinksRef.current = socialMediaLinks;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socialMediaLinks]);

    const options = useMemo(() => {

        const uniqueLinks = socialLinks.filter((link, index, self) => {
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
                                    const platformToDelete = option?.data?.data?.platform;
                                    const urlToDelete = option?.data?.data?.url;
                                    const updatedLinks = socialLinks.filter(
                                        (link) => {
                                            const normalizedUrl = link.url.toLowerCase().trim();
                                            const normalizedDeleteUrl = urlToDelete?.toLowerCase().trim();
                                            return !(
                                                link.platform === platformToDelete &&
                                                normalizedUrl === normalizedDeleteUrl
                                            );
                                        }
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
