import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { NewsType } from "@/lib/sektor-api/__generated__/types";
import { ROUTES } from "@/constants/router";

interface NewsCardProps {
  news: NewsType;
  variant?: "large" | "small" | "horizontal";
}

const NewsCard: React.FC<NewsCardProps> = ({ news, variant = "horizontal" }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`${ROUTES.NOTICIAS}/${news.id}`);
  };

  if (variant === "large") {
    return (
      <article
        onClick={handleClick}
        className="relative w-full h-[400px] rounded-xl overflow-hidden cursor-pointer group"
      >
        <Image
          src={news.photoUrl || "/images/placeholder.png"}
          alt={news.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-bold mb-2">{news.title}</h3>
          <p className="text-sm text-gray-200 line-clamp-2">{news.description}</p>
        </div>
      </article>
    );
  }

  if (variant === "small") {
    return (
      <article
        onClick={handleClick}
        className="relative w-full h-[180px] rounded-xl overflow-hidden cursor-pointer group"
      >
        <Image
          src={news.photoUrl || "/images/placeholder.png"}
          alt={news.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-sm font-bold line-clamp-2">{news.title}</h3>
        </div>
      </article>
    );
  }

  // horizontal variant (default)
  return (
    <article
      onClick={handleClick}
      className="flex gap-4 cursor-pointer group"
    >
      <div className="relative w-[200px] h-[130px] rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={news.photoUrl || "/images/placeholder.png"}
          alt={news.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <h3 className="text-blue-500 font-bold mb-2 group-hover:text-blue-400 transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-3">{news.description}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>{news.date}</span>
          <span>{news.time}</span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;

