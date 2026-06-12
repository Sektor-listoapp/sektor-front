import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/utils/class-name";

const ANDROID_DOWNLOAD_URL = "#";
const IOS_DOWNLOAD_URL = "https://apps.apple.com/us/app/sektor/id6751517136";

interface AppDownloadDropdownProps {
  variant?: "light" | "dark";
  className?: string;
}

const AppDownloadDropdown = ({
  variant = "light",
  className,
}: AppDownloadDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "transition-colors focus:outline-none flex items-center gap-1",
          variant === "light"
            ? "text-blue-500 hover:text-blue-400"
            : "text-white hover:text-gray-200"
        )}
      >
        Descarga la app mobile
        <FontAwesomeIcon
          icon={faCaretDown}
          className={cn(
            "text-xs transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[150px]">
          <a
            href={ANDROID_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 text-sm text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors first:rounded-t-lg"
            onClick={() => setIsOpen(false)}
          >
            Android
          </a>
          <div className="border-b border-gray-100" />
          <a
            href={IOS_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 text-sm text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors last:rounded-b-lg"
            onClick={() => setIsOpen(false)}
          >
            iOS
          </a>
        </div>
      )}
    </div>
  );
};

export default AppDownloadDropdown;
