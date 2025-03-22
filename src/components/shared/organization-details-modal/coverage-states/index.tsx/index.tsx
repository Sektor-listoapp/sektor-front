import React from "react";
import Image from "next/image";
import { cn } from "@/utils/class-name";
import Link from "next/link";
import { OrganizationOfficeType } from "@/lib/sektor-api/__generated__/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface OrganizationCoverageStateProps {
  offices: OrganizationOfficeType[];
}

const OrganizationCoverageStates = ({
  offices,
}: OrganizationCoverageStateProps) => {
  const coverageStates: Record<string, OrganizationOfficeType[]> = {};
  const [showOfficesList, setShowOfficesList] = React.useState(false);
  const [selectedOffices, setSelectedOffices] = React.useState<
    OrganizationOfficeType[]
  >([]);

  offices.forEach((office) => {
    const city = office?.address?.city?.name || "";
    const stateName = office?.address?.state?.name || "";
    const officeKey = `${city}, ${stateName}`;
    if (!coverageStates[officeKey]) {
      coverageStates[officeKey] = [];
    }
    coverageStates[officeKey].push(office);
  });

  return (
    <section className="w-full mt-5">
      {!showOfficesList && (
        <div className="w-full text-blue-500 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10 h-96 overflow-y-auto px-5">
          {Object.entries(coverageStates)?.map(([location, offices], index) => {
            const imageSrc = offices[0]?.photoUrl || "/images/placeholder.png";
            return (
              <div
                key={`office-${index}`}
                className={cn(
                  "w-full rounded-2xl mx-auto font-century-gothic flex flex-col max-w-sm justify-between relative md:max-w-80 2xl:max-w-96 2xl:h-80 md:hover:shadow-xl md:hover:cursor-pointer transition-shadow duration-300 md:active:shadow-sm"
                )}
                onClick={() => {
                  setShowOfficesList(true);
                  setSelectedOffices(offices);
                }}
              >
                <Image
                  className="w-full h-full object-cover object-center 2xl:h-72 rounded-t-2xl"
                  src={imageSrc}
                  alt={location}
                  width={500}
                  height={400}
                />
                <div className="w-full shadow-lg p-2 py-4 text-base rounded-b-2xl border border-blue-500 border-opacity-20 h-full flex justify-start items-center gap-1 md:gap-2">
                  <h3 className="w-full">{location}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showOfficesList && (
        <div className="w-full flex flex-col gap-3">
          <header
            className="w-full flex justify-start items-center gap-3 text-lg lg:text-2xl font-arial-rounded font-bold cursor-pointer"
            onClick={() => setShowOfficesList(false)}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <h3>{`Sedes en ${selectedOffices[0]?.address?.state?.name}`}</h3>
          </header>
          <div className="w-full flex flex-col gap-3 mt-4">
            {selectedOffices.map((office, index) => {
              const { address, phone } = office;
              const street = address?.street || "";
              const cityName = address?.city?.name || "";
              const stateName = address?.state?.name || "";
              const formattedAddress = `${
                street ? `${street}, ` : ""
              }${cityName}, ${stateName}`;
              console.log("Address", formattedAddress);
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;

              return (
                <div
                  key={`office-${index}`}
                  className="w-full flex flex-col gap-4 text-base"
                >
                  <div className="w-full gap-3 flex items-start justify-between">
                    <FontAwesomeIcon icon={faLocationDot} size="3x" />
                    <h3 className="w-full">{formattedAddress}</h3>
                  </div>

                  <div className="w-full flex justify-between items-center gap-2">
                    {phone && (
                      <div
                        onClick={() => window.open(`https://wa.me/${phone}`)}
                        className="bg-[#25D366] p-1 px-4 text-base flex justify-between items-center gap-2 rounded-full"
                      >
                        <FontAwesomeIcon icon={faWhatsapp} />
                        <span>{phone}</span>
                      </div>
                    )}

                    <Link
                      href={googleMapsUrl}
                      passHref
                      target="_blank"
                      className="underline"
                    >
                      Ir al mapa
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default OrganizationCoverageStates;
