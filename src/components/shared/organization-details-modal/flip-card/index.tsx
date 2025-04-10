import React from "react";
import FlipCard from "@/components/ui/flip-card";
import { QRCode } from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";

interface OrganizationFlipCardProps {
  logoUrl: string;
  heading: string;
  yearsOfExperience?: string;
  serviceType?: string;
}

const OrganizationFlipCard = ({
  heading,
  logoUrl,
  yearsOfExperience,
  serviceType,
}: OrganizationFlipCardProps) => {
  const router = useRouter();
  const detailsQuery = router?.query?.details as string;
  const organizationUrl = `${window.location.origin}/organizations?details=${detailsQuery}`;

  return (
    <FlipCard
      wrapperClassName="h-80 relative border-2 border-blue-500 rounded-3xl overflow-hidden max-w-sm mx-auto cursor-pointer"
      front={{
        wrapperClassName: "bg-white border-2 border-red-500 !h-80 !w-full",
        content: (
          <div className="absolute w-full h-full">
            {Boolean(yearsOfExperience || serviceType) && (
              <div className="absolute top-0 right-0 p-2 bg-blue-500 text-white font-semibold rounded-s-lg">
                {yearsOfExperience || serviceType}
              </div>
            )}
            <Image
              className="w-full h-full object-cover object-center"
              alt={heading}
              src={logoUrl || "/images/placeholder.png"}
              height={500}
              width={500}
            />
          </div>
        ),
      }}
      back={{
        wrapperClassName: "bg-white border-2 border-red-500 !h-80 !w-full",
        content: (
          <div className="absolute w-full h-full object-cover object-center p-3 bg-white group lg:hover:bg-black lg:hover:bg-opacity-70 transition-all">
            <QRCode
              value={organizationUrl}
              className="w-full h-full"
              style={{ width: "100%", height: "100%" }}
            />
            <div className="lg:hidden lg:group-hover:flex flex flex-col items-center justify-center gap-4 absolute left-0 bottom-0 h-fit lg:h-full w-full p-5 text-white text-xl font-century-gothic font-bold bg-black bg-opacity-70 transition-all lg:bg-transparent">
              <div className="flex justify-center items-center gap-2 underline">
                <FontAwesomeIcon icon={faShareFromSquare} />
                Compartir por
              </div>
              <div className="flex justify-center items-center gap-4 w-full">
                <button
                  aria-label="Compartir en Facebook"
                  title="Compartir en Facebook"
                  onClick={() => {
                    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      organizationUrl
                    )}`;
                    window.open(shareUrl, "_blank");
                  }}
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </button>
                <button
                  aria-label="Compartir en Whatsapp"
                  title="Compartir en Whatsapp"
                  onClick={() => {
                    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                      organizationUrl
                    )}`;
                    window.open(shareUrl, "_blank");
                  }}
                >
                  <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                </button>

                <button
                  aria-label="Copiar enlace"
                  title="Copiar enlace"
                  onClick={() => {
                    navigator.clipboard.writeText(organizationUrl);
                    toast.info("Enlace copiado al portapapeles");
                  }}
                >
                  <FontAwesomeIcon icon={faLink} size="lg" />
                </button>
              </div>
            </div>
          </div>
        ),
      }}
    />
  );
};

export default OrganizationFlipCard;
