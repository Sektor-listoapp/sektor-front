import React from "react";
import { cn } from "@/utils/class-name";
import {
  faCircle,
  faCircleCheck,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "antd";
import { OrganizationType } from "@/lib/sektor-api/__generated__/types";
import { ORGANIZATION_TYPE_LABEL } from "@/constants/content";
import { useAuthStore } from "@/store/auth";

interface HeaderProps {
  data: OrganizationType;
}

const Header = ({ data }: HeaderProps) => {
  const userName = useAuthStore((state) => state.user?.name);
  const isAccountVerified = data?.isActive;
  const userTypeLabel =
    ORGANIZATION_TYPE_LABEL.SINGULAR[data?.type] || "Sektor";

  return (
    <header className="w-11/12 max-w-screen-xl border-b-2 border-b-gray-300 flex justify-between items-end text-blue-500 pb-3 gap-2 md:gap-5 md:pb-5 md:items-center">
      <h1 className="text-lg text-balance md:text-2xl lg:text-3xl">
        ¡Hola {userName ?? ""}! Bienvenido a tu cuenta de {userTypeLabel}
      </h1>

      {Boolean(userName) && Boolean(data) && (
        <div className="text-blue-500 flex justify-center items-center gap-3 w-fit">
          <FontAwesomeIcon
            icon={isAccountVerified ? faCircleCheck : faCircle}
            className={cn(
              isAccountVerified ? "text-green-600" : "text-gray-300"
            )}
          />

          <span className="font-century-gothic text-[10px] md:text-lg">
            {isAccountVerified ? "Cuenta activa" : "Cuenta no activa"}
          </span>

          {!isAccountVerified && (
            <Popover
              placement="topRight"
              overlayStyle={{ width: "250px" }}
              color={"#B7D9E2"}
              content={
                <p className="text-[10px] text-blue-500 font-century-gothic">
                  Hola, para poder activar tu perfil solo debes llenar todos los
                  datos del formulario y el equipo <b>Sektor</b> validará el
                  perfil y activará tu cuenta. Esto nos ayuda a conocerte mejor
                </p>
              }
            >
              <FontAwesomeIcon icon={faCircleExclamation} size="sm" />
            </Popover>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
