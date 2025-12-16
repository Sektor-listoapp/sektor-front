import Image from "next/image";
import React from "react";
import { cn } from "@/utils/class-name";

interface FullScreenLoaderLogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
    className?: string;
}

const FullScreenLoaderLogo = ({ className, ...props }: FullScreenLoaderLogoProps) => {
    return (
        <Image
            src="/images/full-screen-loader-logo.webp"
            alt="Loading"
            width={200}
            height={200}
            className={cn("object-contain", className)}
            {...props}
        />
    );
};

export default FullScreenLoaderLogo;

