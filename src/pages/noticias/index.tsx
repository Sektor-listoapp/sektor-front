import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import NoticiasHeader from "@/components/noticias/header";
import NewsCard from "@/components/noticias/news-card";
import OldNewsList from "@/components/noticias/old-news-list";
import { ALL_NEWS_QUERY, HOME_NEWS_QUERY } from "@/lib/sektor-api/queries";
import {
  Query,
  NewsType,
  NewsVisibility,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";

const { Admin, News } = UserGroups;

const NoticiasPage = () => {
  const { accessToken, userGroup } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      userGroup: state.user?.group,
    }))
  );

  const canLoadAllPublished =
    Boolean(accessToken) && (userGroup === Admin || userGroup === News);

  const {
    data: publishedData,
    loading: publishedLoading,
    error: publishedError,
  } = useQuery<Query>(ALL_NEWS_QUERY, {
    variables: { filter: { pendingApproval: false } },
    skip: !canLoadAllPublished,
    fetchPolicy: "network-only",
  });

  const {
    data: homeData,
    loading: homeLoading,
    error: homeError,
  } = useQuery<Query>(HOME_NEWS_QUERY, {
    fetchPolicy: "network-only",
  });

  const allNews = useMemo(() => {
    // Full published list for admin/news roles (matches herramientas)
    if (canLoadAllPublished && publishedData?.news) {
      return (publishedData.news as NewsType[]).filter(
        (news) =>
          !news.pendingApproval && news.visibility === NewsVisibility.Public
      );
    }
    // Public visitors: homeNews feed
    return (homeData?.homeNews || []) as NewsType[];
  }, [canLoadAllPublished, publishedData, homeData]);

  const featuredNews = allNews.slice(0, 3);
  const moreNews = allNews.slice(3);
  const oldNews = allNews.slice(7);

  const loading =
    ((canLoadAllPublished && publishedLoading) || homeLoading) &&
    allNews.length === 0;
  const error =
    (canLoadAllPublished
      ? Boolean(publishedError) && Boolean(homeError)
      : Boolean(homeError)) && allNews.length === 0;

  if (loading) {
    return (
      <div className="min-h-svh bg-gray-50 w-full flex flex-col">
        <NoticiasHeader />
        <div className="flex-1 flex justify-center items-center">
          <FullScreenLoaderLogo className="w-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-svh bg-gray-50 w-full flex flex-col">
        <NoticiasHeader />
        <div className="flex-1 flex justify-center items-center">
          <p className="text-red-500">Error al cargar las noticias</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-gray-50 w-full flex flex-col">
      <NoticiasHeader />

      <main className="flex-1 w-11/12 max-w-screen-xl mx-auto py-8 font-century-gothic">
        <section className="mb-12">
          <h1 className="text-2xl font-bold text-blue-500 mb-6">
            Ultimas noticias del Sektor asegurador
          </h1>

          {featuredNews.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {featuredNews[0] && (
                  <NewsCard news={featuredNews[0]} variant="large" />
                )}
              </div>

              <div className="flex flex-col gap-4">
                {featuredNews[1] && (
                  <NewsCard news={featuredNews[1]} variant="small" />
                )}
                {featuredNews[2] && (
                  <NewsCard news={featuredNews[2]} variant="small" />
                )}
              </div>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-blue-500 mb-6">Más noticias</h2>
            <div className="flex flex-col gap-6">
              {moreNews.length > 0 ? (
                moreNews.map((news) => (
                  <NewsCard key={news.id} news={news} variant="horizontal" />
                ))
              ) : (
                <p className="text-gray-500">No hay más noticias disponibles</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <OldNewsList news={oldNews} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default NoticiasPage;
