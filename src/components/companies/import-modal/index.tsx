import Button from "@/components/ui/button";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "antd";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

interface ImportCompaniesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ImportCompaniesModal = ({ open, setOpen }: ImportCompaniesModalProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => setOpen(false);

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(
        "https://rujojcf4rd.execute-api.us-east-1.amazonaws.com/default/dev/excel-registration/template"
      );

      if (!response.ok) {
        throw new Error("Error al descargar la plantilla");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plantilla-empresas.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Error al descargar la plantilla";
      toast.error(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

 
    if (
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls")
    ) {
      toast.error("Por favor, selecciona un archivo Excel válido (.xlsx o .xls)");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://rujojcf4rd.execute-api.us-east-1.amazonaws.com/default/dev/excel-registration/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Archivo subido exitosamente");
        handleClose();
      } else {
        throw new Error(data.message || "Error al procesar el archivo");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Error al subir el archivo";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Modal
      footer={null}
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
    >
      <section className="flex flex-col items-center justify-center gap-12 text-blue-500 px-5 py-10">
        <h2 className="text-2xl font-bold font-arial-rounded">
          Subir documento excel
        </h2>

        <FontAwesomeIcon icon={faFileUpload} size="6x" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="hidden"
        />

        <footer className="flex flex-col gap-5 w-full">
          <Button
            className="w-full bg-blue-200"
            variant="soft"
            onClick={handleFileSelect}
            loading={isUploading}
            disabled={isUploading || isDownloading}
          >
            {isUploading ? "Subiendo..." : "Subir archivo"}
          </Button>

          <Button
            className="w-full"
            variant="solid-blue"
            onClick={handleDownloadTemplate}
            loading={isDownloading}
            disabled={isUploading || isDownloading}
          >
            Descargar plantilla de ejemplo
          </Button>
        </footer>
      </section>
    </Modal>
  );
};

export default ImportCompaniesModal;
