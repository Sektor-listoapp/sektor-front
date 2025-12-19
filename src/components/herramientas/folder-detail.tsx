/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faTrash,
  faPencil,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/button";
import { Upload, Modal } from "antd";
import Switch from "@/components/ui/switch";
import TextInput from "@/components/ui/text-input";
import CreateSubfolderModal from "./create-subfolder-modal";
import EditModuleModal from "./edit-module-modal";
import { Query, Mutation, ModuleType, ModuleFileType } from "@/lib/sektor-api/__generated__/types";
import { MODULE_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { UPDATE_MODULE, UPLOAD_FILE_TO_MODULE, DELETE_FILE_FROM_MODULE, DELETE_MODULE } from "@/lib/sektor-api/mutations";
import { toast } from "react-toastify";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { ROUTES } from "@/constants/router";
import { quillDeltaToText } from "@/utils/quill-delta-to-text";

interface FolderDetailProps {
  folderId: string;
  subfolderId?: string;
  folderName: string;
}

const FolderDetail: React.FC<FolderDetailProps> = ({
  folderId,
  subfolderId,
  folderName,
}) => {
  const router = useRouter();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isCreateSubfolderModalOpen, setIsCreateSubfolderModalOpen] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState(false);
  const [isDeletingSubfolder, setIsDeletingSubfolder] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [editingSubfolder, setEditingSubfolder] = useState<ModuleType | null>(null);
  const [subfolderToDelete, setSubfolderToDelete] = useState<string | null>(null);


  const moduleId = subfolderId || folderId;
  const { data: moduleData, loading: isLoadingModule, error: moduleError, refetch: refetchModule } = useQuery<Query>(
    MODULE_BY_ID_QUERY,
    {
      variables: { id: moduleId },
      fetchPolicy: "no-cache",
      skip: !moduleId,
    }
  );

  const [updateModule, { loading: isUpdatingModule }] = useMutation<Mutation>(UPDATE_MODULE);
  const [uploadFileToModule, { loading: isUploadingFile }] = useMutation<Mutation>(UPLOAD_FILE_TO_MODULE);
  const [deleteFileFromModule] = useMutation<Mutation>(DELETE_FILE_FROM_MODULE);
  const [deleteModule] = useMutation<Mutation>(DELETE_MODULE);

  // eslint-disable-next-line @next/next/no-assign-module-variable
  const module = moduleData?.moduleById;
  const files = module?.files || [];
  const subfolders = module?.children || [];
  const isFinalFolder = module?.latest || false;

  const getModuleIcon = (icon: string | null | undefined): string => {
    if (icon && typeof icon === 'string' && icon.trim()) {
      return icon;
    }
    return "icon1";
  };

  const handleBack = () => {
    if (subfolderId) {
      router.push(`${ROUTES.MODULES}?folderId=${folderId}`);
    } else {
      router.push(ROUTES.MODULES);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = async (info: any) => {
    try {
      await uploadFileToModule({
        variables: {
          moduleId: moduleId,
          file: info.file.originFileObj || info.file,
        },
      });
      toast.success("Archivo subido correctamente");
      refetchModule();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo subir el archivo");
      throw error;
    }
  };

  const handleDeleteFileClick = (fileId: string) => {
    setFileToDelete(fileId);
  };

  const handleConfirmDeleteFile = async () => {
    if (!fileToDelete) return;

    setIsDeletingFile(true);
    try {
      await deleteFileFromModule({
        variables: {
          moduleId: moduleId,
          fileId: fileToDelete,
        },
      });
      toast.success("Archivo eliminado correctamente");
      refetchModule();
      setFileToDelete(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo eliminar el archivo");
    } finally {
      setIsDeletingFile(false);
    }
  };

  const handleSubfolderClick = (subfolderId: string) => {
    router.push(`${ROUTES.MODULES}?folderId=${folderId}&subfolderId=${subfolderId}`);
  };

  const handleDeleteSubfolderClick = (id: string) => {
    setSubfolderToDelete(id);
  };

  const handleConfirmDeleteSubfolder = async () => {
    if (!subfolderToDelete) return;

    setIsDeletingSubfolder(true);
    try {
      await deleteModule({ variables: { id: subfolderToDelete } });
      toast.success("Subcarpeta eliminada correctamente");
      refetchModule();
      setSubfolderToDelete(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo eliminar la subcarpeta");
    } finally {
      setIsDeletingSubfolder(false);
    }
  };

  const handleEditSubfolder = (subfolder: ModuleType) => {
    setEditingSubfolder(subfolder);
  };

  const handleEditSubfolderComplete = () => {
    setEditingSubfolder(null);
    refetchModule();
  };

  const handleCreateSubfolder = () => {
    refetchModule();
    setIsCreateSubfolderModalOpen(false);
  };

  const handleTitleSave = async (newTitle: string) => {
    if (!module || !newTitle.trim()) return;

    try {
      await updateModule({
        variables: {
          id: module._id,
          input: { title: newTitle },
        },
      });
      setIsEditingTitle(false);
      refetchModule();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar el título");
    }
  };

  const handleDescriptionSave = async (newDescription: string) => {
    if (!module) return;

    try {
      await updateModule({
        variables: {
          id: module._id,
          input: { description: newDescription },
        },
      });
      setIsEditingDescription(false);
      refetchModule();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar la descripción");
    }
  };

  const handleFinalFolderToggle = async (checked: boolean) => {
    if (!module) return;

    try {
      await updateModule({
        variables: {
          id: module._id,
          input: { latest: checked },
        },
      });
      refetchModule();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo actualizar el estado");
    }
  };

  const startEditingTitle = () => {
    setEditedTitle(module?.title || "");
    setIsEditingTitle(true);
  };

  const startEditingDescription = () => {
    setEditedDescription(module?.description || "");
    setIsEditingDescription(true);
  };

  if (isLoadingModule) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FullScreenLoaderLogo className="w-32" />
      </div>
    );
  }

  if (moduleError || !module) {
    return (
      <section className="w-full">
        <p className="text-red-500 text-center py-8">
          Error al cargar el módulo. Por favor intenta de nuevo más tarde.
        </p>
      </section>
    );
  }


  if (subfolderId) {
    return (
      <section className="w-full flex flex-col gap-8">

        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <span className="text-xl font-medium text-blue-500">{folderName}</span>
        </div>


        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEditingTitle ? (
              <TextInput
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={() => handleTitleSave(editedTitle)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleTitleSave(editedTitle);
                  }
                }}
                className="text-xl font-medium !border-gray-300"
                autoFocus
              />
            ) : (
              <h1
                className="text-xl font-medium text-blue-500 flex items-center gap-2 cursor-pointer hover:text-blue-400"
                onClick={startEditingTitle}
              >
                {module.title}
                <FontAwesomeIcon icon={faPencil} size="sm" />
              </h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-sm">¿Es carpeta final?</span>
            <Switch
              checked={isFinalFolder}
              onChange={handleFinalFolderToggle}
              disabled={isUpdatingModule}
            />
          </div>
        </div>


        <div className="relative">
          {isEditingDescription ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onBlur={() => handleDescriptionSave(editedDescription)}
              className="w-full py-3 px-5 border border-gray-300 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 font-century-gothic min-h-[150px] resize-y"
              autoFocus
            />
          ) : (
            <div className="relative">
              <div className="max-h-[300px] overflow-y-auto pr-4">
                <p className="text-gray-600 whitespace-pre-wrap text-sm">
                  {quillDeltaToText(module.description) || "Sin descripción"}
                </p>
              </div>
              <button
                onClick={startEditingDescription}
                className="text-blue-500 hover:text-blue-400 text-sm underline mt-2"
              >
                Editar texto
              </button>
            </div>
          )}
        </div>


        {!isFinalFolder && (
          <div>
            <Button
              variant="solid-blue"
              onClick={() => setIsCreateSubfolderModalOpen(true)}
              className="!rounded-lg !px-6 mb-4"
            >
              Crear submódulo
            </Button>
          </div>
        )}

        <div className="pt-4">
          <p className="text-sm text-gray-500 mb-4">Archivos descargables</p>

          <Upload
            showUploadList={false}
            customRequest={({ file, onSuccess, onError }) => {
              handleFileUpload({ file: { originFileObj: file, status: "done" } })
                .then(() => onSuccess?.("ok"))
                .catch((error) => onError?.(error));
            }}
          >
            <Button variant="solid-blue" className="mb-4 !rounded-lg !px-6" loading={isUploadingFile}>
              Subir archivo
            </Button>
          </Upload>

          <div className="flex flex-col">
            {files.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay archivos</p>
            ) : (
              files.map((file: ModuleFileType) => (
                <div
                  key={file._id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <FontAwesomeIcon icon={faFileAlt} className="text-blue-500" />
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 font-medium"
                    >
                      {file.originalName || file.fileName}
                    </a>
                  </div>
                  <button
                    onClick={() => handleDeleteFileClick(file._id)}
                    className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                    disabled={isDeletingFile}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <CreateSubfolderModal
          open={isCreateSubfolderModalOpen}
          onClose={() => setIsCreateSubfolderModalOpen(false)}
          onCreate={handleCreateSubfolder}
          parentId={subfolderId || folderId}
          isSubmodule={!!subfolderId}
        />
      </section>
    );
  }


  return (
    <section className="w-full flex flex-col gap-8">
      {/* Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="text-blue-500 hover:text-blue-400 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </button>
        <h1 className="text-xl font-medium text-blue-500">{folderName}</h1>
      </div>

      <div className="relative">
        {isEditingDescription ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            onBlur={() => handleDescriptionSave(editedDescription)}
            className="w-full py-3 px-5 border border-gray-300 rounded-xl text-blue-500 text-sm focus:border-blue-500 focus:ring-blue-500 font-century-gothic min-h-[150px] resize-y"
            autoFocus
          />
        ) : (
          <div className="relative">
            <div className="max-h-[300px] overflow-y-auto pr-4">
              <p className="text-gray-600 whitespace-pre-wrap text-sm">
                {quillDeltaToText(module.description) || "Sin descripción"}
              </p>
            </div>
            <button
              onClick={startEditingDescription}
              className="text-blue-500 hover:text-blue-400 text-sm underline mt-2"
            >
              Editar texto
            </button>
          </div>
        )}
      </div>

      <div className="flex  gap-4">
        {!isFinalFolder && (
          <Button
            variant="solid-blue"
            onClick={() => setIsCreateSubfolderModalOpen(true)}
            className="!rounded-lg px-4 min-w-48"
          >
            Crear submódulo
          </Button>
        )}

        <Upload
          showUploadList={false}
          customRequest={({ file, onSuccess, onError }) => {
            handleFileUpload({ file: { originFileObj: file, status: "done" } })
              .then(() => onSuccess?.("ok"))
              .catch((error) => onError?.(error));
          }}
        >
          <Button variant="solid-blue" loading={isUploadingFile} className="!rounded-lg !px-6">
            Subir dentro de este modulo
          </Button>
        </Upload>
      </div>


      <div>
        <p className="text-sm text-gray-500 mb-4">Subcarpetas</p>
        <div className="flex flex-col">
          {subfolders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay subcarpetas
            </p>
          ) : (
            subfolders.map((subfolder: ModuleType) => {
              const isEmpty = !subfolder.children?.length && (!subfolder.files || subfolder.files.length === 0);
              return (
                <div
                  key={subfolder._id}
                  className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-6 h-6 flex-shrink-0">
                      <img
                        src={`/images/modules-icons/${getModuleIcon(subfolder.icon)}.webp`}
                        alt={getModuleIcon(subfolder.icon)}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Error loading icon:", getModuleIcon(subfolder.icon));
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('icon1.webp')) {
                            target.src = `/images/modules-icons/icon1.webp`;
                          }
                        }}
                      />
                    </div>
                    <span
                      className="text-blue-500 font-medium cursor-pointer hover:text-blue-400"
                      onClick={() => handleSubfolderClick(subfolder._id)}
                    >
                      {subfolder.title}
                    </span>
                    {isEmpty && (
                      <span className="text-gray-400 text-sm">vacío</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleDeleteSubfolderClick(subfolder._id)}
                      className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                      disabled={isDeletingSubfolder}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      onClick={() => handleEditSubfolder(subfolder)}
                      className="text-blue-500 hover:text-blue-400 transition-colors"
                      disabled={isDeletingSubfolder}
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">Archivos subidos</p>
          <div className="flex flex-col">
            {files.map((file: ModuleFileType) => (
              <div
                key={file._id}
                className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon icon={faFileAlt} className="text-blue-500" />
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-400 font-medium"
                  >
                    {file.originalName || file.fileName}
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteFileClick(file._id)}
                  className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                  disabled={isDeletingFile}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <CreateSubfolderModal
        open={isCreateSubfolderModalOpen}
        onClose={() => setIsCreateSubfolderModalOpen(false)}
        onCreate={handleCreateSubfolder}
        parentId={folderId}
      />

      {editingSubfolder && (
        <EditModuleModal
          open={Boolean(editingSubfolder)}
          onClose={() => setEditingSubfolder(null)}
          onEdit={handleEditSubfolderComplete}
          module={editingSubfolder}
        />
      )}

      <Modal
        open={fileToDelete !== null}
        onCancel={() => setFileToDelete(null)}
        footer={null}
        centered
        closable={false}
        className="!w-11/12 !max-w-md"
      >
        <div className="flex flex-col items-center gap-6 py-4 font-century-gothic">
          <h2 className="text-xl font-bold text-blue-500 text-center">
            ¿Seguro que quieres<br />eliminar este archivo?
          </h2>

          <p className="text-gray-500 text-sm text-center">
            Esta acción no se puede deshacer
          </p>

          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="solid-blue"
              className="!bg-red-500 hover:!bg-red-600 !px-8"
              onClick={handleConfirmDeleteFile}
              loading={isDeletingFile}
            >
              Eliminar
            </Button>
            <Button
              variant="outline"
              className="!px-8"
              onClick={() => setFileToDelete(null)}
              disabled={isDeletingFile}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={subfolderToDelete !== null}
        onCancel={() => setSubfolderToDelete(null)}
        footer={null}
        centered
        closable={false}
        className="!w-11/12 !max-w-md"
      >
        <div className="flex flex-col items-center gap-6 py-4 font-century-gothic">
          <h2 className="text-xl font-bold text-blue-500 text-center">
            ¿Seguro que quieres<br />eliminar esta subcarpeta?
          </h2>

          <p className="text-gray-500 text-sm text-center">
            Esta acción no se puede deshacer
          </p>

          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="solid-blue"
              className="!bg-red-500 hover:!bg-red-600 !px-8"
              onClick={handleConfirmDeleteSubfolder}
              loading={isDeletingSubfolder}
            >
              Eliminar
            </Button>
            <Button
              variant="outline"
              className="!px-8"
              onClick={() => setSubfolderToDelete(null)}
              disabled={isDeletingSubfolder}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default FolderDetail;
