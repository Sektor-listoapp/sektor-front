/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import Select from "@/components/ui/select";
import TextInput from "@/components/ui/text-input";
import { QUOTE_LINE_OF_BUSINESS_OPTIONS } from "@/constants/forms";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { pickBy } from "lodash";
import DatePicker from "@/components/ui/date-picker";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface QuotesHeaderProps {
  handleGetQuotes: (variables?) => void;
  disabled?: boolean;
}

interface InputState {
  lineOfBusiness?: string;
  customerName?: string;
  dateFrom?: string;
  read?: string;
}

const QuotesHeader = ({
  handleGetQuotes,
  disabled = false,
}: QuotesHeaderProps) => {
  const [input, setInput] = useState<InputState>({
    lineOfBusiness: "",
    customerName: "",
    dateFrom: "",
    read: "",
  });

  const getCleanedVariables = () => {
    const { dateFrom, lineOfBusiness, read, customerName } = input || {};
    const formattedInput = {
      customerName: customerName ? customerName?.trim() : null,
      dateFrom: dateFrom ? dateFrom : null,
      read: read !== "" ? JSON.parse(read as string) : null,
      lineOfBusinesses: lineOfBusiness ? [lineOfBusiness] : null,
    };
    const cleanedInput = pickBy(formattedInput, (value) => value !== null);
    const isValidInput = Object?.keys(cleanedInput)?.length > 0;
    return { filter: isValidInput ? cleanedInput : {} };
  };

  const cleanedVariables = useMemo(
    () => getCleanedVariables(),
    [input.dateFrom, input.lineOfBusiness, input.read]
  );

  useEffect(() => handleGetQuotes(cleanedVariables), [cleanedVariables]);

  return (
    <header className="w-full flex flex-col items-center justify-center gap-4 max-w-xl text-blue-500 xl:flex-row xl:justify-between xl:max-w-full">
      <div className="w-full flex items-center justify-between gap-1">
        <h1 className="text-lg md:text-2xl font-bold text-blue-500 w-full">
          Mis cotizaciones
        </h1>
      </div>
      <div className="xl:flex gap-4 w-full md:mx-auto justify-stretch items-center grid grid-cols-4">
        <TextInput
          placeholder="Buscar por nombre"
          wrapperClassName="w-full xl:w-72 col-span-4 sm:col-span-2"
          className="w-full xl:w-72"
          icon={faSearch}
          iconPosition="end"
          value={input?.customerName}
          disabled={disabled}
          onChange={(e) =>
            setInput({ ...input, customerName: e.target?.value })
          }
          onKeyDown={(e) => {
            if (e?.key === "Enter") {
              const cleanedVariables = getCleanedVariables();
              handleGetQuotes(cleanedVariables);
            }
          }}
        />
        <DatePicker
          wrapperClassName="w-full xl:w-48 col-span-4 sm:col-span-2"
          className="w-full xl:w-48"
          placeholder="Fecha"
          allowClear={{
            clearIcon: (
              <FontAwesomeIcon
                icon={faClose}
                size="2x"
                className="text-blue-500"
              />
            ),
          }}
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
      </div>
    </header>
  );
};

export default QuotesHeader;
