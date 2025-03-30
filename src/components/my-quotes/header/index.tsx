/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Select from "@/components/ui/select";
import TextInput from "@/components/ui/text-input";
import { QUOTE_LINE_OF_BUSINESS_OPTIONS } from "@/constants/forms";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { pickBy } from "lodash";
import DatePicker from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { useDebounce } from "@uidotdev/usehooks";

interface QuotesHeaderProps {
  handleGetQuotes: (variables?) => void;
  disabled?: boolean;
}

interface InputState {
  lineOfBusiness?: string;
  dateFrom?: string;
  read?: string;
}

const QuotesHeader = ({
  handleGetQuotes: handleGetQuotes,
  disabled = false,
}: QuotesHeaderProps) => {
  const [input, setInput] = useState<InputState>({
    lineOfBusiness: "",
    dateFrom: "",
    read: "",
  });
  const { dateFrom, lineOfBusiness, read } = input;
  const [customerName, setCustomerName] = useState<string>("");
  const debouncedCustomerName = useDebounce(customerName, 1000);

  const handleSearchQuotes = () => {
    const formattedInput = {
      customerName: customerName ? customerName?.trim() : null,
      dateFrom: dateFrom ? dateFrom : null,
      read: read !== "" ? JSON.parse(read as string) : null,
      lineOfBusinesses: lineOfBusiness ? [lineOfBusiness] : null,
    };
    const cleanedInput = pickBy(formattedInput, (value) => value !== null);
    const hasValidInput = Object.keys(cleanedInput).length > 0;
    const variables = hasValidInput ? { filter: { ...cleanedInput } } : {};
    handleGetQuotes(variables);
  };

  useEffect(() => {
    handleSearchQuotes();
  }, [dateFrom, lineOfBusiness, read, debouncedCustomerName]);

  return (
    <header className="w-full flex flex-col items-center justify-center gap-4 max-w-xl text-blue-500 xl:flex-row xl:justify-between xl:max-w-full">
      <div className="w-full flex items-center justify-between gap-1">
        <h1 className="text-lg md:text-2xl font-bold text-blue-500 w-full">
          Mis cotizaciones
        </h1>
      </div>
      <form
        className="xl:flex gap-4 w-full md:mx-auto justify-stretch items-center grid grid-cols-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchQuotes();
        }}
      >
        <TextInput
          placeholder="Buscar por nombre"
          wrapperClassName="w-full xl:w-72 col-span-4 sm:col-span-2"
          className="w-full xl:w-72"
          icon={faSearch}
          iconPosition="end"
          value={customerName}
          disabled={disabled}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <DatePicker
          wrapperClassName="w-full xl:w-44 col-span-4 sm:col-span-2"
          className="w-full xl:w-44"
          placeholder="Fecha"
          allowClear={true}
          disabled={disabled}
          onChange={(_, dateString) => {
            setInput((prev) => ({ ...prev, dateFrom: dateString as string }));
          }}
          maxDate={dayjs()}
          format="DD/MM/YYYY"
        />

        <Select
          wrapperClassName="w-full col-span-2 xl:w-44"
          className="w-full col-span-2 xl:w-44"
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
            ...QUOTE_LINE_OF_BUSINESS_OPTIONS,
          ]}
          value={input.lineOfBusiness}
          disabled={disabled}
          onChange={(e) =>
            setInput({ ...input, lineOfBusiness: e.target?.value })
          }
        />

        <Select
          wrapperClassName="w-full col-span-2 xl:w-44"
          className="w-full col-span-2 xl:w-44"
          options={[
            {
              label: "Estado",
              value: "",
              disabled: true,
              hidden: true,
            },
            { label: "Todos", value: "" },
            { label: "Abiertas", value: "true" },
            { label: "Cerradas", value: "false" },
          ]}
          value={input?.read}
          disabled={disabled}
          onChange={(e) =>
            setInput({
              ...input,
              read: e.target?.value !== "" ? JSON.parse(e.target?.value) : "",
            })
          }
        />
      </form>
    </header>
  );
};

export default QuotesHeader;
