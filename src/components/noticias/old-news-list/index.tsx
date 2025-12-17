import React from "react";
import { useRouter } from "next/router";
import { NewsType } from "@/lib/sektor-api/__generated__/types";
import { ROUTES } from "@/constants/router";

interface OldNewsListProps {
  news: NewsType[];
}

const OldNewsList: React.FC<OldNewsListProps> = ({ news }) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-blue-500 font-bold text-lg mb-4">Noticias viejas</h3>
      <div className="flex flex-col gap-4">
        {news.map((item) => (
          <div
            key={item.id}
            onClick={() => router.push(`${ROUTES.NOTICIAS}/${item.id}`)}
            className="flex items-start gap-2 cursor-pointer group"
          >
            <span className="text-red-500 mt-1">■</span>
            <div className="flex-1">
              <p className="text-blue-500 text-sm group-hover:text-blue-400 transition-colors line-clamp-2">
                {item.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                <span>{item.date}</span>
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OldNewsList;

