import Button from "@/components/ui/button";
import { UPLOAD_ORGANIZATION_TEMPLATE_MUTATION } from "@/lib/sektor-api/mutations/companies/upload-organization-template-mutation";
import { GET_ORGANIZATION_TEMPLATE_QUERY } from "@/lib/sektor-api/queries";

import { useMutation, useQuery } from "@apollo/client";
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

  const { data } = useQuery(GET_ORGANIZATION_TEMPLATE_QUERY);
  const [uploadOrganizationTemplate, { error }] = useMutation(UPLOAD_ORGANIZATION_TEMPLATE_MUTATION);

  console.log(error)

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  const handleClose = () => setOpen(false);

  const handleDownloadTemplate = async () => {
    setIsDownloading(true);

    try {
      const { data: file, name: fileName } = data.organizationTemplate;

      if (file && fileName) {
        const link = document.createElement("a");
        link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${file}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error("No se pudo obtener la plantilla.");
      }
    } catch (error) {
      console.error(error)
      toast.error("Error al descargar la plantilla.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const excel = e.target.files?.[0];

    if (!excel) return;

    if (!excel.name.endsWith(".xlsx") && !excel.name.endsWith(".xls")) {
      toast.error("Por favor, selecciona un archivo Excel válido (.xlsx o .xls)");
      return;
    }


    setIsUploading(true);



    try {
      const file = await fileToBase64(excel);

      const { data } = await uploadOrganizationTemplate({
        variables: { file },
      });


      const result = data?.uploadOrganizationTemplate;


      if (result?.[0]?.status === "success") {
        toast.success("Archivo subido exitosamente");
        handleClose();
      } else {
        if (result?.[0]?.status === "error") {
          toast.error(result[0].message);
        }
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
