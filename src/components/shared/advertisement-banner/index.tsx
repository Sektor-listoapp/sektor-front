import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { ACTIVE_ADVERTISEMENTS_QUERY } from "@/lib/sektor-api/queries";
import { cn } from "@/utils/class-name";

type Advertisement = {
  id: string;
  title: string;
  sponsorName: string;
  url: string;
  imageUrl?: string | null;
};

type ActiveAdvertisementsQuery = {
  activeAdvertisements: Advertisement[];
};

const ROTATION_MS = 10000;
const TICK_MS = 100;

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

const AdvertisementLogo = ({ ad }: { ad: Advertisement }) => {
  const [hasImageError, setHasImageError] = useState(false);

  if (ad.imageUrl && !hasImageError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={ad.imageUrl}
        alt=""
        aria-hidden="true"
        onError={() => setHasImageError(true)}
        className="w-10 h-10 md:w-12 md:h-12 rounded-xl object-cover shrink-0 bg-white"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="w-10 h-10 md:w-12 md:h-12 rounded-xl shrink-0 bg-[#FFF1C7] text-blue-500 font-extrabold text-sm md:text-base flex items-center justify-center"
    >
      {getInitials(ad.sponsorName)}
    </div>
  );
};

const AdvertisementBanner = ({ className }: { className?: string }) => {
  // imageUrl is a presigned S3 URL that expires after 1h, so never reuse cached results
  const { data } = useQuery<ActiveAdvertisementsQuery>(
    ACTIVE_ADVERTISEMENTS_QUERY,
    { fetchPolicy: "network-only" }
  );

  const ads = (data?.activeAdvertisements ?? []).filter(
    (ad) => ad?.url && ad?.title
  );
  const [{ activeIndex, elapsed }, setRotation] = useState({
    activeIndex: 0,
    elapsed: 0,
  });
  const [isPaused, setIsPaused] = useState(false);
  const hasMultipleAds = ads.length > 1;

  useEffect(() => {
    if (!hasMultipleAds || isPaused) return;
    const interval = setInterval(() => {
      setRotation((prev) =>
        prev.elapsed + TICK_MS < ROTATION_MS
          ? { ...prev, elapsed: prev.elapsed + TICK_MS }
          : { activeIndex: (prev.activeIndex + 1) % ads.length, elapsed: 0 }
      );
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [hasMultipleAds, isPaused, ads.length]);

  if (!ads.length) return null;

  const safeIndex = activeIndex % ads.length;
  const ad = ads[safeIndex];

  const goTo = (index: number) => setRotation({ activeIndex: index, elapsed: 0 });

  return (
    <section
      aria-label="Publicidad"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "relative w-full h-[76px] md:h-[84px] rounded-2xl border border-[#E3E8EE] bg-[#F7F9FB] overflow-hidden font-arial-rounded text-blue-500",
        className
      )}
    >
      <a
        key={ad.id}
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="group h-full flex items-center gap-3 md:gap-4 px-3 md:pl-[18px] md:pr-6 animate-ad-in"
      >
        <AdvertisementLogo ad={ad} />
        <div className="flex flex-col gap-1 flex-grow min-w-0">
          <div className="flex items-center gap-2 text-[11px] md:text-xs text-[#5B6B7C]">
            <span className="px-1.5 md:px-2 py-px md:py-0.5 rounded-lg md:rounded-[10px] bg-[#E8EDF2] text-[#3F5163] font-bold tracking-wide">
              Publicidad
            </span>
            <span className="truncate">{ad.sponsorName}</span>
          </div>
          <p className="text-sm md:text-[17px] font-bold leading-tight line-clamp-2 md:truncate">
            {ad.title}
          </p>
        </div>
        <span className="hidden md:flex items-center gap-1.5 h-10 px-[18px] rounded-full border-[1.5px] border-blue-500 font-bold text-sm shrink-0 transition-colors group-hover:bg-blue-500 group-hover:text-white">
          Ver más
          <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
        </span>
        <FontAwesomeIcon
          icon={faChevronRight}
          className="md:hidden w-4 h-4 shrink-0"
          aria-hidden="true"
        />
      </a>

      {hasMultipleAds && (
        <>
          <div className="absolute right-3 md:right-6 top-2 flex gap-1 md:gap-1.5">
            {ads.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Anuncio ${index + 1}`}
                aria-current={index === safeIndex}
                onClick={() => goTo(index)}
                className={cn(
                  "h-1 md:h-1.5 rounded-full p-0 border-0 transition-all duration-300",
                  index === safeIndex
                    ? "w-3.5 md:w-[18px] bg-blue-500"
                    : "w-1 md:w-1.5 bg-[#C9D2DC]"
                )}
              />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="absolute left-0 bottom-0 h-0.5 bg-blue-500/35"
            style={{ width: `${(elapsed / ROTATION_MS) * 100}%` }}
          />
        </>
      )}
    </section>
  );
};

export default AdvertisementBanner;
