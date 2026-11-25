/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import TextInput from "@/components/ui/text-input";
import {
  ACADEMY_TYPE_SELECT_OPTION,
  ORGANIZATION_TYPE_SELECT_OPTIONS,
} from "@/constants/forms";
import type { CompaniesView } from "..";
import { faEnvelope, faSearch } from "@fortawesome/free-solid-svg-icons";
import { pickBy } from "lodash";
import ImportCompaniesModal from "../import-modal";
import { useLazyQuery } from "@apollo/client";
import { GET_ORGANIZATION_TEMPLATE_DOWNLOAD_QUERY } from "@/lib/sektor-api/queries";
import { toast } from "react-toastify";

type CompaniesSearchFilter = {
  name?: string;
  email?: string;
  type?: string;
};

interface CompaniesHeaderProps {
  view?: CompaniesView;
  handleGetCompanies: (variables?: { filter?: CompaniesSearchFilter }) => void;
  searchFilters?: CompaniesSearchFilter;
  disabled?: boolean;
}

const CompaniesHeader = ({
  view = "organizations",
  handleGetCompanies,
  searchFilters = {},
  disabled = false,
}: CompaniesHeaderProps) => {
  const [openImportModal, setOpenImportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [input, setInput] = useState({
    name: searchFilters.name ?? "",
    email: searchFilters.email ?? "",
    type: searchFilters.type ?? "",
  });

  const [fetchOrganizationTemplateDownload] = useLazyQuery(
    GET_ORGANIZATION_TEMPLATE_DOWNLOAD_QUERY,
    { fetchPolicy: "no-cache" }
  );

  useEffect(() => {
    setInput({
      name: searchFilters.name ?? "",
      email: searchFilters.email ?? "",
      type: searchFilters.type ?? "",
    });
  }, [searchFilters.name, searchFilters.email, searchFilters.type]);

  const buildFilter = () =>
    pickBy(
      {
        name: input.name.trim(),
        email: input.email.trim(),
        type: input.type.trim(),
      },
      (value) => Boolean(value)
    ) as CompaniesSearchFilter;

  const handleSearchCompanies = () => {
    handleGetCompanies({ filter: buildFilter() });
  };

  // On tab change, search with what is typed (name/email); the type filter
  // only applies to organizations, so it is dropped.
  const previousView = useRef(view);
  useEffect(() => {
    if (previousView.current === view) return;
    previousView.current = view;
    const { name, email } = buildFilter();
    if (input.type) setInput((current) => ({ ...current, type: "" }));
    else handleGetCompanies({ filter: pickBy({ name, email }, Boolean) });
  }, [view]);

  useEffect(() => {
    handleSearchCompanies();
  }, [input.type]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await fetchOrganizationTemplateDownload();

      if (error) throw error;

      const file = data?.organizationTemplateDownload;

      if (file?.data && file?.name) {
        const mimeType =
          file.type ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const link = document.createElement("a");
        link.href = `data:${mimeType};base64,${file.data}`;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error(
          "Respuesta inesperada de organizationTemplateDownload:",
          data
        );
        throw new Error("No se pudo obtener el archivo.");
      }
    } catch (error) {
      console.error("Error exportando usuarios:", error);
      toast.error("Error al exportar los usuarios.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="w-full flex flex-col items-center justify-center gap-4 max-w-xl text-blue-500 xl:max-w-full">
      <div className="w-full flex items-center justify-between gap-1">
        <h1 className="text-lg md:text-2xl font-bold text-blue-500 ">
          {view === "customers"
            ? "Personas naturales"
            : "Todos nuestros usuarios"}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            className="w-fit md:px-16"
            variant="solid-blue"
            disabled={disabled || isExporting}
            loading={isExporting}
            onClick={handleExport}
          >
            Exportar
          </Button>
          <Button
            className="w-fit md:px-16"
            variant="solid-blue"
            disabled={disabled}
            onClick={() => setOpenImportModal(true)}
          >
            Importar
          </Button>
        </div>
      </div>
      <form
        className="flex flex-col gap-4 w-full md:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchCompanies();
        }}
      >
        <TextInput
          placeholder="Buscar por nombre"
          icon={faSearch}
          iconPosition="end"
          value={input.name}
          onChange={(e) => setInput({ ...input, name: e.target.value })}
          disabled={disabled}
        />
        <TextInput
          placeholder="Buscar por correo"
          icon={faEnvelope}
          iconPosition="end"
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
          disabled={disabled}
        />
        {view === "organizations" && (
          <Select
            options={[
              { label: "Buscar por", value: "", disabled: true, hidden: true },
              { label: "Todos", value: "" },
              ...ORGANIZATION_TYPE_SELECT_OPTIONS,
              ACADEMY_TYPE_SELECT_OPTION,
            ]}
            value={input.type}
            disabled={disabled}
            onChange={(e) => setInput({ ...input, type: e.target.value })}
          />
        )}
        <button type="submit" className="sr-only">
          Buscar
        </button>
      </form>

      <ImportCompaniesModal
        open={openImportModal}
        setOpen={setOpenImportModal}
      />
    </header>
  );
};

export default CompaniesHeader;
