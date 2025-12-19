import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";




export const CustomDropdown = ({ options, placeholder, value, onChange, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const [dropdownPosition, setDropdownPosition] = useState('bottom-left');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };

        const handleArrowKeys = (event: KeyboardEvent) => {
            if (!isOpen) return;

            const enabledOptions = options.filter(opt => !opt.disabled);

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setFocusedIndex(prev =>
                    prev < enabledOptions.length - 1 ? prev + 1 : 0
                );
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setFocusedIndex(prev =>
                    prev > 0 ? prev - 1 : enabledOptions.length - 1
                );
            } else if (event.key === 'Enter' && focusedIndex >= 0) {
                event.preventDefault();
                const option = enabledOptions[focusedIndex];
                if (option) {
                    handleSelect(option);
                }
            }
        };

        const calculatePosition = () => {
            if (dropdownRef.current && isOpen) {
                const rect = dropdownRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const dropdownWidth = 300;
                const dropdownHeight = 192;


                let horizontalPosition = 'left';
                if (rect.left + dropdownWidth > viewportWidth - 16) {
                    horizontalPosition = 'right';
                }


                let verticalPosition = 'bottom';
                if (rect.bottom + dropdownHeight > viewportHeight - 16) {
                    verticalPosition = 'top';
                }

                setDropdownPosition(`${verticalPosition}-${horizontalPosition}`);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleArrowKeys);
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition);

        if (isOpen) {
            calculatePosition();
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleArrowKeys);
            window.removeEventListener('resize', calculatePosition);
            window.removeEventListener('scroll', calculatePosition);
        };
    }, [isOpen]);

    const handleSelect = (option: { value: string; label: string }) => {
        setSelectedValue(option.value);
        onChange?.(option.value);
        setIsOpen(false);
        setFocusedIndex(-1);
    };

    const selectedOption = options.find(opt => opt.value === selectedValue);

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div
                className={`w-full bg-white border rounded-[30px] p-2 cursor-pointer flex items-center justify-between transition-all duration-200 min-h-[46px] ${isOpen
                    ? 'border-blue-400 shadow-md'
                    : 'border-[#00000033] hover:border-[#00000066] hover:shadow-sm'
                    }`}
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <span className={`text-[10px] md:text-xs ${selectedValue ? 'text-gray-800' : 'text-gray-500'} break-words flex-1 min-w-0 leading-tight pr-2`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>

                <div className="flex-shrink-0 ml-2">
                    <FontAwesomeIcon
                        icon={faCaretDown}
                        className={`text-[#182F48] transition-transform duration-200 text-sm md:text-lg ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {isOpen && (
                <div className={`absolute bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto w-max min-w-full max-w-[300px] transition-all duration-200 ease-out ${dropdownPosition.includes('top') ? 'bottom-full mb-1' : 'top-full mt-1'
                    } ${dropdownPosition.includes('right') ? 'right-0' : 'left-0'
                    }`}>
                    {options.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-gray-500 text-center">
                            No hay opciones disponibles
                        </div>
                    ) : (
                        options.map((option, index) => {
                            const enabledOptions = options.filter(opt => !opt.disabled);
                            const focusedOptionIndex = enabledOptions.findIndex(opt => opt.value === option.value);
                            const isFocused = focusedIndex === focusedOptionIndex;

                            return (
                                <div key={option.value}>
                                    <div
                                        className={`px-4 py-2.5 text-xs transition-all duration-150 break-words ${option.disabled
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : `cursor-pointer hover:bg-blue-50 hover:text-blue-700 ${option.value === selectedValue ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-800'} ${isFocused ? 'bg-blue-50 text-blue-700' : ''}`
                                            }`}
                                        onClick={() => !option.disabled && handleSelect(option)}
                                        onMouseEnter={() => setFocusedIndex(focusedOptionIndex)}
                                    >
                                        {option.label}
                                    </div>
                                    {index < options.length - 1 && (
                                        <div className="border-b border-gray-100 mx-4"></div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};