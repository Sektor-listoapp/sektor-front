import React, { useState } from "react";
import Image from "next/image";
import { Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import { toast } from "react-toastify";
import { getBase64 } from "./utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/class-name";

interface UploadInputProps {
  className?: string;
  imageUrl: string;
  onImageChange: (imageUrl: string) => void;
  disabled?: boolean;
}

const UploadInput: React.FC<UploadInputProps> = ({
  className,
  imageUrl,
  onImageChange,
  disabled = false,
}) => {
  const [loadingLocalImage, setLoadingLocalImage] = useState(false);
  const [localImageFile, setLocalImageFile] =
    useState<UploadFile<unknown> | null>(null);

  const handleChange = (info: UploadChangeParam<UploadFile<unknown>>) => {
    const { type, status, size } = info?.file;
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedFileTypes.includes(type || "")) {
      toast.error(
        "Debe subir una imagen tipo JPG, PNG o JPEG con un maximo de 2 MB de peso"
      );
      return;
    }
    if ((size || 0) > 2000000) {
      toast.error(
        "Debe subir una imagen tipo JPG, PNG o JPEG con un maximo de 2 MB de peso"
      );
      return;
    }
    if (status === "uploading") {
      setLoadingLocalImage(true);
      return;
    }
    if (status === "done") {
      setLocalImageFile(info.file);
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoadingLocalImage(false);
        onImageChange(imageUrl);
      });
    }
  };

  return (
    <Upload
      className={cn(
        "w-full border rounded-xl font-century-gothic h-12 p-4 border-blue-500 relative cursor-pointer",
        className
      )}
      name="localLogo"
      listType="picture"
      showUploadList={false}
      onChange={handleChange}
      disabled={disabled}
    >
      <div
        className="flex items-center justify-between gap-2 absolute w-full h-full top-0 left-0 p-4 text-base"
        title={localImageFile?.name || "Subir foto de perfil"}
      >
        {Boolean(imageUrl.trim()) && (
          <Image
            src={imageUrl}
            alt=""
            width={50}
            height={50}
            className="max-h-10"
          />
        )}

        {loadingLocalImage ? (
          <span className="block w-full">Cargando imagen...</span>
        ) : (
          <span className="block w-full truncate">
            {(!localImageFile?.name && !imageUrl?.trim()) ||
            (localImageFile?.name && !imageUrl?.trim())
              ? "Subir foto de perfil"
              : ""}
            {localImageFile?.name && imageUrl.trim() && localImageFile?.name}
            {!localImageFile?.name && imageUrl.trim() && "Imagen cargada"}
          </span>
        )}

        <FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />
      </div>
    </Upload>
  );
};

export default UploadInput;
