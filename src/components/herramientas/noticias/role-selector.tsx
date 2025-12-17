import React from "react";
import { UserGroups } from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";

interface RoleSelectorProps {
  selectedRoles: UserGroups[];
  onChange: (roles: UserGroups[]) => void;
  disabled?: boolean;
}

const roleOptions = [
  {
    value: UserGroups.Member,
    label: "Corredor de seguros",
    icon: "/images/entities-icons/corredor-de-seguros.svg",
  },
  {
    value: UserGroups.Member,
    label: "Agente exclusivo",
    icon: "/images/entities-icons/agente-exclusivo.svg",
  },
  {
    value: UserGroups.Member,
    label: "Sociedad de corretaje",
    icon: "/images/entities-icons/sociedad-de-corretaje.svg",
  },
  {
    value: UserGroups.Member,
    label: "Compañía de seguros",
    icon: "/images/entities-icons/compania-de-seguros.svg",
  },
  {
    value: UserGroups.Member,
    label: "Proveedores",
    icon: "/images/entities-icons/proovedores.svg",
  },
];

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRoles,
  onChange,
  disabled = false,
}) => {
  const toggleRole = (role: UserGroups) => {
    if (disabled) return;
    
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 sm:gap-6">
      {roleOptions.map((option, index) => {
        const isSelected = selectedRoles.includes(option.value);
        return (
          <button
            key={`${option.value}-${index}`}
            type="button"
            onClick={() => toggleRole(option.value)}
            disabled={disabled}
            className={cn(
              "flex flex-col items-center gap-1 sm:gap-2 transition-all",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center p-2 sm:p-3 transition-colors",
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={option.icon}
                alt={option.label}
                className="w-full h-full object-contain"
            />
            </div>
            <span
              className={cn(
                "text-[9px] sm:text-[10px] text-center leading-tight max-w-[55px] sm:max-w-[70px]",
                isSelected ? "text-blue-500 font-medium" : "text-gray-500"
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;
