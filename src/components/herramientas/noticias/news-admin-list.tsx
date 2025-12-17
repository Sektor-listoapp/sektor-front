import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { Query, Mutation, NewsType, NewsUploadedBy, NewsVisibility } from "@/lib/sektor-api/__generated__/types";
import { ALL_NEWS_QUERY } from "@/lib/sektor-api/queries";
import { DELETE_NEWS, UPDATE_NEWS } from "@/lib/sektor-api/mutations";
import TextInput from "@/components/ui/text-input";
import Select from "@/components/ui/select";
import Button from "@/components/ui/button";
import { Modal } from "antd";
import { toast } from "react-toastify";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";

interface NewsAdminListProps {
    onEdit: (news: NewsType) => void;
    onCreate: () => void;
}

const NewsAdminList: React.FC<NewsAdminListProps> = ({ onEdit, onCreate }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState<string>("");
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState<NewsType | null>(null);

    const { data, loading, error, refetch } = useQuery<Query>(ALL_NEWS_QUERY, {
        fetchPolicy: "no-cache",
    });

    const [deleteNews] = useMutation<Mutation>(DELETE_NEWS);
    const [updateNews] = useMutation<Mutation>(UPDATE_NEWS);

    const allNews = (data?.news || []) as NewsType[];


    const getFilteredNews = () => {
        let filtered = allNews;

        if (filterBy === "pending") {
            filtered = filtered.filter((news) => news.pendingApproval);
        } else if (filterBy === "sektor") {
            filtered = filtered.filter((news) => news.uploadedBy === NewsUploadedBy.Sektor);
        } else if (filterBy === "thirdParty") {
            filtered = filtered.filter((news) => news.uploadedBy === NewsUploadedBy.ThirdParty);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (news) =>
                    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    news.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredNews = getFilteredNews();
    const pendingNews = filteredNews.filter((news) => news.pendingApproval);
    const approvedNews = filteredNews.filter((news) => !news.pendingApproval);

    const handleDelete = async () => {
        if (!newsToDelete) return;

        try {
            await deleteNews({ variables: { id: newsToDelete.id } });
            toast.success("Noticia eliminada correctamente");
            setDeleteModalOpen(false);
            setNewsToDelete(null);
            refetch();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.message || "Error al eliminar la noticia");
        }
    };

    const handleAuthorize = async (news: NewsType) => {
        try {
            await updateNews({
                variables: {
                    id: news.id,
                    input: {
                        title: news.title,
                        description: news.description,
                        type: news.type,
                        pendingApproval: false,
                        visibility: NewsVisibility.Public,
                    },
                },
            });
            toast.success("Noticia autorizada correctamente");
            refetch();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.message || "Error al autorizar la noticia");
        }
    };

    const getUploadedByText = (news: NewsType) => {
        if (news.authorName) {
            return news.authorName;
        }
        return news.uploadedBy === NewsUploadedBy.Sektor ? "Sektor" : "Tercero";
    };

    const filterOptions = [
        { label: "Buscar por", value: "" },
        { label: "Por Autorizar", value: "pending" },
        { label: "Subidas por Sektor", value: "sektor" },
        { label: "Subidas por terceros", value: "thirdParty" },
    ];

    if (loading && !data) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <FullScreenLoaderLogo className="w-32" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-5">
                <p className="text-red-500 text-center py-8">
                    Error al cargar las noticias. Por favor intenta de nuevo más tarde.
                </p>
            </div>
        );
    }

    return (
        <>
            <section className="w-full flex flex-col gap-8">

                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-medium text-blue-500">Administrador de noticias</h1>
                </div>


                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="w-full sm:w-[300px]">
                        <TextInput
                            placeholder="Buscar noticia"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={faSearch}
                            iconPosition="end"
                            className="!border-gray-300 !rounded-full"
                        />
                    </div>
                    <div className="w-full sm:w-[200px]">
                        <Select
                            options={filterOptions}
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="solid-blue"
                        onClick={onCreate}
                        className="!rounded-lg !px-6"
                    >
                        Subir noticia
                    </Button>
                </div>


                {pendingNews.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-blue-500 mb-4">Noticias por autorizar</h2>
                        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                            {pendingNews.map((news) => (
                                <div
                                    key={news.id}
                                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                                >
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={news.photoUrl || "/images/placeholder.png"}
                                            alt={news.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-blue-500 font-bold mb-1 line-clamp-2">{news.title}</h3>
                                        <p className="text-gray-500 text-sm mb-1">
                                            Subida por: {getUploadedByText(news)}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            {news.date} {news.time}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button
                                            onClick={() => {
                                                setNewsToDelete(news);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="lg" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(news)}
                                            className="text-blue-500 hover:text-blue-400 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faPencil} size="lg" />
                                        </button>
                                        <Button
                                            variant="solid-blue"
                                            onClick={() => handleAuthorize(news)}
                                            className="!rounded-lg !px-4 !text-sm"
                                        >
                                            Autorizar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {approvedNews.length > 0 && (
                    <div>
                        <h2 className="text-lg font-bold text-blue-500 mb-4">Noticias subidas</h2>
                        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
                            {approvedNews.map((news) => (
                                <div
                                    key={news.id}
                                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-white"
                                >
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={news.photoUrl || "/images/placeholder.png"}
                                            alt={news.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-blue-500 font-bold mb-1 line-clamp-2">{news.title}</h3>
                                        <p className="text-gray-500 text-sm mb-1">
                                            Subida por: {getUploadedByText(news)}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            {news.date} {news.time}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <button
                                            onClick={() => {
                                                setNewsToDelete(news);
                                                setDeleteModalOpen(true);
                                            }}
                                            className="text-red-500 hover:text-red-400 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faTrash} size="lg" />
                                        </button>
                                        <button
                                            onClick={() => onEdit(news)}
                                            className="text-blue-500 hover:text-blue-400 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faPencil} size="lg" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {filteredNews.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                        No se encontraron noticias
                    </p>
                )}
            </section>


            <Modal
                open={deleteModalOpen}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setNewsToDelete(null);
                }}
                footer={null}
                centered
                className="!w-11/12 md:!w-3/4 lg:!w-1/2 !max-w-lg"
            >
                <div className="p-6 text-blue-500 font-century-gothic">
                    <h2 className="text-2xl font-bold mb-4">
                        ¿Seguro que quieres eliminar esta noticia?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Al eliminarla ya no saldrá en la sección de noticias y desaparecerá del sistema
                    </p>
                    <div className="flex gap-4 justify-end">
                        <Button
                            variant="solid-blue"
                            onClick={() => {
                                setDeleteModalOpen(false);
                                setNewsToDelete(null);
                            }}
                            className="!bg-gray-400 !border-gray-400 hover:!bg-gray-500"
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="solid-blue"
                            onClick={handleDelete}
                            className="!bg-red-500 !border-red-500 hover:!bg-red-600"
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default NewsAdminList;

