import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import withAuth from "@/components/shared/with-auth";
import HerramientasHeader from "@/components/herramientas/header";
import TextInput from "@/components/ui/text-input";
import Button from "@/components/ui/button";
import NewsAdminCard from "@/components/herramientas/noticias/news-admin-card";
import DeleteNewsModal from "@/components/herramientas/noticias/delete-news-modal";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import {
  UserGroups,
  Query,
  NewsType,
  NewsUploadedBy,
  NewsVisibility,
} from "@/lib/sektor-api/__generated__/types";
import { ALL_NEWS_QUERY } from "@/lib/sektor-api/queries";
import { DELETE_NEWS, CHANGE_NEWS_VISIBILITY } from "@/lib/sektor-api/mutations";
import { ROUTES } from "@/constants/router";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { toast } from "react-toastify";

const { Admin } = UserGroups;

type FilterType = "all" | "pending" | "sektor" | "thirdParty";

const HerramientasNoticias = () => {
  const router = useRouter();
  const userGroup = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = userGroup === Admin;

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<NewsType | null>(null);

  const { data, loading, refetch } = useQuery<Query>(ALL_NEWS_QUERY, {
    fetchPolicy: "no-cache",
  });

  const [deleteNews, { loading: deletingNews }] = useMutation(DELETE_NEWS);
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

  const allNews = (data?.news || []) as NewsType[];

  // Debug: Log all news with their pendingApproval status
  console.log("All news loaded:", allNews.length);
  allNews.forEach((news) => {
    console.log(`News "${news.title}": pendingApproval=${news.pendingApproval}, visibility=${news.visibility}`);
  });

  // Separate pending and approved news FIRST
  const allPendingNews = allNews.filter((news) => news.pendingApproval);
  const allApprovedNews = allNews.filter((news) => !news.pendingApproval);
  
  console.log(`Pending news: ${allPendingNews.length}, Approved news: ${allApprovedNews.length}`);

  // Apply search filter
  const matchesSearch = (news: NewsType) => {
    if (!searchTerm) return true;
    return news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           news.description.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Apply type filter
  const matchesTypeFilter = (news: NewsType) => {
    if (filterType === "pending") {
      return news.pendingApproval;
    }
    if (filterType === "sektor") {
      return news.uploadedBy === NewsUploadedBy.Sektor;
    }
    if (filterType === "thirdParty") {
      return news.uploadedBy === NewsUploadedBy.ThirdParty;
    }
    return true; // "all"
  };

  // Filter pending news
  const pendingNews = allPendingNews.filter((news) => 
    matchesSearch(news) && matchesTypeFilter(news)
  );

  // Filter approved news
  const approvedNews = allApprovedNews.filter((news) => 
    matchesSearch(news) && matchesTypeFilter(news)
  );

  const handleDelete = async () => {
    if (!newsToDelete) return;

    try {
      await deleteNews({ variables: { id: newsToDelete.id } });
      toast.success("Noticia eliminada correctamente");
      setNewsToDelete(null);
      refetch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "Error al eliminar la noticia");
    }
  };

  const handleAuthorize = async (news: NewsType) => {
    try {
      await changeVisibility({
        variables: {
          id: news.id,
          visibility: NewsVisibility.Public as string,
        },
      });
      toast.success("Noticia autorizada correctamente");
      await refetch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message || "Error al autorizar la noticia");
    }
  };

  const filterOptions = [
    { value: "all", label: "Todas" },
    { value: "pending", label: "Por Autorizar" },
    { value: "sektor", label: "Subidas por Sektor" },
    { value: "thirdParty", label: "Subidas por Terceros" },
  ];

  if (checkingAccess) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-svh bg-white w-full flex flex-col">
        <HerramientasHeader />
        <div className="flex-1 flex justify-center items-center">
          <FullScreenLoaderLogo className="w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-white w-full flex flex-col">
      <HerramientasHeader />

      <main className="flex-1 w-11/12 max-w-screen-xl mx-auto py-8 font-century-gothic">
        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push(ROUTES.HERRAMIENTAS)}
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <h1 className="text-xl font-medium text-blue-500">
            Administrador de noticias
          </h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex flex-1 gap-4 items-center w-full sm:w-auto">
            <div className="flex-1 sm:w-[300px]">
              <TextInput
                placeholder="Buscar noticia"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={faSearch}
                iconPosition="end"
                className="!border-gray-300 !rounded-lg"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 text-blue-500 text-sm border border-gray-300 rounded-lg px-4 py-2.5"
              >
                Buscar por
                <FontAwesomeIcon icon={faChevronDown} className="text-xs" />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[180px] z-50">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilterType(option.value as FilterType);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                        filterType === option.value
                          ? "text-blue-500 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            variant="solid-blue"
            onClick={() => router.push(`${ROUTES.ADMIN_NEWS}/crear`)}
            className="!rounded-lg !px-6"
          >
            Subir noticia
          </Button>
        </div>

        {/* Pending News Section */}
        {pendingNews.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-medium text-blue-500 mb-4">
              Noticias por autorizar
            </h2>
            <div className="flex flex-col">
              {pendingNews.map((news) => (
                <NewsAdminCard
                  key={news.id}
                  news={news}
                  showAuthorize
                  onEdit={() => {
                    console.log("Editing pending news, ID:", news.id, "Type:", typeof news.id);
                    router.push(`${ROUTES.ADMIN_NEWS}/${String(news.id)}`);
                  }}
                  onDelete={() => setNewsToDelete(news)}
                  onAuthorize={() => handleAuthorize(news)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Approved News Section */}
        <section>
          <h2 className="text-lg font-medium text-blue-500 mb-4">
            Noticias subidas
          </h2>
          <div className="flex flex-col">
            {approvedNews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay noticias publicadas
              </p>
            ) : (
              approvedNews.map((news) => (
                <NewsAdminCard
                  key={news.id}
                  news={news}
                  onEdit={() => {
                    console.log("Editing approved news, ID:", news.id, "Type:", typeof news.id);
                    router.push(`${ROUTES.ADMIN_NEWS}/${String(news.id)}`);
                  }}
                  onDelete={() => setNewsToDelete(news)}
                />
              ))
            )}
          </div>
        </section>
      </main>

      {/* Delete Modal */}
      <DeleteNewsModal
        open={Boolean(newsToDelete)}
        onClose={() => setNewsToDelete(null)}
        onConfirm={handleDelete}
        loading={deletingNews}
      />
    </div>
  );
};

export default withAuth(HerramientasNoticias);

