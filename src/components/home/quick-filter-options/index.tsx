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
            <div className="flex justify-center gap-4 w-full mb-24 border-b border-[#C2C2C24D]">
                {ORGANIZATION_TYPE_OPTIONS.filter(option => option.name !== 'Proveedores').map((option) => {

                    const displayName = option.name === 'Sociedades de Corretaje' ? 'Corretaje' : option.name;

                    return (
                        <button
                            key={option.id}
                            className={`font-normal text-lg mb-7 ${query?.type === option.id ? 'bg-blue-200' : ''}`}
                            onClick={() => handleClick(option.id)}
                        >
                            <span className="text-sm md:text-lg text-[#182F48] font-normal font-century-gothic">
                                {displayName}
                            </span>
                        </button>
                    );
                })}
            </div>
            <LocationModal
                open={openLocationModal}
                setOpenLocationModal={setOpenLocationModal}

            />
        </>

    );
}

export default QuickFilterOptions;
