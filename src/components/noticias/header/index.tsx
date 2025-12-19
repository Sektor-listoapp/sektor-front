import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { ROUTES } from "@/constants/router";
import { cn } from "@/utils/class-name";

const NoticiasHeader = () => {
    const router = useRouter();
    const { pathname } = router;
    const [isAppDownloadOpen, setIsAppDownloadOpen] = useState(false);
    const appDownloadRef = useRef<HTMLDivElement>(null);


    const androidDownloadUrl = "#"; // TODO: Add Android download URL when available
    const iosDownloadUrl = "https://apps.apple.com/us/app/sektor/id6751517136";

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (appDownloadRef.current && !appDownloadRef.current.contains(event.target as Node)) {
                setIsAppDownloadOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-white py-6 px-8 border-b border-gray-100">
            <div className="max-w-screen-xl mx-auto flex items-center">
                <SektorFullHorizontalLogo
                    width={140}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => router.push(ROUTES.HOME)}
                />

                <nav className="flex-1 flex items-center justify-center gap-8 font-century-gothic text-sm">
                    <Link
                        href={ROUTES.HOME}
                        className="text-blue-500 hover:text-blue-400 transition-colors focus:outline-none"
                    >
                        Inicio
                    </Link>
                    <Link
                        href={ROUTES.NOTICIAS}
                        className={cn(
                            "text-blue-500 hover:text-blue-400 transition-colors focus:outline-none",
                            {
                                "underline underline-offset-4": pathname.startsWith(ROUTES.NOTICIAS),
                            }
                        )}
                    >
                        Noticias
                    </Link>
                    <div className="relative" ref={appDownloadRef}>
                        <button
                            onClick={() => setIsAppDownloadOpen(!isAppDownloadOpen)}
                            className="text-blue-500 hover:text-blue-400 transition-colors focus:outline-none flex items-center gap-1"
                        >
                            Descarga la app mobile
                            <FontAwesomeIcon
                                icon={faCaretDown}
                                className={cn(
                                    "text-xs transition-transform duration-200",
                                    isAppDownloadOpen && "rotate-180"
                                )}
                            />
                        </button>
                        {isAppDownloadOpen && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[150px]">
                                <a
                                    href={androidDownloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-4 py-3 text-sm text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-lg"
                                    onClick={() => setIsAppDownloadOpen(false)}
                                >
                                    Android
                                </a>
                                <div className="border-b border-gray-100"></div>
                                <a
                                    href={iosDownloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block px-4 py-3 text-sm text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors last:rounded-b-lg"
                                    onClick={() => setIsAppDownloadOpen(false)}
                                >
                                    iOS
                                </a>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="w-[140px]" />
            </div>
        </header>
    );
};

export default NoticiasHeader;
