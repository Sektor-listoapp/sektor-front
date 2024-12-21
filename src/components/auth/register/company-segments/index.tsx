import { FC } from "react";
import {
  faBuilding,
  faPeopleArrows,
  faBuildingCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CompanyTypesProps {
  userType: "natural" | "empresa" | null;
  setUserType: React.Dispatch<
    React.SetStateAction<"natural" | "empresa" | null>
  >;
}

const CompanySegments: FC<CompanyTypesProps> = ({ userType, setUserType }) => {
  return (
    <>
      <header className="text-center w-11/12 flex flex-col items-center gap-4">
        <h1 className="text-2xl">
          Como empresa elige entre nuestras opciones{" "}
        </h1>
      </header>
      <div className="w-11/12 flex justify-evenly items-center text-base">
        <button
          className="flex flex-col items-center gap-3"
          onClick={() => setUserType(userType === "natural" ? null : "natural")}
        >
          <div
            className={`w-24 h-24 border-2 rounded-xl flex items-center justify-center transition-all ${
              userType === "natural"
                ? "border-blue-500 scale-105"
                : "border-gray-300"
            }`}
          >
            <FontAwesomeIcon size="3x" icon={faPeopleArrows} />
          </div>
          <span>Intermediario</span>
        </button>

        <button
          className="flex flex-col items-center gap-3"
          onClick={() => setUserType(userType === "natural" ? null : "natural")}
        >
          <div
            className={`w-24 h-24 border-2 rounded-xl flex items-center justify-center transition-all ${
              userType === "natural"
                ? "border-blue-500 scale-105"
                : "border-gray-300"
            }`}
          >
            <FontAwesomeIcon size="3x" icon={faBuilding} />
          </div>
          <span>Compañía de seguros</span>
        </button>

        <button
          className="flex flex-col items-center gap-3"
          onClick={() => setUserType(userType === "empresa" ? null : "empresa")}
        >
          <div
            className={`w-24 h-24 border-2 rounded-xl flex items-center justify-center transition-all ${
              userType === "empresa"
                ? "border-blue-500 scale-105"
                : "border-gray-300"
            }`}
          >
            <FontAwesomeIcon size="3x" icon={faBuildingCircleArrowRight} />
          </div>
          <span>Proveedor</span>
        </button>
      </div>
    </>
  );
};

export default CompanySegments;
