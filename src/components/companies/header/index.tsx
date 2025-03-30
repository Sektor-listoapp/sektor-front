/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import TextInput from "@/components/ui/text-input";
import { ORGANIZATION_TYPE_SELECT_OPTIONS } from "@/constants/forms";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { pickBy } from "lodash";
import ImportCompaniesModal from "../import-modal";

interface CompaniesHeaderProps {
  handleGetCompanies: (variables?) => void;
  disabled?: boolean;
}

const CompaniesHeader = ({
  handleGetCompanies,
  disabled = false,
}: CompaniesHeaderProps) => {
  const [openImportModal, setOpenImportModal] = useState(false);
  const [input, setInput] = useState({
    name: "",
    type: "",
  });

  const handleSearchCompanies = () => {
    const cleanedInput = pickBy(input, (value) => Boolean(value?.trim()));
    handleGetCompanies({ filter: cleanedInput });
  };

  useEffect(() => handleSearchCompanies(), [input?.type]);

  return (
    <header className="w-full flex flex-col items-center justify-center gap-4 max-w-xl text-blue-500 xl:flex-row xl:justify-between xl:max-w-full">
      <div className="w-full flex items-center justify-between gap-1 xl:w-fit">
        <h1 className="text-lg md:text-2xl font-bold text-blue-500 ">
          Todos nuestros usuarios
        </h1>
        <Button
          className="w-fit md:px-16 xl:hidden"
          variant="solid-blue"
          disabled={disabled}
          onClick={() => setOpenImportModal(true)}
        >
          Importar
        </Button>
      </div>
      <form
        className="flex gap-4 w-full md:mx-auto xl:max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchCompanies();
        }}
      >
        <TextInput
          placeholder="Buscar por nombre"
          icon={faSearch}
          iconPosition="end"
          value={input?.name}
          onChange={(e) => setInput({ ...input, name: e.target?.value })}
          disabled={disabled}
        />
        <Select
          options={[
            { label: "Buscar por", value: "", disabled: true, hidden: true },
            { label: "Todos", value: "" },
            ...ORGANIZATION_TYPE_SELECT_OPTIONS,
          ]}
          value={input.type}
          disabled={disabled}
          onChange={(e) => setInput({ ...input, type: e.target?.value })}
        />
      </form>

      <Button
        className="hidden xl:block w-fit xl:px-16"
        variant="solid-blue"
        disabled={disabled}
        onClick={() => setOpenImportModal(true)}
      >
        Importar
      </Button>

      <ImportCompaniesModal
        open={openImportModal}
        setOpen={setOpenImportModal}
      />
    </header>
  );
};

export default CompaniesHeader;
