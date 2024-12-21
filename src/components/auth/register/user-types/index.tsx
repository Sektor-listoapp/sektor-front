import { faBuilding, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRegistrationStore } from "@/store/registration";
import { USER_TYPES } from "@/constants/auth";
import { UserType } from "@/types/shared";
import clsx from "clsx";

const { CUSTOMER, INSURANCE_COMPANY } = USER_TYPES;

const UserTypes = () => {
  const userType = useRegistrationStore((state) => state.userType);
  const setUserType = useRegistrationStore((state) => state.setUserType);

  const handleUserType = (selectedUserType: UserType) => {
    const newUserType = userType === selectedUserType ? null : selectedUserType;
    setUserType(newUserType);
  };

  return (
    <>
      <header className="text-center w-11/12 flex flex-col items-center gap-4">
        <h1 className="text-2xl">
          Únete a nuestra comunidad aseguradora. ¡Selecciona tu perfil!
        </h1>
        <h2 className="text-sm">
          Para vivir una mejor experiencia y darte la información que necesitas
        </h2>
      </header>
      <div className="w-11/12 flex justify-evenly items-center text-base">
        <button
          className="flex flex-col items-center gap-3"
          onClick={() => handleUserType(CUSTOMER)}
        >
          <div
            className={clsx(
              "w-24 h-24 border-2 rounded-xl flex items-center justify-center transition-all",
              userType === CUSTOMER
                ? "border-blue-500 scale-105"
                : "border-gray-300"
            )}
          >
            <FontAwesomeIcon size="3x" icon={faUser} />
          </div>
          <span>Persona natural</span>
        </button>

        <button
          className="flex flex-col items-center gap-3"
          onClick={() => handleUserType(INSURANCE_COMPANY)}
        >
          <div
            className={clsx(
              "w-24 h-24 border-2 rounded-xl flex items-center justify-center transition-all",
              userType === INSURANCE_COMPANY
                ? "border-blue-500 scale-105"
                : "border-gray-300"
            )}
          >
            <FontAwesomeIcon size="3x" icon={faBuilding} />
          </div>
          <span>Empresa</span>
        </button>
      </div>
    </>
  );
};

export default UserTypes;
