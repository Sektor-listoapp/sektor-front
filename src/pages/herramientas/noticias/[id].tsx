import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCamera } from "@fortawesome/free-solid-svg-icons";
import { Upload } from "antd";
import withAuth from "@/components/shared/with-auth";
import HerramientasHeader from "@/components/herramientas/header";
import Button from "@/components/ui/button";
import RoleSelector from "@/components/herramientas/noticias/role-selector";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import {
  UserGroups,
  NewsUploadedBy,
  NewsVisibility,
  Query,
  NewsType,
} from "@/lib/sektor-api/__generated__/types";
import { ALL_NEWS_QUERY } from "@/lib/sektor-api/queries";
import { UPDATE_NEWS, CHANGE_NEWS_VISIBILITY } from "@/lib/sektor-api/mutations";
import { ROUTES } from "@/constants/router";
import { toast } from "react-toastify";
import { cn } from "@/utils/class-name";
import { quillDeltaToText } from "@/utils/quill-delta-to-text";

const { Admin } = UserGroups;

const EditarNoticia = () => {
  const router = useRouter();
  const { id } = router.query;
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = userGroup === Admin;

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowedRoles, setAllowedRoles] = useState<UserGroups[]>([]);

  const { data, loading, error: queryError } = useQuery<Query>(ALL_NEWS_QUERY, {
    fetchPolicy: "network-only",
  });


  const news = React.useMemo(() => {
    if (!data?.news || !id) return null;
    const allNews = data.news as NewsType[];
    const foundNews = allNews.find((n) => String(n.id) === String(id));

    return foundNews || null;
  }, [data?.news, id]);


  useEffect(() => {
    if (news) {
      console.log("Setting news data:", news);
      setTitle(news.title);
      setDescription(quillDeltaToText(news.description));
      setVideoUrl(news.videoUrl || "");
      setPhotoPreview(news.photoUrl || null);
      setAllowedRoles((news.allowedRoles as UserGroups[]) || []);

      if (news.videoUrl) {
        setMediaType("video");
      } else {
        setMediaType("photo");
      }
    }
  }, [news]);

  const [updateNews, { loading: updating }] = useMutation(UPDATE_NEWS);
  const [changeVisibility, { loading: changingVisibility }] = useMutation(CHANGE_NEWS_VISIBILITY);

  useEffect(() => {
    if (!userGroup) return;
    if (!isAdmin) {
      router.push(ROUTES.HOME);
    } else {
      setCheckingAccess(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGroup]);

  const getUploadedByText = (uploadedBy: NewsUploadedBy) => {
    switch (uploadedBy) {
      case NewsUploadedBy.Sektor:
        return "Sektor";
      case NewsUploadedBy.ThirdParty:
        return news?.authorName || "Tercero";
      default:
        return "Desconocido";
    }
  };

  const handlePhotoChange = (info: { file: File }) => {
    const file = info.file;
    setPhoto(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      toast.error("Por favor completa el título y la descripción");
      return;
    }

    try {
      await updateNews({
        variables: {
          id: id as string,
          input: {
            title,
            description,
            videoUrl: mediaType === "video" ? videoUrl : undefined,
            allowedRoles: allowedRoles.length > 0 ? allowedRoles : undefined,
          },
          photo: mediaType === "photo" ? photo : undefined,
        },
      });
      toast.success("Noticia actualizada correctamente");
      router.push(ROUTES.ADMIN_NEWS);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "Error al actualizar la noticia");
    }
  };

  const handleAuthorize = async () => {
    try {
      await changeVisibility({
        variables: {
          id: id as string,
          visibility: NewsVisibility.Public as string,
        },
      });
      toast.success("Noticia autorizada correctamente");
      router.push(ROUTES.ADMIN_NEWS);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "Error al autorizar la noticia");
    }
  };

  if (checkingAccess) {
    return null;
  }

  if (loading && !data) {
    return (
      <div className="min-h-svh bg-white w-full flex flex-col">
        <HerramientasHeader />
        <div className="flex-1 flex justify-center items-center">
          <FullScreenLoaderLogo className="w-32" />
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-svh bg-white w-full flex flex-col">
        <HerramientasHeader />
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <p className="text-red-500">Noticia no encontrada</p>
          {queryError && (
            <p className="text-gray-500 text-sm">
              Error: {queryError.message}
            </p>
          )}
          <p className="text-gray-500 text-sm">
            ID buscado: {id as string}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.ADMIN_NEWS)}
          >
            Volver a noticias
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-white w-full flex flex-col">
      <HerramientasHeader />

      <main className="flex-1 w-11/12 max-w-screen-md mx-auto py-8 font-century-gothic">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(ROUTES.ADMIN_NEWS)}
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>
            <h1 className="text-lg text-blue-500">
              Editar noticia
            </h1>
          </div>

          {news.pendingApproval && (
            <Button
              variant="solid-blue"
              onClick={handleAuthorize}
              loading={changingVisibility}
              className="!rounded-full"
            >
              Autorizar
            </Button>
          )}
        </div>

        {/* Author Info */}
        <p className="text-gray-400 text-xs mb-8 ml-8">
          Subida por: {news.authorName || getUploadedByText(news.uploadedBy)}
        </p>

        {/* Media Type Toggle */}
        <div className="flex flex-wrap mb-2">
          <button
            onClick={() => setMediaType("photo")}
            className={cn(
              "px-4 sm:px-5 py-2 rounded-l-full text-xs sm:text-sm font-medium transition-colors duration-300 border",
              mediaType === "photo"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-[#D9D9D9] text-white border-[#D9D9D9]"
            )}
          >
            Subir foto
          </button>
          <button
            onClick={() => setMediaType("video")}
            className={cn(
              "px-4 sm:px-5 py-2 rounded-r-full text-xs sm:text-sm font-medium transition-colors duration-300 border",
              mediaType === "video"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-[#D9D9D9] text-white border-[#D9D9D9]"
            )}
          >
            Subir link video
          </button>
        </div>

        <p className="text-gray-400 text-xs mb-6 flex items-center gap-1">
          <span className="text-gray-400">ℹ</span>
          Sin multimedia, el logo de sektor sera la Imagen
        </p>

        {/* Media Upload */}
        <div className="mb-10 w-full max-w-[700px]">
          <p className="text-gray-400 text-xs mb-3">
            Este es el archivo multimedia que verán junto a la noticia
          </p>

          {mediaType === "photo" ? (
            <div className="upload-full-width w-full">
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={(file) => {
                  handlePhotoChange({ file });
                  return false;
                }}
              >
                <div className="w-full h-[200px] sm:h-[280px] md:h-[330px] border border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors bg-gray-100">
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={faCamera}
                        className="text-4xl text-gray-400 mb-2"
                      />
                      <span className="text-blue-500 text-sm underline">Subir foto</span>
                    </>
                  )}
                </div>
              </Upload>
            </div>
          ) : (
            <input
              type="text"
              placeholder="URL del video (YouTube, Vimeo, etc.)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-3 py-2 focus:outline-none text-gray-700 bg-gray-100 rounded-lg text-sm"
            />
          )}
        </div>

        {/* Title Input */}
        <div className="mb-10">
          <div className="flex items-center gap-1 mb-3">
            <span className="text-blue-500 text-sm">Titulo de la noticia</span>
          </div>
          <input
            type="text"
            placeholder=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full sm:max-w-sm px-3 py-2 focus:outline-none text-gray-700 bg-gray-100 rounded-lg text-sm"
          />
        </div>

        {/* Description Editor */}
        <div className="mb-10">
          <p className="text-blue-500 text-sm mb-3">Desarrolla la noticia</p>
          <div className="relative w-full max-w-[700px]">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              className="w-full min-h-[140px] sm:min-h-[160px] p-4 pr-20 resize-none focus:outline-none text-gray-700 text-sm bg-gray-100 rounded-lg border-0"
            />

            <div className="absolute top-3 right-3 flex items-center gap-2 text-xs">
              <button
                onClick={() => {
                  const textarea = document.getElementById("description") as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const selectedText = description.substring(start, end);
                  const newText = description.substring(0, start) + `**${selectedText}**` + description.substring(end);
                  setDescription(newText);
                }}
                className="font-bold text-gray-500 hover:text-blue-500"
                title="Negrita"
              >
                N
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">Color</span>
            </div>
          </div>
        </div>

        {/* Role Selector */}
        <div className="mb-10">
          <p className="text-blue-500 text-sm mb-4">¿Quién puede ver tu noticia?</p>
          <RoleSelector
            selectedRoles={allowedRoles as UserGroups[]}
            onChange={setAllowedRoles}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Button
            variant="solid-blue"
            onClick={handleSubmit}
            loading={updating}
            className="!px-8 !rounded-full"
          >
            Guardar cambios
          </Button>
        </div>
      </main>
    </div>
  );
};

export default withAuth(EditarNoticia);
