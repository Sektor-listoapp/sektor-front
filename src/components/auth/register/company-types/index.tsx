import { USER_TYPES } from "@/constants/shared";
import {
  faBuilding,
  faPeopleArrows,
  faBuildingCircleArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import UserTypeButton from "../user-type-button";

const { INSURANCE_COMPANY, INTERMEDIARY, SUPPLIER } = USER_TYPES;

const CompanyTypes = () => {
  return (
    <>
      <header className="text-center w-full flex flex-col items-center gap-4 mt-4 mb-8 lg:pt-10">
        <h1 className="text-2xl font-normal lg:text-5xl text-balance">
          Como empresa elige entre nuestras opciones
        </h1>
      </header>
      <div className="w-full flex justify-evenly items-start text-base gap-2 lg:my-4 xl:justify-center xl:gap-8">
        <UserTypeButton
          size="small"
          icon={faPeopleArrows}
          selectedUserType={INTERMEDIARY}
          text="Intermediario"
        />
        <UserTypeButton
          size="small"
          icon={faBuilding}
          selectedUserType={INSURANCE_COMPANY}
          text="Compañía de seguros"
        />
        <UserTypeButton
          size="small"
          icon={faBuildingCircleArrowRight}
          selectedUserType={SUPPLIER}
          text="Proveedor"
        />
      </div>
    </>
  );
};

export default CompanyTypes;
