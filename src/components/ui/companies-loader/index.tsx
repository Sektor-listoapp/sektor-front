import Image from "next/image";
import React from "react";
import { cn } from "@/utils/class-name";

interface CompaniesLoaderProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
    className?: string;
}

const CompaniesLoader = ({ className, ...props }: CompaniesLoaderProps) => {
    return (
        <Image
            src="/images/companies-loader.webp"
            alt="Loading companies"
            width={200}
            height={200}
            className={cn("object-contain", className)}
            {...props}
        />
    );
};

export default CompaniesLoader;

