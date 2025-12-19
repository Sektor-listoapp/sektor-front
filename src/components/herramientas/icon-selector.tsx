import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

interface IconOption {
    value: string;
    label: string;
    imagePath: string;
}

interface IconSelectorProps {
    value: string;
    onChange: (value: string) => void;
    options: IconOption[];
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className="w-full bg-white border border-blue-500 rounded-xl py-3 px-5 cursor-pointer flex items-center justify-between min-h-[46px] hover:border-blue-400 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3 flex-1">
                    {selectedOption ? (
                        <>
                            <div className="relative w-8 h-8 flex-shrink-0">
                                <Image
                                    src={selectedOption.imagePath}
                                    alt={selectedOption.label}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-500 text-sm font-century-gothic">
                            Selecciona un icono
                        </span>
                    )}
                </div>
                <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className="text-blue-500"
                    size="sm"
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                    <div className="flex flex-wrap gap-2 p-3">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${value === option.value
                                        ? "bg-blue-100 border-2 border-blue-500"
                                        : "hover:bg-gray-100 border-2 border-transparent"
                                    }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <div className="relative w-10 h-10 flex-shrink-0">
                                    <Image
                                        src={option.imagePath}
                                        alt={option.label}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconSelector;

