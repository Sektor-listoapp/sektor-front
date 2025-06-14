import React, { useState } from "react";
import Image from "next/image";
import { Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import { getBase64 } from "./utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/class-name";

interface UploadInputProps {
  className?: string;
  imageUrl: string | null;
  onImageChange: (imageUrl: string | null) => void;
  setIsUploadingLogo: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  error?: boolean;
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder?: string;
}

const UploadInput: React.FC<UploadInputProps> = ({
  className,
  imageUrl,
  setError,
  onImageChange,
  setIsUploadingLogo,
  disabled = false,
  error = false,
  placeholder = "Subir foto de perfil",
}) => {
  const [loadingLocalImage, setLoadingLocalImage] = useState(false);
  const [localImageFile, setLocalImageFile] =
    useState<UploadFile<unknown> | null>(null);

  const [showError, setShowError] = useState(false);

  const handleChange = (info: UploadChangeParam<UploadFile<unknown>>) => {
    const { type, status, size } = info?.file;
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedFileTypes.includes(type || "") || (size || 0) > 2000000) {
      setShowError(true);
      if (setError) setError(true);
      return;
    }

    setShowError(false);
    if (setError) setError(false);

    if (status === "uploading") {
      setLoadingLocalImage(true);
      setIsUploadingLogo(true);
      return;
    }
    if (status === "done") {
      setLocalImageFile(info.file);
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoadingLocalImage(false);
        setIsUploadingLogo(false);
        onImageChange(imageUrl);
      });
    }
  };

  return (
    <div className="relative flex flex-col items-start justify-center w-full">
      <Upload
        className={cn(
          "w-full border rounded-xl font-century-gothic h-12 p-4 border-blue-500 relative cursor-pointer",
          className,
          (showError || error) && "border-red-500"
        )}
        name="localLogo"
        listType="picture"
        showUploadList={false}
        onChange={handleChange}
        disabled={disabled}
      >
        <div
          className="flex items-center justify-between gap-2 absolute w-full h-full top-0 left-0 p-4 text-base"
          title={localImageFile?.name || placeholder}
        >
          {Boolean(imageUrl?.trim()) && (
            <Image
              src={imageUrl || ""}
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
                ? placeholder
                : ""}
              {localImageFile?.name && imageUrl?.trim() && localImageFile?.name}
              {!localImageFile?.name && imageUrl?.trim() && "Imagen cargada"}
            </span>
          )}

          <FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />
        </div>
      </Upload>
      {(showError || error) && (
        <span className="text-red-500 text-xs">
          Debe subir una imagen tipo JPG, PNG o JPEG con un maximo de 2 MB de
          peso
        </span>
      )}
    </div>
  );
};

export default UploadInput;
