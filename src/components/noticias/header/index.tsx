import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { ROUTES } from "@/constants/router";
import { cn } from "@/utils/class-name";

const NoticiasHeader = () => {
    const router = useRouter();
    const { pathname } = router;

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
                    <Link
                        href="#"
                        className="text-blue-500 hover:text-blue-400 transition-colors focus:outline-none"
                    >
                        Descarga la app mobile
                    </Link>
                </nav>

                <div className="w-[140px]" />
            </div>
        </header>
    );
};

export default NoticiasHeader;
