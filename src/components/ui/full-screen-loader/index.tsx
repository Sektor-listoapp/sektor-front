import SektorFullHorizontalLogo from "@/components/icons/sektor-full-horizontal-logo";
import { cn } from "@/utils/class-name";
import React from "react";

const FullScreenLoader = ({
  className,
  ...props
}: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-screen flex items-center justify-center z-50 bg-white text-blue-500 transition-all",
        className
      )}
      {...props}
    >
      <SektorFullHorizontalLogo className="w-48 animate-pulse" />
    </div>
  );
};

export default FullScreenLoader;
