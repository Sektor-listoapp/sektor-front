import { ORGANIZATION_TYPE_OPTIONS } from '@/components/organizations/searchbar/constants';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import LocationModal from './LocationModal';

const QuickFilterOptions = () => {
    const { query, replace } = useRouter();
    const [openLocationModal, setOpenLocationModal] = useState(false);


    const handleClick = (type: string) => {
        setOpenLocationModal(true)

        const newQueryParams = query?.search ? { search: query?.search } : {};


        if (query?.type === type) {
            replace({ query: newQueryParams }, undefined, { scroll: false });
            return;
        }


        replace({ query: { ...newQueryParams, type } }, undefined, { scroll: false });
    };


    return (
        <>
            <div className="w-full mb-16 md:mb-24 border-b border-[#C2C2C24D] pb-7">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center gap-3 md:gap-4 w-full">
                    {ORGANIZATION_TYPE_OPTIONS.filter(option => option.name !== 'Proveedores').map((option) => {
                        const displayName = option.name === 'Sociedades de Corretaje'
                            ? 'Corretaje'
                            : option.name === 'Compañías de Seguros'
                              ? 'Aseguradoras'
                              : option.name === 'Medicina Prepagada'
                                ? 'Prepagada'
                                : option.name;

                        return (
                            <button
                                key={option.id}
                                className={`font-normal rounded-xl px-3 py-2.5 min-h-[44px] flex items-center justify-center lg:mb-7 ${
                                    query?.type === option.id ? 'bg-blue-200' : 'hover:bg-blue-50'
                                }`}
                                onClick={() => handleClick(option.id)}
                            >
                                <span className="text-xs sm:text-sm md:text-lg text-[#182F48] font-normal font-century-gothic text-center leading-snug">
                                    {displayName}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
            <LocationModal
                open={openLocationModal}
                setOpenLocationModal={setOpenLocationModal}

            />
        </>

    );
}

export default QuickFilterOptions;
