import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import { Dialog } from "@headlessui/react";
import Cropper from "react-easy-crop";
import { cropImage, fileToBase64, CropArea } from "@/lib/cropImage";

export interface ImageCropResult {
  file: File;
  url: string;
}

interface ImageCropModalProps {
  /** Image to crop. The modal is open while this is set. */
  file: File | null;
  /** Width / height of the crop area (1 = square, 16 / 9 = banner). */
  aspect?: number;
  /** Shows a round crop guide (avatars). */
  cropShape?: "rect" | "round";
  /** Rounded corners on the output image (profile/logo photos). */
  roundedOutput?: boolean;
  title?: string;
  onConfirm: (result: ImageCropResult) => void;
  onCancel: () => void;
}

/**
 * Modal to zoom and move an image before uploading it — the same
 * experience as the profile photo.
 */
const ImageCropModal: React.FC<ImageCropModalProps> = ({
  file,
  aspect = 1,
  cropShape = "rect",
  roundedOutput = false,
  title = "Ajustar imagen",
  onConfirm,
  onCancel,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
    setImageSrc(null);
    if (!file) return;

    let cancelled = false;
    fileToBase64(file)
      .then((src) => {
        if (!cancelled) setImageSrc(src);
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar la imagen");
      });
    return () => {
      cancelled = true;
    };
  }, [file]);

  const onCropComplete = useCallback(
    (_area: unknown, pixels: CropArea) => setCroppedAreaPixels(pixels),
    []
  );

  const handleConfirm = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels || !file) return;
    try {
      setIsCropping(true);
      setError(null);
      const result = await cropImage(imageSrc, croppedAreaPixels, 0.85, {
        rounded: roundedOutput,
      });
      if (!result.blob) throw new Error();
      const baseName = file.name.replace(/\.[^.]+$/, "") || "imagen";
      const cropped = new File([result.blob], `${baseName}.webp`, {
        type: "image/webp",
      });
      onConfirm({ file: cropped, url: result.url });
    } catch {
      setError("No se pudo procesar la imagen. Intenta con otra.");
    } finally {
      setIsCropping(false);
    }
  }, [imageSrc, croppedAreaPixels, file, roundedOutput, onConfirm]);

  return (
    <Dialog
      open={Boolean(file)}
      onClose={() => !isCropping && onCancel()}
      className="relative z-[9999]"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {title}
            </Dialog.Title>
            <button
              type="button"
              onClick={onCancel}
              disabled={isCropping}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          </div>

          <div className="p-6">
            <div className="relative w-full h-72 sm:h-96 bg-gray-100 rounded-lg overflow-hidden">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  cropShape={cropShape}
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
                      borderRadius: cropShape === "round" ? "50%" : "12px",
                    },
                  }}
                />
              )}
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Arrastra la imagen para moverla y usa la rueda del ratón o el
              control para hacer zoom.
            </p>

            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

            <div className="mt-4 flex flex-col gap-4">
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
                  type="button"
                  onClick={onCancel}
                  disabled={isCropping}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
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
  );
};

export default ImageCropModal;
