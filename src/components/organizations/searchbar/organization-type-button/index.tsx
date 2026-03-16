import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ORGANIZATION_TYPE_OPTIONS } from "../constants";
import { cn } from "@/utils/class-name";
import { Popover } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";

interface OrganizationTypeButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  data: (typeof ORGANIZATION_TYPE_OPTIONS)[number];
}

const OrganizationTypeButton = ({
  data,
  className,
  ...props
}: OrganizationTypeButtonProps) => {
  const { query, replace } = useRouter();
  const { icon, name, id } = data;
  const imagePath = "imagePath" in data ? (data as { imagePath: string }).imagePath : undefined;
  const isSelected = query?.type === id;

  const handleClick = (type: string) => {
    const newQueryParams = query?.search ? { search: query?.search } : {};
    if (query?.type === type) {
      replace({ query: newQueryParams }, undefined, { scroll: false });
      return;
    }
    replace({ query: { ...newQueryParams, type } }, undefined, {
      scroll: false,
    });
  };

  return (
    <Popover
      title={name}
      placement="top"
      overlayInnerStyle={{ textAlign: "center" }}
      overlayClassName="font-century-gothic text-blue-500 border-2 border-gray-100 bg-white rounded-lg text-center"
      rootClassName="invisible md:visible"
    >
      <button
        className={cn(
          "h-10 w-10 sm:h-11 sm:w-11 mx-auto border border-[#0E2944] text-[#0E2944] flex justify-center items-center rounded-2xl transition-all",
          isSelected ? "bg-gray-200" : "bg-white",
          className
        )}
        onClick={() => handleClick(id)}
        {...props}
      >
        {imagePath ? (
          <Image
            src={imagePath}
            alt={name}
            width={40}
            height={40}
            priority
            className="object-contain w-6 h-6"
          />
        ) : (
          <FontAwesomeIcon icon={icon} size="2x" />
        )}
      </button>
      <span className="block mt-1 font-century-gothic text-[8px] text-center text-balance sm:text-sm md:hidden">
        {name}
      </span>
    </Popover>
  );
};

export default OrganizationTypeButton;
