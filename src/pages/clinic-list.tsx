import React, { useState } from 'react';
import { faMagnifyingGlass, faCaretLeft, faCaretRight, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@apollo/client";
import { Modal } from "antd";
import TextInput from "@/components/ui/text-input";
import Navbar from '@/components/my-account/navbar';
import {
    CLINICS_SIMPLE_QUERY,
    STATES_QUERY,
    INSURANCE_COMPANIES_QUERY,
} from "@/lib/sektor-api/queries";
import { Query, SupplierType, StateType, InsuranceCompanyType, SupplierInsuranceCompanyRelationType } from "@/lib/sektor-api/__generated__/types";
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import CloseIcon from '@/components/icons/close-icon';
import CheckIcon from '@/components/icons/check-icon';
import Image from 'next/image';




const ClinicList = () => {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState<string>("");
    console.log('selectedState: ', selectedState);
    const [selectedClinic, setSelectedClinic] = useState("");
    const [selectedOfficeIndex, setSelectedOfficeIndex] = useState<number>(0);

    const [selectedInsurance, setSelectedInsurance] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const { data: statesData, loading: isLoadingStates } = useQuery<Query>(STATES_QUERY, {
        variables: { code: "VE" },
        fetchPolicy: "cache-first"
    });

    const { data: insuranceData, loading: isLoadingInsurance } = useQuery<Query>(INSURANCE_COMPANIES_QUERY, {
        variables: { pagination: { offset: 0, limit: 1000 } },
        fetchPolicy: "cache-first"
    });



    const insuranceIds = insuranceData?.publicInsuranceCompanies?.items?.map((insurance: InsuranceCompanyType) => insurance.id) || [];

    console.log('insuranceIds: ', insuranceIds);

    const { data: clinicsData, loading: isLoadingClinics } = useQuery<Query>(CLINICS_SIMPLE_QUERY, {
        variables: {
            filter: {
                stateId: selectedState ? parseFloat(selectedState) : undefined,
                name: searchTerm || undefined
            }
        },
        fetchPolicy: "no-cache",
        skip: false
    });



    const stateOptions = isLoadingStates
        ? [{ label: "Cargando estados...", value: "", disabled: true }]
        : [
            { label: "Buscar estado", value: "" },
            ...(statesData?.getCountryByCode?.states
                ?.map((state: StateType) => ({
                    label: state.name,
                    value: state.id.toString()
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) || [])
        ];




    const allClinics = clinicsData?.clinics?.items || [];



    const clinics = allClinics.filter(clinic => {

        const stateMatch = !selectedState ||
            clinic.offices?.some(office =>
                office.address?.state?.id === Number(selectedState)
            );


        const clinicMatch = !selectedClinic || clinic.id?.toString() === selectedClinic;


        const insuranceMatch = !selectedInsurance ||
            clinic.insuranceCompanyRelations?.some(relation =>
                relation.insuranceCompanyId === selectedInsurance
            );

        return stateMatch && clinicMatch && insuranceMatch;
    });


    type ClinicOption =
        | { label: string; value: string; disabled: true }
        | { label: string; value: string; relations: SupplierInsuranceCompanyRelationType[] | undefined; officeIndex?: number };

    const clinicOptions: ClinicOption[] = isLoadingClinics
        ? [{ label: "Cargando clínicas...", value: "", disabled: true }]
        : allClinics.length > 0
            ? allClinics.map((clinic: SupplierType) => ({
                label: clinic.name,
                value: clinic.id?.toString() || "",
                relations: clinic.insuranceCompanyRelations,
                officeIndex: 0
            }))
                .sort((a, b) => a.label.localeCompare(b.label))
            : selectedState
                ? [{ label: `No hay clínicas en este estado`, value: "", disabled: true }]
                : [{ label: "Buscar clínicas", value: "", disabled: true }];



    const insuranceOptions = isLoadingInsurance
        ? [{ label: "Cargando seguros...", value: "", disabled: true }]
        : (() => {
            const selectedClinicOption = clinicOptions.find((opt) => 'relations' in opt && opt.value === selectedClinic) as { label: string; value: string; relations?: SupplierInsuranceCompanyRelationType[] } | undefined;

            if (!selectedClinicOption) {
                return [{ label: "Selecciona una clínica primero", value: "", disabled: true }];
            }

            const items = insuranceData?.publicInsuranceCompanies?.items || [];
            const allowedInsuranceIds = selectedClinicOption.relations
                ? selectedClinicOption.relations.map((rel) => rel.insuranceCompanyId)
                : [];

            const filteredItems = items.filter((insurance: InsuranceCompanyType) => allowedInsuranceIds.includes(insurance.id));

            return filteredItems.length > 0
                ? filteredItems
                    .map((insurance: InsuranceCompanyType) => ({ label: insurance.name, value: insurance.id }))
                    .sort((a, b) => a.label.localeCompare(b.label))
                : [{ label: "No hay seguros disponibles", value: "", disabled: true }];
        })();



    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStateChange = (value: string) => {
        setSelectedState(value);
        setSelectedClinic("");
        setSelectedInsurance("");
        setCurrentPage(1);
    };

    const handleClinicChange = (value: string) => {
        setSelectedClinic(value);
        const selectedOption = clinicOptions.find(opt => 'value' in opt && opt.value === value && 'officeIndex' in opt);
        if (selectedOption && 'officeIndex' in selectedOption) {
            setSelectedOfficeIndex(selectedOption.officeIndex || 0);
        } else {
            setSelectedOfficeIndex(0);
        }
        setCurrentPage(1);
    };

    const handleInsuranceChange = (value: string) => {
        setSelectedInsurance(value);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-svh bg-white w-full flex flex-col items-center justify-start overflow-hidden">
            <Navbar />


            <main className="text-blue-500 w-full max-w-screen-xl flex flex-col items-start justify-center gap-8 py-10 px-7 pb-36 2xl:px-0">

                <div className="w-full max-w-md">
                    <TextInput
                        iconPosition="end"
                        icon={faMagnifyingGlass}
                        wrapperClassName="w-full relative"
                        className="rounded-3xl border-opacity-50 md:text-lg shadow-xl placeholder:text-gray-400"
                        placeholder="Buscar clínica"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <div className="w-full min-h-[537px] max-w-4xl mx-auto mt-10 bg-[#1F53724D] rounded-[20px] shadow-lg">

                    <div className="bg-[#1F537299] w-full rounded-t-[20px] px-6 py-4 md:py-2 mb-6 relative">

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-xs font-medium text-blue-800  text-center place-items-center ">
                            <div className="col-span-1">Estado</div>
                            <div className="col-span-1">Clínica</div>
                            <div className="col-span-1">Seguro</div>
                            <div className="col-span-1 text-center hidden md:block">Cobro de Deposito</div>
                            <div className="col-span-1 text-center hidden md:block">100% Clínica Convenida</div>
                            <div className="col-span-1 text-center hidden md:block">Aplica Gastos Razonables</div>
                        </div>

                        <div className="absolute -top-9 right-6 w-3/6 bg-[#1F537299] border-b-2 border-[#182F4899] px-6 py-2 rounded-t-[20px] text-sm font-medium text-blue-800 z-10 text-center hidden md:block">
                            Tipo de Negociación
                        </div>
                    </div>


                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6 px-2 md:px-6">
                        <div className="col-span-1">
                            <CustomDropdown
                                options={stateOptions}
                                placeholder={isLoadingStates ? "Cargando estados..." : "Buscar estado"}
                                value={selectedState}
                                onChange={handleStateChange}
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomDropdown
                                options={clinicOptions}
                                placeholder={
                                    isLoadingClinics
                                        ? "Cargando clínicas..."
                                        : clinicOptions.length === 0 || (clinicOptions.length === 1 && 'disabled' in clinicOptions[0] && clinicOptions[0].disabled)
                                            ? "No hay clínicas disponibles"
                                            : "Buscar clínica"
                                }
                                value={selectedClinic}
                                onChange={handleClinicChange}
                            />
                        </div>
                        <div className="col-span-1">
                            <CustomDropdown
                                options={insuranceOptions}
                                placeholder={
                                    isLoadingInsurance
                                        ? "Cargando seguros..."
                                        : insuranceData?.publicInsuranceCompanies?.items?.length === 0
                                            ? "Sin seguros"
                                            : "Buscar seguros"
                                }
                                value={selectedInsurance}
                                onChange={handleInsuranceChange}
                            />
                        </div>


                        <div className="col-span-1 hidden md:block text-center uppercase">
                            {selectedInsurance && (() => {
                                if (selectedClinic) {
                                    const clinic = allClinics.find(c => c.id === selectedClinic);
                                    const relation = clinic?.insuranceCompanyRelations?.find(
                                        rel => rel.insuranceCompanyId === selectedInsurance
                                    );
                                    return (
                                        <div className="text-sm font-medium text-gray-800">
                                            {relation ? (relation.depositRequired ? "Sí" : "No") : <span className="text-gray-500 font-bold text-xl">-</span>}
                                        </div>
                                    );
                                } else {
                                    const clinicsWithRelation = allClinics.filter(clinic =>
                                        clinic.insuranceCompanyRelations?.some(rel =>
                                            rel.insuranceCompanyId === selectedInsurance
                                        )
                                    );
                                    if (clinicsWithRelation.length > 0) {
                                        const firstRelation = clinicsWithRelation[0]?.insuranceCompanyRelations?.find(
                                            rel => rel.insuranceCompanyId === selectedInsurance
                                        );
                                        return (
                                            <div className="text-sm font-medium text-gray-800">
                                                {firstRelation ? (firstRelation.depositRequired ? "Sí" : "No") : <span className="text-gray-500 font-bold text-lg">-</span>}
                                            </div>
                                        );
                                    }
                                }
                                return <div className="text-gray-500 font-bold text-lg">-</div>;
                            })()}
                        </div>

                        <div className="col-span-1 hidden md:block text-center">
                            {selectedInsurance && (() => {
                                if (selectedClinic) {
                                    const clinic = allClinics.find(c => c.id === selectedClinic);
                                    const relation = clinic?.insuranceCompanyRelations?.find(
                                        rel => rel.insuranceCompanyId === selectedInsurance
                                    );
                                    return (
                                        <div className="text-sm font-medium text-gray-800">
                                            {relation ? (relation.fullyContractedClinic ? <CheckIcon /> : <CloseIcon />) : <span className="text-gray-500 font-bold text-lg">-</span>}
                                        </div>
                                    );
                                } else {
                                    const clinicsWithRelation = allClinics.filter(clinic =>
                                        clinic.insuranceCompanyRelations?.some(rel =>
                                            rel.insuranceCompanyId === selectedInsurance
                                        )
                                    );
                                    if (clinicsWithRelation.length > 0) {
                                        const firstRelation = clinicsWithRelation[0]?.insuranceCompanyRelations?.find(
                                            rel => rel.insuranceCompanyId === selectedInsurance
                                        );
                                        return (
                                            <div className="text-sm font-medium text-gray-800">
                                                {firstRelation ? (firstRelation.fullyContractedClinic ? <CheckIcon /> : <CloseIcon />) : <span className="text-gray-500 font-bold text-lg">-</span>}
                                            </div>
                                        );
                                    }
                                }
                                return <div className="text-gray-500 font-bold text-lg">-</div>;
                            })()}
                        </div>

                        <div className="col-span-1 hidden md:block text-center">
                            {selectedInsurance && (() => {
                                if (selectedClinic) {
                                    const clinic = allClinics.find(c => c.id === selectedClinic);
                                    const relation = clinic?.insuranceCompanyRelations?.find(
                                        rel => rel.insuranceCompanyId === selectedInsurance
                                    );
                                    return (
                                        <div className="text-sm font-medium text-gray-800">
                                            {relation ? (relation.reasonableExpensesApplicable ? <CheckIcon /> : <CloseIcon />) : <span className="text-gray-500 font-bold text-lg">-</span>}
                                        </div>
                                    );
                                } else {
                                    const clinicsWithRelation = allClinics.filter(clinic =>
                                        clinic.insuranceCompanyRelations?.some(rel =>
                                            rel.insuranceCompanyId === selectedInsurance
                                        )
                                    );
                                    if (clinicsWithRelation.length > 0) {
                                        const firstRelation = clinicsWithRelation[0]?.insuranceCompanyRelations?.find(
                                            rel => rel.insuranceCompanyId === selectedInsurance
                                        );
                                        return (
                                            <div className="text-sm font-medium text-gray-800">
                                                {firstRelation ? (firstRelation.reasonableExpensesApplicable ? <CheckIcon /> : <CloseIcon />) : <span className="text-gray-500 font-bold text-lg">-</span>}
                                            </div>
                                        );
                                    }
                                }
                                return <div className="text-gray-500 font-bold text-lg">-</div>;
                            })()}
                        </div>
                    </div>


                    <div className="px-2 md:px-6 block md:hidden">
                        <div className="w-full bg-white rounded-[20px] shadow-lg text-center py-2">
                            <h1>Tipo de Negociación</h1>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                    <div>Cobro de Deposito</div>
                                    <div className="text-sm font-medium text-gray-800 mt-1 uppercase">
                                        {selectedInsurance && (() => {
                                            if (selectedClinic) {
                                                const clinic = allClinics.find(c => c.id === selectedClinic);
                                                const relation = clinic?.insuranceCompanyRelations?.find(
                                                    rel => rel.insuranceCompanyId === selectedInsurance
                                                );
                                                return relation ? (relation.depositRequired ? "Sí" : "No") : <span className="text-gray-500 font-bold text-lg">-</span>;
                                            } else {
                                                const clinicsWithRelation = allClinics.filter(clinic =>
                                                    clinic.insuranceCompanyRelations?.some(rel =>
                                                        rel.insuranceCompanyId === selectedInsurance
                                                    )
                                                );
                                                if (clinicsWithRelation.length > 0) {
                                                    const firstRelation = clinicsWithRelation[0]?.insuranceCompanyRelations?.find(
                                                        rel => rel.insuranceCompanyId === selectedInsurance
                                                    );
                                                    return firstRelation ? (firstRelation.depositRequired ? "Sí" : "No") : <span className="text-gray-500 font-bold text-lg">-</span>;
                                                }
                                            }
                                            return <span className="text-gray-500 font-bold text-lg">-</span>;
                                        })()}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                    <div>100% Clínica Convenida</div>
                                    <div className="text-sm font-medium text-gray-800 mt-1 uppercase">
                                        {selectedInsurance && (() => {
                                            if (selectedClinic) {
                                                const clinic = allClinics.find(c => c.id === selectedClinic);
                                                const relation = clinic?.insuranceCompanyRelations?.find(
                                                    rel => rel.insuranceCompanyId === selectedInsurance
                                                );
                                                return relation ? (relation.fullyContractedClinic ? <CheckIcon /> : <CloseIcon />) : <span className="text-gray-500 font-bold text-lg">-</span>;
                                            } else {
                                                const clinicsWithRelation = allClinics.filter(clinic =>
                                                    clinic.insuranceCompanyRelations?.some(rel =>
                                                        rel.insuranceCompanyId === selectedInsurance
                                                    )
                                                );
                                                if (clinicsWithRelation.length > 0) {
                                                    const firstRelation = clinicsWithRelation[0]?.insuranceCompanyRelations?.find(
                                                        rel => rel.insuranceCompanyId === selectedInsurance
                                                    );
                                                    return firstRelation ? (firstRelation.fullyContractedClinic ? <CheckIcon /> : <CloseIcon />) : <span className="text-gray-500 font-bold text-lg">-</span>;
                                                }
                                            }
                                            return <span className="text-gray-500 font-bold text-lg">-</span>;
                                        })()}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                    <div>Aplica Gastos Razonables</div>
                                    <div className="text-sm font-medium text-gray-800 mt-1 uppercase">
                                        {selectedInsurance && (() => {
                                            if (selectedClinic) {
                                                const clinic = allClinics.find(c => c.id === selectedClinic);
                                                const relation = clinic?.insuranceCompanyRelations?.find(
                                                    rel => rel.insuranceCompanyId === selectedInsurance
                                                );
                                                return relation ? (relation.reasonableExpensesApplicable ? <CheckIcon /> : <CloseIcon />) : <span className="text-gray-500 font-bold text-lg">-</span>;
                                            } else {
                                                const clinicsWithRelation = allClinics.filter(clinic =>
                                                    clinic.insuranceCompanyRelations?.some(rel =>
                                                        rel.insuranceCompanyId === selectedInsurance
                                                    )
                                                );
                                                if (clinicsWithRelation.length > 0) {
                                                    const firstRelation = clinicsWithRelation[0]?.insuranceCompanyRelations?.find(
                                                        rel => rel.insuranceCompanyId === selectedInsurance
                                                    );
                                                    return firstRelation ? (firstRelation.reasonableExpensesApplicable ? <CheckIcon /> : <CloseIcon />) : <span className="text-gray-500 font-bold text-lg">-</span>;
                                                }
                                            }
                                            return <span className="text-gray-500 font-bold text-lg">-</span>;
                                        })()}
                                    </div>
                                </div>
                            </div>


                            {selectedClinic && (() => {
                                const clinic = allClinics.find(c => c.id === selectedClinic);
                                const offices = clinic?.offices || [];
                                const selectedOffice = offices[selectedOfficeIndex] || offices[0];

                                if (!selectedOffice) return null;

                                const address = selectedOffice.address;
                                const fullAddress = address ? [
                                    address.street,
                                    address.city?.name,
                                    address.state?.name,
                                    address.country?.name
                                ].filter(Boolean).join(', ') : '';

                                //ahora si no hay dirección completa se mostrara la ciudad y el estado
                                const hasPartialAddress = address && (address.city?.name || address.state?.name);
                                const displayAddress = fullAddress || (hasPartialAddress ? [
                                    address.city?.name,
                                    address.state?.name,
                                    address.country?.name
                                ].filter(Boolean).join(', ') : '');

                                const googleMapsUrl = displayAddress
                                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`
                                    : '#';

                                return (
                                    <>
                                        <div className="w-full h-px bg-gray-300 my-4"></div>
                                        <div className="grid grid-cols-3 gap-4 px-2 pb-2">
                                            <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                                <div className="mb-2">Dirección</div>
                                                {displayAddress ? (
                                                    <a
                                                        href={googleMapsUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                                    >
                                                        <Image
                                                            src="/images/location.webp"
                                                            alt="Location"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500 font-bold text-lg">-</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                                <div className="mb-2">Oficina</div>
                                                {displayAddress ? (
                                                    <button
                                                        onClick={() => setIsAddressModalOpen(true)}
                                                        className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none"
                                                    >
                                                        <Image
                                                            src="/images/eye-1.webp"
                                                            alt="Office"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-500 font-bold text-lg">-</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                                <div className="mb-2">Teléfono</div>
                                                {selectedOffice.phone ? (
                                                    <div className="text-sm font-medium text-gray-800">
                                                        {selectedOffice.phone}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 font-bold text-lg">-</span>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>


                    {selectedClinic && (() => {
                        const clinic = allClinics.find(c => c.id === selectedClinic);
                        const offices = clinic?.offices || [];
                        const selectedOffice = offices[selectedOfficeIndex] || offices[0];

                        if (!selectedOffice) return null;

                        const address = selectedOffice.address;
                        const fullAddress = address ? [
                            address.street,
                            address.city?.name,
                            address.state?.name,
                            address.country?.name
                        ].filter(Boolean).join(', ') : '';


                        const hasPartialAddress = address && (address.city?.name || address.state?.name);
                        const displayAddress = fullAddress || (hasPartialAddress ? [
                            address.city?.name,
                            address.state?.name,
                            address.country?.name
                        ].filter(Boolean).join(', ') : '');

                        const googleMapsUrl = displayAddress
                            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`
                            : '#';

                        return (
                            <>
                                <div className="w-full h-px bg-gray-300 my-6 hidden md:block"></div>
                                <div className="hidden md:grid grid-cols-3 gap-4 px-2 md:px-6 pb-6">
                                    <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                        <div className="mb-2">Dirección</div>
                                        {displayAddress ? (
                                            <a
                                                href={googleMapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                                            >
                                                <Image
                                                    src="/images/location.webp"
                                                    alt="Location"
                                                    width={24}
                                                    height={24}
                                                />
                                            </a>
                                        ) : (
                                            <span className="text-gray-500 font-bold text-lg">-</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                        <div className="mb-2">Oficina</div>
                                        {displayAddress ? (
                                            <button
                                                onClick={() => setIsAddressModalOpen(true)}
                                                className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none"
                                            >
                                                <Image
                                                    src="/images/eye-1.webp"
                                                    alt="Office"
                                                    width={24}
                                                    height={24}
                                                />
                                            </button>
                                        ) : (
                                            <span className="text-gray-500 font-bold text-lg">-</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center justify-center col-span-1 text-xs font-normal font-century-gothic">
                                        <div className="mb-2">Teléfono</div>
                                        {selectedOffice.phone ? (
                                            <div className="text-sm font-medium text-gray-800">
                                                {selectedOffice.phone}
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 font-bold text-lg">-</span>
                                        )}
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>


                <div className="flex items-center justify-center gap-4 mt-3 w-full">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full transition-colors ${currentPage === 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        <FontAwesomeIcon icon={faCaretLeft} className="w-4 h-4" size="xl" />
                    </button>

                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={clinics.length < 10}
                        className={`p-2 rounded-full transition-colors ${clinics.length < 10
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                    >
                        <FontAwesomeIcon icon={faCaretRight} className="w-4 h-4" size="xl" />
                    </button>
                </div>
            </main>


            {selectedClinic && (() => {
                const clinic = allClinics.find(c => c.id === selectedClinic);
                const offices = clinic?.offices || [];
                const selectedOffice = offices[selectedOfficeIndex] || offices[0];

                if (!selectedOffice) return null;

                const address = selectedOffice.address;
                const fullAddress = address ? [
                    address.street,
                    address.city?.name,
                    address.state?.name,
                    address.country?.name
                ].filter(Boolean).join(', ') : '';


                const hasPartialAddress = address && (address.city?.name || address.state?.name);
                const displayAddress = fullAddress || (hasPartialAddress ? [
                    address.city?.name,
                    address.state?.name,
                    address.country?.name
                ].filter(Boolean).join(', ') : '');

                return (
                    <Modal
                        footer={null}
                        open={isAddressModalOpen}
                        onClose={() => setIsAddressModalOpen(false)}
                        onCancel={() => setIsAddressModalOpen(false)}
                        className="!w-fit"
                        centered
                        closeIcon={
                            <FontAwesomeIcon
                                icon={faCircleXmark}
                                className="text-blue-500"
                                size="lg"
                            />
                        }
                    >
                        <section className="flex flex-col items-center justify-center gap-5 text-blue-500 p-5 font-century-gothic w-full">
                            <h3 className="text-center font-bold text-lg">Dirección oficina</h3>
                            <p className="text-center text-base">
                                {displayAddress || 'Dirección no disponible'}
                            </p>
                        </section>
                    </Modal>
                );
            })()}
        </div>
    );
};

export default ClinicList;
