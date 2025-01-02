import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import React from "react";

const FullScreenLoader = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-screen flex items-center justify-center z-50 bg-white text-blue-500 transition-all">
      <SektorFullHorizontalLogo className="w-48 animate-pulse" />
    </div>
  );
};

export default FullScreenLoader;
