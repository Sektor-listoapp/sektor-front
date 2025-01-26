import HeroBannerNavbar from "../hero-banner-navbar";
import { useIsClient } from "@uidotdev/usehooks";
import { HERO_BANNER_CONTENT } from "./constants";
import { useRouter } from "next/router";

const HeroBanner = () => {
  const isClient = useIsClient();
  const { query } = useRouter();
  const organizationType = query?.type || "DEFAULT";

  const Content =
    HERO_BANNER_CONTENT[organizationType as keyof typeof HERO_BANNER_CONTENT];

  return (
    <header className="bg-blue-500 w-full sm:gap-8 md:bg-white">
      {isClient && <HeroBannerNavbar />}

      <div className="w-full bg-blue-500">
        <div className="max-w-screen-xl w-full px-7 flex flex-col items-start justify-start gap-5 xl:items-center md:gap-20 xl:gap-28 mx-auto 2xl:px-0">
          <Content />
        </div>
      </div>
    </header>
  );
};

export default HeroBanner;
