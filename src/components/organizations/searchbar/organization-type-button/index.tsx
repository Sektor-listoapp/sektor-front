import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ORGANIZATION_TYPE_OPTIONS } from "../constants";
import { cn } from "@/utils/class-name";
import { Popover } from "antd";
import { useRouter } from "next/router";

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
  const { icon, name, type, id } = data;

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
          "h-10 w-12 mx-auto bg-white border border-blue-500 text-blue-500 flex justify-center items-center rounded-lg transition-all active:bg-blue-100 sm:h-14 sm:w-16",
          className,
          { "bg-blue-200": query?.type === type }
        )}
        onClick={() => handleClick(id)}
        {...props}
      >
        <FontAwesomeIcon icon={icon} size="2x" />
      </button>
      <span className="block mt-1 font-century-gothic text-[8px] text-center text-balance sm:text-sm md:hidden">
        {name}
      </span>
    </Popover>
  );
};

export default OrganizationTypeButton;
