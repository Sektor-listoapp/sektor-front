import React from "react";

interface SektorFullVerticalLogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "light" | "dark" | "white";
}

const SektorFullVerticalLogo = ({
  className = "",
  ...props
}: SektorFullVerticalLogoProps) => {



  const logoSrc = "/images/sektor-full-vertical-logo-white.svg";

  return (
    <svg
      viewBox="0 0 4096 3805"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      {...props}
    >
      <image
        href={logoSrc}
        x="0"
        y="0"
        width="4096"
        height="3805"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
};

export default SektorFullVerticalLogo;
