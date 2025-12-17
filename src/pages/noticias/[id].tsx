import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import NoticiasHeader from "@/components/noticias/header";
import { NEWS_BY_ID_QUERY } from "@/lib/sektor-api/queries";
import { Query, NewsUploadedBy } from "@/lib/sektor-api/__generated__/types";
import { ROUTES } from "@/constants/router";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { quillDeltaToHtml } from "@/utils/quill-delta-to-html";

const NoticiaDetalle = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data, loading, error } = useQuery<Query>(NEWS_BY_ID_QUERY, {
        variables: { id: id as string },
        skip: !id,
        fetchPolicy: "cache-and-network",
    });

    const news = data?.newsById;

    const getUploadedByText = (uploadedBy: NewsUploadedBy) => {
        switch (uploadedBy) {
            case NewsUploadedBy.Sektor:
                return "Sektor";
            case NewsUploadedBy.ThirdParty:
                return "Tercero";
            default:
                return "Desconocido";
        }
    };

    if (loading && !data) {
        return (
            <div className="min-h-svh bg-gray-800 w-full flex flex-col">
                <NoticiasHeader />
                <div className="flex-1 flex justify-center items-center bg-white">
                    <FullScreenLoaderLogo className="w-32" />
                </div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-svh bg-gray-800 w-full flex flex-col">
                <NoticiasHeader />
                <div className="flex-1 flex justify-center items-center bg-white">
                    <p className="text-red-500">Noticia no encontrada</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-svh bg-gray-800 w-full flex flex-col">
            <NoticiasHeader />

            <main className="flex-1 bg-white w-full">
                <div className="max-w-screen-xl mx-auto px-8 py-8 font-century-gothic">

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => router.push(ROUTES.NOTICIAS)}
                                className="text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                            <h1 className="text-2xl font-bold text-blue-500">
                                {news.title}
                            </h1>
                        </div>

                        <p className="text-gray-500 text-sm ml-7">
                            Noticia subida por: {news.authorName || getUploadedByText(news.uploadedBy)}
                        </p>
                    </div>


                    {news.photoUrl && (
                        <div className="relative w-full h-[500px] mb-8">
                            <Image
                                src={news.photoUrl}
                                alt={news.title}
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                    )}


                    {news.videoUrl && (
                        <div className="mb-8">
                            <video
                                src={news.videoUrl}
                                controls
                                className="w-full"
                            />
                        </div>
                    )}


                    <article className="prose prose-lg max-w-none">
                        <div
                            className="text-gray-700 leading-relaxed text-base"
                            dangerouslySetInnerHTML={{
                                __html: quillDeltaToHtml(news.description)
                            }}
                        />
                    </article>
                </div>
            </main>
        </div>
    );
};

export default NoticiaDetalle;
