import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";




export const CustomDropdown = ({ options, placeholder, value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: { value: string; label: string }) => {
        setSelectedValue(option.value);
        onChange?.(option.value);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === selectedValue);

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div
                className="w-full bg-white border border-[#00000033] rounded-[30px] p-2 cursor-pointer flex items-center justify-between hover:border-[#00000066] transition-colors min-h-[46px]"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={`text-[10px] md:text-xs ${selectedValue ? 'text-gray-800' : 'text-gray-500'} truncate flex-1`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <div className="hidden md:block flex-shrink-0 ml-2">
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        className={`text-[#182F48] transition-transform  ${isOpen ? 'rotate-180' : ''}`}
                        size="lg"
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto w-full md:w-[200px]">
                    {options.length === 0 ? (
                        <div className="px-2 py-3 text-xs text-gray-500 text-center">
                            No hay opciones disponibles
                        </div>
                    ) : (
                        options.map((option, index) => (
                            <div key={option.value}>
                                <div
                                    className={`px-2 py-3 text-xs transition-colors truncate ${option.disabled
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : `cursor-pointer hover:bg-gray-50 ${option.value === selectedValue ? 'bg-blue-50 text-blue-600' : 'text-gray-800'}`
                                        }`}
                                    onClick={() => !option.disabled && handleSelect(option)}
                                >
                                    {option.label}
                                </div>
                                {index < options.length - 1 && (
                                    <div className="border-b border-gray-100 mx-2"></div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};