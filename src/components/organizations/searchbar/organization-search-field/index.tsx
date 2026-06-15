import React, { memo, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/class-name";

interface OrganizationSearchFieldProps {
  urlSearch?: string;
  onSearch: (value: string) => void;
  onClear: () => void;
}

const OrganizationSearchField = ({
  urlSearch = "",
  onSearch,
  onClear,
}: OrganizationSearchFieldProps) => {
  const [searchValue, setSearchValue] = useState(urlSearch);
  const hadActiveSearchRef = useRef(Boolean(urlSearch));

  useEffect(() => {
    setSearchValue(urlSearch);
    hadActiveSearchRef.current = Boolean(urlSearch);
  }, [urlSearch]);

  const handleChange = (value: string) => {
    setSearchValue(value);

    if (!value.trim() && hadActiveSearchRef.current) {
      hadActiveSearchRef.current = false;
      onClear();
    }
  };

  return (
    <form
      className="w-full flex items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(searchValue);
      }}
    >
      <div className="relative w-full">
        <input
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          value={searchValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Busca intermediario, seguros o ramos"
          className={cn(
            "py-3 px-5 pe-12 block w-full bg-white border border-blue-500 rounded-3xl",
            "text-blue-500 text-sm md:text-lg shadow-xl placeholder:text-gray-400",
            "focus:border-blue-500 focus:ring-blue-500 font-century-gothic border-opacity-50"
          )}
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute inset-y-0 end-0 pe-4 my-auto text-blue-500 opacity-40 pointer-events-none"
        />
      </div>
    </form>
  );
};

export default memo(OrganizationSearchField);
