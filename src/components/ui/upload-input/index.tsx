import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Upload } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/class-name";
import ImageCropModal, { ImageCropResult } from "@/components/ui/image-crop-modal";

interface UploadInputProps {
  className?: string;
  imageUrl: string | null;
  onImageChange: (imageUrl: string | null, file?: File) => void;
  setIsUploadingLogo: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  error?: boolean;
  setError?: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder?: string;
  aspect?: number;
  enableCrop?: boolean;
}

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

const UploadInput: React.FC<UploadInputProps> = ({
  className,
  imageUrl,
  setError,
  onImageChange,
  setIsUploadingLogo,
  disabled = false,
  error = false,
  placeholder = "Subir foto de perfil",
  aspect = 1,
  enableCrop = true,
}) => {
  const [loadingLocalImage, setLoadingLocalImage] = useState(false);
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const [fileToCrop, setFileToCrop] = useState<File | null>(null);

  const markInvalid = useCallback(() => {
    setShowError(true);
    if (setError) setError(true);
  }, [setError]);

  const markValid = useCallback(() => {
    setShowError(false);
    if (setError) setError(false);
  }, [setError]);

  const processFile = useCallback(
    (file: File) => {
      if (
        !ALLOWED_FILE_TYPES.includes(file.type) ||
        file.size > MAX_SIZE_BYTES
      ) {
        markInvalid();
        return Upload.LIST_IGNORE;
      }

      markValid();

      if (enableCrop) {
        setLocalFileName(file.name);
        setFileToCrop(file);
      } else {
        setLocalFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
          onImageChange(String(reader.result || ""), file);
        };
        reader.readAsDataURL(file);
      }

      // Keep file local — Apollo upload happens on form save
      return false;
    },
    [enableCrop, markInvalid, markValid, onImageChange]
  );

  const handleCropConfirm = useCallback(
    ({ file, url }: ImageCropResult) => {
      setLocalFileName(file.name);
      onImageChange(url, file);
      setFileToCrop(null);
    },
    [onImageChange]
  );

  const handleCropCancel = useCallback(() => {
    setFileToCrop(null);
    setLocalFileName(null);
    setLoadingLocalImage(false);
    setIsUploadingLogo(false);
  }, [setIsUploadingLogo]);

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
        accept="image/jpeg,image/png,image/jpg,image/webp"
        beforeUpload={processFile}
        disabled={disabled}
      >
        <div
          className="flex items-center justify-between gap-2 absolute w-full h-full top-0 left-0 p-4 text-base"
          title={localFileName || placeholder}
        >
          {Boolean(imageUrl?.trim()) && (
            <Image
              src={imageUrl || ""}
              alt=""
              width={50}
              height={50}
              className="max-h-10"
              unoptimized={imageUrl?.startsWith("blob:")}
            />
          )}

          {loadingLocalImage ? (
            <span className="block w-full">Cargando imagen...</span>
          ) : (
            <span className="block w-full truncate">
              {localFileName
                ? localFileName
                : imageUrl?.trim()
                  ? "Imagen cargada"
                  : placeholder}
            </span>
          )}

          <FontAwesomeIcon icon={faArrowUpFromBracket} size="lg" />
        </div>
      </Upload>
      {(showError || error) && (
        <span className="text-red-500 text-xs">
          Debe subir una imagen tipo JPG, PNG, JPEG o WebP con un máximo de 15 MB
          de peso
        </span>
      )}

      <ImageCropModal
        file={fileToCrop}
        aspect={aspect}
        roundedOutput
        title="Recortar imagen"
        onConfirm={handleCropConfirm}
        onCancel={handleCropCancel}
      />
    </div>
  );
};

export default UploadInput;
