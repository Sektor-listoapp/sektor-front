import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch, faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { Modal } from "antd";
import { Query, Mutation, ModuleType } from "@/lib/sektor-api/__generated__/types";
import { ALL_MODULES_QUERY } from "@/lib/sektor-api/queries";
import { DELETE_MODULE } from "@/lib/sektor-api/mutations";
import { ROUTES } from "@/constants/router";
import CreateModuleModal from "./create-module-modal";
import EditModuleModal from "./edit-module-modal";
import FolderDetail from "./folder-detail";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { toast } from "react-toastify";
import { getModuleIcon, getModuleIconPath } from "@/utils/module-icons";

const HerramientasList = () => {
  const router = useRouter();
  const { folderId, subfolderId } = router.query;

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleType | null>(null);
  const [isDeletingModule, setIsDeletingModule] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);

  const { data: modulesData, loading: isLoadingModules, error: modulesError, refetch: refetchModules } = useQuery<Query>(
    ALL_MODULES_QUERY,
    {
      variables: { filter: { parentId: null } },
      fetchPolicy: "no-cache",
    }
  );

  const [deleteModule] = useMutation<Mutation>(DELETE_MODULE);

  const modules = modulesData?.allModules || [];
  const filteredModules = modules.filter((module) =>
    module.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateModule = () => {
    refetchModules();
    setIsCreateModalOpen(false);
  };

  const handleEditModule = () => {
    refetchModules();
    setEditingModule(null);
  };

  const handleDeleteModuleClick = (id: string) => {
    setModuleToDelete(id);
  };

  const handleConfirmDeleteModule = async () => {
    if (!moduleToDelete) return;

    setIsDeletingModule(true);
    try {
      await deleteModule({ variables: { id: moduleToDelete } });
      toast.success("Módulo eliminado correctamente");
      refetchModules();
      setModuleToDelete(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "No se pudo eliminar el módulo");
    } finally {
      setIsDeletingModule(false);
    }
  };

  const handleBack = () => {
    if (subfolderId) {
      router.push(`${ROUTES.MODULES}?folderId=${folderId}`);
    } else if (folderId) {
      router.push(ROUTES.MODULES);
    } else {
      router.push(ROUTES.HOME);
    }
  };


  if (folderId && !subfolderId) {
    const folder = modules.find((m) => m._id === folderId);
    return (
      <FolderDetail
        folderId={folderId as string}
        folderName={folder?.title || "Carpeta"}
      />
    );
  }


  if (subfolderId) {
    const folder = modules.find((m) => m._id === folderId);
    return (
      <FolderDetail
        folderId={folderId as string}
        subfolderId={subfolderId as string}
        folderName={folder?.title || "Carpeta"}
      />
    );
  }

  if (isLoadingModules) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FullScreenLoaderLogo className="w-32" />
      </div>
    );
  }

  if (modulesError) {
    return (
      <div className="w-full py-5">
        <p className="text-red-500 text-center py-8">
          Error al cargar los módulos. Por favor intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="w-full flex flex-col gap-8">
        {/* Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <h1 className="text-xl font-medium text-blue-500">Modulos</h1>
        </div>


        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-[400px]">
            <TextInput
              placeholder="Buscar noticia"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={faSearch}
              iconPosition="end"
              className="!border-gray-300 !rounded-full"
            />
          </div>
          <Button
            variant="solid-blue"
            onClick={() => setIsCreateModalOpen(true)}
            className="!rounded-lg !px-6"
          >
            Crear modulo
          </Button>
        </div>


        <div className="w-full">
          <p className="text-sm text-gray-500 mb-4">Archivos subidos</p>

          <div className="flex flex-col">
            {filteredModules.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No se encontraron módulos
              </p>
            ) : (
              filteredModules.map((module) => {
                const isEmpty = !module.children?.length && (!module.files || module.files.length === 0);

                return (
                  <div
                    key={module._id}
                    className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-6 h-6 flex-shrink-0">
                        <img
                          src={getModuleIconPath(module.icon)}
                          alt={getModuleIcon(module.icon)}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("icon1.")) {
                              target.src = getModuleIconPath("icon1");
                            }
                          }}
                        />
                      </div>
                      <span
                        className="text-blue-500 font-medium cursor-pointer hover:text-blue-400"
                        onClick={() =>
                          router.push(`${ROUTES.MODULES}?folderId=${module._id}`)
                        }
                      >
                        {module.title}
                      </span>
                      {isEmpty && (
                        <span className="text-gray-400 text-sm">vacío</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleDeleteModuleClick(module._id)}
                        className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                        disabled={isDeletingModule}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        onClick={() => setEditingModule(module)}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                        disabled={isDeletingModule}
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
      </section>

      <CreateModuleModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateModule}
      />

      {editingModule && (
        <EditModuleModal
          open={Boolean(editingModule)}
          onClose={() => setEditingModule(null)}
          onEdit={handleEditModule}
          module={editingModule}
        />
      )}

      <Modal
        open={moduleToDelete !== null}
        onCancel={() => setModuleToDelete(null)}
        footer={null}
        centered
        closable={false}
        className="!w-11/12 !max-w-md"
      >
        <div className="flex flex-col items-center gap-6 py-4 font-century-gothic">
          <h2 className="text-xl font-bold text-blue-500 text-center">
            ¿Seguro que quieres<br />eliminar este módulo?
          </h2>

          <p className="text-gray-500 text-sm text-center">
            Esta acción no se puede deshacer
          </p>

          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="solid-blue"
              className="!bg-red-500 hover:!bg-red-600 !px-8"
              onClick={handleConfirmDeleteModule}
              loading={isDeletingModule}
            >
              Eliminar
            </Button>
            <Button
              variant="outline"
              className="!px-8"
              onClick={() => setModuleToDelete(null)}
              disabled={isDeletingModule}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default HerramientasList;
