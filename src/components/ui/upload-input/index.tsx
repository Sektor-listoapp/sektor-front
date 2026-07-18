import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Upload } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/class-name";
import { Dialog } from "@headlessui/react";
import Cropper from "react-easy-crop";
import { cropImage, fileToBase64, CropArea } from "@/lib/cropImage";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [isCropping, setIsCropping] = useState(false);

  const markInvalid = useCallback(() => {
    setShowError(true);
    if (setError) setError(true);
  }, [setError]);

  const markValid = useCallback(() => {
    setShowError(false);
    if (setError) setError(false);
  }, [setError]);

  const openCropper = useCallback(
    async (file: File) => {
      setLoadingLocalImage(true);
      setIsUploadingLogo(true);
      setLocalFileName(file.name);
      try {
        const base64 = await fileToBase64(file);
        setImageSrc(base64);
        setIsModalOpen(true);
        markValid();
      } catch {
        markInvalid();
        setLocalFileName(null);
      } finally {
        setLoadingLocalImage(false);
        setIsUploadingLogo(false);
      }
    },
    [markInvalid, markValid, setIsUploadingLogo]
  );

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
        void openCropper(file);
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
    [enableCrop, markInvalid, markValid, onImageChange, openCropper]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropConfirm = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsCropping(true);
      const result = await cropImage(imageSrc, croppedAreaPixels, aspect);
      if (!result.blob) {
        throw new Error("No se pudo generar la imagen recortada");
      }
      const file = new File([result.blob], "cropped-image.webp", {
        type: "image/webp",
      });
      setLocalFileName(file.name);
      onImageChange(result.url, file);
      setIsModalOpen(false);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch {
      markInvalid();
    } finally {
      setIsCropping(false);
    }
  }, [imageSrc, croppedAreaPixels, aspect, onImageChange, markInvalid]);

  const handleCropCancel = useCallback(() => {
    setIsModalOpen(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
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

      <Dialog
        open={isModalOpen}
        onClose={handleCropCancel}
        className="relative z-[9999]"
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Recortar imagen
              </Dialog.Title>
              <button
                onClick={handleCropCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <div className="p-6">
              {imageSrc && (
                <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    showGrid={false}
                    objectFit="contain"
                    style={{
                      containerStyle: {
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#f3f4f6",
                      },
                      cropAreaStyle: {
                        border: "2px solid #3b82f6",
                        borderRadius: "12px",
                      },
                    }}
                  />
                </div>
              )}

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">
                    Zoom:
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 w-12">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCropCancel}
                    disabled={isCropping}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCropConfirm}
                    disabled={isCropping || !croppedAreaPixels}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isCropping ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faCheck} />
                        Confirmar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UploadInput;
