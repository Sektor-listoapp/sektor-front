import React from "react";
import Image from "next/image";

interface SektorFullHorizontalLogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> {
  width?: number;
  height?: number;

  variant?: "light" | "dark" | "white";
}

const SektorFullHorizontalLogo = ({
  className = "",
  width,
  height,
  onClick,
  variant,
  ...props
}: SektorFullHorizontalLogoProps) => {

  const aspectRatio = 4096 / 1469;
  const finalWidth = width || 4096;
  const finalHeight = height || finalWidth / aspectRatio;


  let detectedVariant = variant;
  if (!variant) {
    const classNameStr = typeof className === 'string' ? className : '';
    if (classNameStr.includes('text-white')) {
      detectedVariant = "light";
    } else {
      detectedVariant = "dark";
    }
  }


  const logoSrc = detectedVariant === "light" || detectedVariant === "white"
    ? "/images/sektor-full-horizontal-logo-white.svg"
    : "/images/sektor-full-horizontal-logo.svg";

  return (
    <Image
      src={logoSrc}
      alt="Sektor Logo"
      width={finalWidth}
      height={finalHeight}
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', ...props.style }}
      {...props}
    />
  );
};

export default SektorFullHorizontalLogo;
