/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Select from "@/components/ui/select";
import TextInput from "@/components/ui/text-input";
import { SELECT_LINE_OF_BUSINESS_OPTIONS } from "@/constants/forms";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { pickBy } from "lodash";

interface QuotesHeaderProps {
  handleGetQuotes: (variables?) => void;
  disabled?: boolean;
}

const QuotesHeader = ({
  handleGetQuotes: handleGetQuotes,
  disabled = false,
}: QuotesHeaderProps) => {
  const [input, setInput] = useState({
    name: "",
    type: "",
  });

  const handleSearchQuotes = () => {
    const cleanedInput = pickBy(input, (value) => Boolean(value?.trim()));
    const hasValidInput = Object.keys(cleanedInput).length > 0;
    const variables = hasValidInput ? cleanedInput : {};
    handleGetQuotes(variables);
  };

  useEffect(() => handleSearchQuotes(), [input?.type]);

  return (
    <header className="w-full flex flex-col items-center justify-center gap-4 max-w-xl text-blue-500 xl:flex-row xl:justify-between xl:max-w-full">
      <div className="w-full flex items-center justify-between gap-1 xl:w-fit">
        <h1 className="text-lg md:text-2xl font-bold text-blue-500 ">
          Mis cotizaciones
        </h1>
      </div>
      <form
        className="flex gap-4 w-full md:mx-auto xl:max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchQuotes();
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
            {
              label: "Ramo",
              value: "",
              disabled: true,
              hidden: true,
            },
            {
              label: "Todos",
              value: "",
            },
            ...SELECT_LINE_OF_BUSINESS_OPTIONS,
          ]}
          value={input.type}
          disabled={disabled}
          onChange={(e) => setInput({ ...input, type: e.target?.value })}
        />
      </form>
    </header>
  );
};

export default QuotesHeader;
