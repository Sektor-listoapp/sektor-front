import FacebookIcon from "@/components/icons/facebook";
import InstagramIcon from "@/components/icons/instagram";
import SektorFullVerticalLogo from "@/components/icons/sektor-full-vertical-logo";
import TwitterIcon from "@/components/icons/twitter";
import { cn } from "@/utils/class-name";
import Image from "next/image";
import React from "react";

const Footer = ({ className, ...props }: React.HTMLProps<HTMLDivElement>) => {
  return (
    <footer
      className={cn("text-white w-full bg-blue-500 p-7", className)}
      {...props}
    >
      <div className="max-w-screen-xl w-full flex flex-col items-start justify-start gap-5 mx-auto">
        <SektorFullVerticalLogo className="w-16 h-28" />

        <div className="w-full flex flex-col-reverse justify-center gap-4 items-center border-t pt-10 mt-16 md:flex-row md:justify-between">
          <strong className="font-century-gothic text-base font-normal">
            2024 Sektor C.A.
          </strong>
          <p className="font-century-gothic text-base font-normal flex items-center gap-2">
            Powered by 
            <a href="https://listoapp.cl" target="_blank" rel="noopener noreferrer">
              <Image src="/images/listo-footer.webp" alt="" width={100} height={100} className="w-10 h-10" />
            </a>
          </p>
          <div className="flex justify-center items-center gap-4">
            <InstagramIcon width={40} height={40} />
            <FacebookIcon width={35} height={35} />
            <TwitterIcon width={24} height={24} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
