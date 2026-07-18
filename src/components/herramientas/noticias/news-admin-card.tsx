import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import { NewsType, NewsUploadedBy } from "@/lib/sektor-api/__generated__/types";
import Button from "@/components/ui/button";

interface NewsAdminCardProps {
  news: NewsType;
  showAuthorize?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onAuthorize?: () => void;
}

const NewsAdminCard: React.FC<NewsAdminCardProps> = ({
  news,
  showAuthorize = false,
  onEdit,
  onDelete,
  onAuthorize,
}) => {
  const getUploadedByText = (uploadedBy: NewsUploadedBy) => {
    switch (uploadedBy) {
      case NewsUploadedBy.Sektor:
        return "Sektor";
      case NewsUploadedBy.ThirdParty:
        return news.authorName || "Tercero";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0">
      {/* Image */}
      <div className="relative w-[80px] h-[60px] rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={news.photoUrl || "/images/placeholder.webp"}
          alt={news.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-blue-500 font-bold text-sm line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          Subida por: {getUploadedByText(news.uploadedBy)}
        </p>
      </div>

      {/* Date and Time */}
      <div className="text-xs text-gray-400 flex-shrink-0 text-right">
        <p>{news.date}</p>
        <p>{news.time}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-400 transition-colors p-2"
          title="Eliminar"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-400 transition-colors p-2"
          title="Editar"
        >
          <FontAwesomeIcon icon={faPencil} />
        </button>
        {showAuthorize && onAuthorize && (
          <Button
            variant="solid-blue"
            className="!text-xs !py-1 !px-3"
            onClick={onAuthorize}
          >
            Autorizar
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewsAdminCard;

