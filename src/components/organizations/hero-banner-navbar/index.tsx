import Navbar from "@/components/ui/navbar";
import useDevice from "@/hooks/use-device";

const HeroBannerNavbar = () => {
  const { isMobile } = useDevice();

  return (
    <div className="max-w-screen-xl py-4 px-7 w-full mx-auto md:py-6 2xl:px-0 z-10 relative">
      <Navbar variant={isMobile ? "dark" : "light"} />
    </div>
  );
};

export default HeroBannerNavbar;
