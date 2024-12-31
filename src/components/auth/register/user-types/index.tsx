import { faBuilding, faUser } from "@fortawesome/free-solid-svg-icons";
import { USER_TYPES } from "@/constants/auth";
import UserTypeButton from "../user-type-button";

const { CUSTOMER, INSURANCE_COMPANY } = USER_TYPES;

const UserTypes = () => {
  return (
    <>
      <header className="text-center w-11/12 lg:w-full flex flex-col items-center gap-4 mb-4 lg:mt-6">
        <h1 className="text-2xl font-normal lg:text-5xl text-balance">
          Únete a nuestra comunidad aseguradora. ¡Selecciona tu perfil!
        </h1>
        <h2 className="text-sm font-century-gothic lg:text-xl text-balance">
          Para vivir una mejor experiencia y darte la información que necesitas
        </h2>
      </header>

      <div className="w-11/12 flex justify-evenly items-center text-base lg:justify-center lg:gap-8">
        <UserTypeButton
          icon={faUser}
          selectedUserType={CUSTOMER}
          text="Persona natural"
        />
        <UserTypeButton
          icon={faBuilding}
          selectedUserType={INSURANCE_COMPANY}
          text="Empresa"
        />
      </div>
    </>
  );
};

export default UserTypes;
