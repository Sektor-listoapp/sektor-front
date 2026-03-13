/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import TextInput from "@/components/ui/text-input";
import { ORGANIZATION_TYPE_SELECT_OPTIONS } from "@/constants/forms";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { pickBy } from "lodash";
import ImportCompaniesModal from "../import-modal";
import { useLazyQuery } from "@apollo/client";
import { GET_ORGANIZATION_TEMPLATE_DOWNLOAD_QUERY } from "@/lib/sektor-api/queries";
import { toast } from "react-toastify";

interface CompaniesHeaderProps {
  handleGetCompanies: (variables?) => void;
  disabled?: boolean;
}

const CompaniesHeader = ({
  handleGetCompanies,
  disabled = false,
}: CompaniesHeaderProps) => {
  const [openImportModal, setOpenImportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [input, setInput] = useState({
    name: "",
    type: "",
  });

  const [fetchOrganizationTemplateDownload] = useLazyQuery(
    GET_ORGANIZATION_TEMPLATE_DOWNLOAD_QUERY,
    { fetchPolicy: "no-cache" }
  );

  const handleSearchCompanies = () => {
    const cleanedInput = pickBy(input, (value) => Boolean(value?.trim()));
    handleGetCompanies({ filter: cleanedInput });
  };

  useEffect(() => handleSearchCompanies(), [input?.type]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await fetchOrganizationTemplateDownload();

      if (error) throw error;

      const file = data?.organizationTemplateDownload;

      if (file?.data && file?.name) {
        const mimeType = file.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        const link = document.createElement("a");
        link.href = `data:${mimeType};base64,${file.data}`;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Respuesta inesperada de organizationTemplateDownload:", data);
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
    <header className="w-full flex flex-col items-center justify-center gap-4 max-w-xl text-blue-500 xl:flex-row xl:justify-between xl:max-w-full">
      <div className="w-full flex items-center justify-between gap-1 xl:w-fit">
        <h1 className="text-lg md:text-2xl font-bold text-blue-500 ">
          Todos nuestros usuarios
        </h1>
        <div className="flex items-center gap-2 xl:hidden">
          <Button
            className="w-fit"
            variant="outline"
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

      <div className="hidden xl:flex items-center gap-2">
        <Button
          className="w-fit xl:px-10"
          variant="outline"
          disabled={disabled || isExporting}
          loading={isExporting}
          onClick={handleExport}
        >
          Exportar
        </Button>
        <Button
          className="w-fit xl:px-16"
          variant="solid-blue"
          disabled={disabled}
          onClick={() => setOpenImportModal(true)}
        >
          Importar
        </Button>
      </div>

      <ImportCompaniesModal
        open={openImportModal}
        setOpen={setOpenImportModal}
      />
    </header>
  );
};

export default CompaniesHeader;
