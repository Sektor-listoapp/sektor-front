import React, { useEffect, useState } from 'react';
import {
    faMagnifyingGlass,
    faCaretLeft,
    faCaretRight,
    faCircleXmark,
    faHospital,
    faPhone,
    faGlobe,
    faChevronDown,
    faChevronUp,
    faEnvelope,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@apollo/client";
import { Modal } from "antd";
import TextInput from "@/components/ui/text-input";
import Navbar from '@/components/my-account/navbar';
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import {
    CLINICS_SIMPLE_QUERY,
    STATES_QUERY,
    INSURANCE_COMPANIES_QUERY,
    ORGANIZATION_BY_ID_QUERY,
} from "@/lib/sektor-api/queries";
import { Query, SupplierType, StateType, InsuranceCompanyType, SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";
import { faWhatsapp, faFacebookF, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { CustomDropdown } from '@/components/ui/custom-dropdown';
import CloseIcon from '@/components/icons/close-icon';
import CheckIcon from '@/components/icons/check-icon';
import Image from 'next/image';

const CARDS_PER_PAGE = 6;
const SEGUROS_VISIBLE_SIN_EXPANDIR = 3;

const ClinicList = () => {
    const userId = useAuthStore(useShallow((state) => state.user?.id));

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedState, setSelectedState] = useState<string>("");
    const [selectedInsurance, setSelectedInsurance] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [modalAddress, setModalAddress] = useState<string>("");
    const [insurancePopup, setInsurancePopup] = useState<{
        name: string;
        depositRequired: boolean;
        fullyContractedClinic: boolean;
        reasonableExpensesApplicable: boolean;
    } | null>(null);
    const [segurosAsociadosModalList, setSegurosAsociadosModalList] = useState<
        Array<{ id: string; name: string; depositRequired: boolean; fullyContractedClinic: boolean; reasonableExpensesApplicable: boolean }>
    | null>(null);
    const [segurosAccordionOpenIds, setSegurosAccordionOpenIds] = useState<Set<string>>(new Set());
    const [contactModalClinic, setContactModalClinic] = useState<SupplierType | null>(null);

    const toggleSegurosAccordion = (clinicId: string) => {
        setSegurosAccordionOpenIds((prev) => {
            const next = new Set(prev);
            if (next.has(clinicId)) next.delete(clinicId);
            else next.add(clinicId);
            return next;
        });
    };

    const { data: organizationData } = useQuery<Query>(ORGANIZATION_BY_ID_QUERY, {
        variables: { id: userId as string },
        fetchPolicy: "cache-first",
        skip: !userId,
    });

    const { data: statesData, loading: isLoadingStates } = useQuery<Query>(STATES_QUERY, {
        variables: { code: "VE" },
        fetchPolicy: "cache-first",
    });

    const { data: insuranceData, loading: isLoadingInsurance } = useQuery<Query>(INSURANCE_COMPANIES_QUERY, {
        variables: { pagination: { offset: 0, limit: 1000 } },
        fetchPolicy: "cache-first",
    });

    const { data: clinicsData, loading: isLoadingClinics } = useQuery<Query>(CLINICS_SIMPLE_QUERY, {
        variables: {
            filter: {
                stateId: selectedState ? parseFloat(selectedState) : undefined,
                name: searchTerm || undefined,
            },
        },
        fetchPolicy: "no-cache",
        skip: false,
    });

    useEffect(() => {
        if (selectedState) return;
        const coverageStates = organizationData?.organizationById?.coverageStates;
        if (!coverageStates || coverageStates.length === 0) return;
        const firstStateId = coverageStates[0];
        if (firstStateId) setSelectedState(String(firstStateId));
    }, [selectedState, organizationData]);

    const stateOptions = isLoadingStates
        ? [{ label: "Cargando estados...", value: "", disabled: true }]
        : [
            { label: "Todos los estados", value: "" },
            ...(statesData?.getCountryByCode?.states
                ?.map((state: StateType) => ({
                    label: state.name,
                    value: state.id.toString(),
                }))
                .sort((a, b) => a.label.localeCompare(b.label)) || []),
        ];

    const allClinics = clinicsData?.clinics?.items || [];
    const insuranceItems = insuranceData?.publicInsuranceCompanies?.items || [];

    const getInsuranceName = (id: string) =>
        insuranceItems.find((i: InsuranceCompanyType) => i.id === id)?.name ?? id;

    const clinics = allClinics.filter((clinic) => {
        const stateMatch =
            !selectedState ||
            clinic.offices?.some((office) => office.address?.state?.id === Number(selectedState));
        const insuranceMatch =
            !selectedInsurance ||
            clinic.insuranceCompanyRelations?.some((r) => r.insuranceCompanyId === selectedInsurance);
        return stateMatch && insuranceMatch;
    });

    const insuranceOptions = isLoadingInsurance
        ? [{ label: "Cargando seguros...", value: "", disabled: true }]
        : [
            { label: "Todos los seguros", value: "" },
            ...insuranceItems
                .map((insurance: InsuranceCompanyType) => ({
                    label: insurance.name,
                    value: insurance.id,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
        ];

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStateChange = (value: string) => {
        setSelectedState(value);
        setCurrentPage(1);
    };

    const handleInsuranceChange = (value: string) => {
        setSelectedInsurance(value);
        setCurrentPage(1);
    };

    const paginatedClinics = clinics.slice(
        (currentPage - 1) * CARDS_PER_PAGE,
        currentPage * CARDS_PER_PAGE
    );
    const totalPages = Math.ceil(clinics.length / CARDS_PER_PAGE) || 1;

    const showAddressModal = (address: string) => {
        setModalAddress(address);
        setIsAddressModalOpen(true);
    };

  const showInsurancePopup = (name: string, rel: { depositRequired: boolean; fullyContractedClinic: boolean; reasonableExpensesApplicable: boolean }) => {
    setInsurancePopup({
      name,
      depositRequired: rel.depositRequired,
      fullyContractedClinic: rel.fullyContractedClinic,
      reasonableExpensesApplicable: rel.reasonableExpensesApplicable,
    });
  };

  const openSegurosAsociadosModal = (
    list: Array<{ id: string; name: string; relation: { depositRequired: boolean; fullyContractedClinic: boolean; reasonableExpensesApplicable: boolean } }>
  ) => {
    setSegurosAsociadosModalList(
      list.map(({ id, name, relation }) => ({
        id,
        name,
        depositRequired: relation.depositRequired,
        fullyContractedClinic: relation.fullyContractedClinic,
        reasonableExpensesApplicable: relation.reasonableExpensesApplicable,
      }))
    );
  };

  return (
        <div className="min-h-svh bg-white w-full flex flex-col items-center justify-start overflow-hidden">
            <Navbar />

            <main className="text-blue-500 w-full max-w-screen-xl flex flex-col gap-8 py-10 px-7 pb-36 2xl:px-0">
                {/* Top bar: search left, dropdowns right */}
                <div className="w-full flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                    <div className="w-full sm:max-w-md">
                        <TextInput
                            iconPosition="start"
                            icon={faMagnifyingGlass}
                            wrapperClassName="w-full relative"
                            className="rounded-3xl border border-gray-200 bg-gray-50 border-opacity-50 md:text-base placeholder:text-gray-400"
                            placeholder="Buscar clínica..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto sm:min-w-[280px]">
                        <div className="flex-1 sm:min-w-[180px]">
                            <CustomDropdown
                                options={stateOptions}
                                placeholder="Todos los estados"
                                value={selectedState}
                                onChange={handleStateChange}
                            />
                        </div>
                        <div className="flex-1 sm:min-w-[180px]">
                            <CustomDropdown
                                options={insuranceOptions}
                                placeholder="Todos los seguros"
                                value={selectedInsurance}
                                onChange={handleInsuranceChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Clinic cards grid */}
                <div className="w-full">
                    {isLoadingClinics ? (
                        <div className="flex justify-center items-center min-h-[300px] text-gray-500">
                            Cargando clínicas...
                        </div>
                    ) : paginatedClinics.length === 0 ? (
                        <div className="flex justify-center items-center min-h-[300px] text-gray-500">
                            No se encontraron clínicas con los filtros seleccionados.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                            {paginatedClinics.map((clinic: SupplierType) => {
                                const offices = clinic.offices || [];
                                const firstOffice = offices[0];
                                const address = firstOffice?.address;
                                const fullAddress = address
                                    ? [
                                        address.street,
                                        address.city?.name,
                                        address.state?.name,
                                        address.country?.name,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")
                                    : "";
                                const hasPartial =
                                    address && (address.city?.name || address.state?.name);
                                const displayAddress =
                                    fullAddress ||
                                    (hasPartial
                                        ? [address!.city?.name, address!.state?.name, address!.country?.name]
                                            .filter(Boolean)
                                            .join(", ")
                                        : "");
                                const phone = firstOffice?.phone?.trim() ?? "";
                                const whatsappUrl = phone
                                    ? `https://wa.me/${phone.replace(/\s/g, "").replace(/^0/, "")}`
                                    : "";
                                const websiteUrl = clinic.socialMediaLinks?.find((l) => l.platform === SocialMediaPlatform.Website)?.url?.trim() ?? "";
                                const relations = clinic.insuranceCompanyRelations || [];
    const insuranceCompanies = clinic.insuranceCompanies || [];
    const insuranceListForBadges =
      insuranceCompanies.length > 0
        ? insuranceCompanies.map((ins: InsuranceCompanyType) => {
            const rel = relations.find((r) => r.insuranceCompanyId === ins.id);
            return { id: ins.id, name: ins.name, relation: rel };
          })
        : relations.map((rel) => ({
            id: rel.insuranceCompanyId,
            name: getInsuranceName(rel.insuranceCompanyId),
            relation: rel,
          }));

                                return (
                                    <article
                                        key={clinic.id}
                                        className="bg-white rounded-2xl overflow-hidden flex flex-col h-full shadow-[0_4px_14px_rgba(0,0,0,0.08)]"
                                    >
                                        {/* Gradient top strip: blue → green */}
                                        <div
                                            className="h-1 w-full rounded-t-2xl shrink-0"
                                            style={{
                                                background: "linear-gradient(90deg, #2563eb 0%, #16a34a 100%)",
                                            }}
                                        />
                                        <div className="p-4 flex flex-col gap-3 flex-1 min-h-0">
                                            {/* Header: icon + title + badges compactos */}
                                            <div className="flex items-start gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <FontAwesomeIcon
                                                        icon={faHospital}
                                                        className="text-gray-600 text-lg"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h2 className="font-bold text-gray-900 text-base leading-tight line-clamp-2">
                                                        {clinic.name}
                                                    </h2>
                                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                        {[
                                                            ...new Set(
                                                                offices
                                                                    .map((o) => o.address?.state?.name)
                                                                    .filter(Boolean)
                                                            ),
                                                        ].map((stateName) => (
                                                            <span
                                                                key={stateName}
                                                                className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium"
                                                            >
                                                                {stateName}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {insuranceListForBadges.length > 0 && (
                                                        <div className="mt-1.5">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                <span className="text-[11px] text-gray-500 font-medium self-center mr-0.5 shrink-0">Seguros:</span>
                                                                {(segurosAccordionOpenIds.has(clinic.id)
                                                                    ? insuranceListForBadges
                                                                    : insuranceListForBadges.slice(0, SEGUROS_VISIBLE_SIN_EXPANDIR)
                                                                ).map((item) => (
                                                                    <button
                                                                        key={item.id}
                                                                        type="button"
                                                                        onClick={() => item.relation && showInsurancePopup(item.name, item.relation)}
                                                                        className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium hover:bg-gray-200 transition-colors cursor-pointer text-left border border-gray-200 shrink-0"
                                                                    >
                                                                        {item.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                            {insuranceListForBadges.length > SEGUROS_VISIBLE_SIN_EXPANDIR && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleSegurosAccordion(clinic.id)}
                                                                    className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium w-full justify-center py-1"
                                                                >
                                                                    {segurosAccordionOpenIds.has(clinic.id)
                                                                        ? "Ver menos"
                                                                        : `Ver ${insuranceListForBadges.length - SEGUROS_VISIBLE_SIN_EXPANDIR} seguros más`}
                                                                    <FontAwesomeIcon
                                                                        icon={segurosAccordionOpenIds.has(clinic.id) ? faChevronUp : faChevronDown}
                                                                        className="text-[10px]"
                                                                    />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* En la card solo 1 seguro con detalle; el resto en modal "Seguros asociados" */}
                                            {(() => {
                                              const withRelation = insuranceListForBadges
                                                .filter((item) => item.relation)
                                                .map((item) => ({ id: item.id, name: item.name, relation: item.relation! }));
                                              const first = withRelation[0];
                                              const restCount = withRelation.length - 1;
                                              return (
                                                <div className="space-y-1.5">
                                                  {first && (
                                                    <div>
                                                      <button
                                                        type="button"
                                                        onClick={() => showInsurancePopup(first.name, first.relation)}
                                                        className="text-xs text-gray-700 font-medium hover:text-gray-900 cursor-pointer text-left block truncate"
                                                      >
                                                        {first.name}:
                                                      </button>
                                                      <div className="flex flex-wrap gap-1 mt-1">
                                                        <span
                                                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                                            first.relation.depositRequired ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                                                          }`}
                                                        >
                                                          {first.relation.depositRequired ? <CheckIcon /> : <CloseIcon />}
                                                          Depósito
                                                        </span>
                                                        <span
                                                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                                            first.relation.fullyContractedClinic ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                                                          }`}
                                                        >
                                                          {first.relation.fullyContractedClinic ? <CheckIcon /> : <CloseIcon />}
                                                          100% Convenida
                                                        </span>
                                                        <span
                                                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                                            first.relation.reasonableExpensesApplicable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                                                          }`}
                                                        >
                                                          {first.relation.reasonableExpensesApplicable ? <CheckIcon /> : <CloseIcon />}
                                                          Gastos razonables
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )}
                                                  {restCount > 0 && (
                                                    <button
                                                      type="button"
                                                      onClick={() => openSegurosAsociadosModal(withRelation)}
                                                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                    >
                                                      +{restCount} seguros más - ver detalles
                                                    </button>
                                                  )}
                                                </div>
                                              );
                                            })()}

                                            {/* Dirección: máximo 2 líneas para no alargar la card */}
                                            {displayAddress ? (
                                                <button
                                                    type="button"
                                                    onClick={() => showAddressModal(displayAddress)}
                                                    className="flex items-start gap-2 text-xs text-gray-600 hover:text-gray-800 text-left w-full min-h-[2rem]"
                                                >
                                                    <Image
                                                        src="/images/location.webp"
                                                        alt=""
                                                        width={14}
                                                        height={14}
                                                        className="mt-0.5 flex-shrink-0 opacity-80"
                                                    />
                                                    <span className="break-words line-clamp-2">{displayAddress}</span>
                                                </button>
                                            ) : (
                                                <div className="min-h-[2rem]" aria-hidden />
                                            )}

                                            {/* Solo se muestran los botones para los que la clínica tiene dato */}
                                            <div className="flex flex-wrap gap-1.5">
                                                {phone && (
                                                    <a
                                                        href={`tel:${phone}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faPhone} className="text-xs" />
                                                        Llamar
                                                    </a>
                                                )}
                                                {phone && (
                                                    <a
                                                        href={whatsappUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                                                        WhatsApp
                                                    </a>
                                                )}
                                                {websiteUrl && (
                                                    <a
                                                        href={websiteUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faGlobe} className="text-xs" />
                                                        Web
                                                    </a>
                                                )}
                                            </div>

                                            {/* Espacio flexible: empuja Contactar al fondo cuando no hay dirección */}
                                            <div className="flex-1 min-h-4" />

                                            {/* Primary CTA: abre modal Datos de contacto */}
                                            <button
                                                type="button"
                                                onClick={() => setContactModalClinic(clinic)}
                                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#182F48] text-white font-bold text-base hover:bg-[#0f2035] transition-colors shrink-0"
                                            >
                                                Contactar
                                                <FontAwesomeIcon icon={faCaretRight} className="text-sm" />
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {!isLoadingClinics && clinics.length > CARDS_PER_PAGE && (
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-full transition-colors ${currentPage === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faCaretLeft} className="w-4 h-4" size="xl" />
                            </button>
                            <span className="text-sm text-gray-600">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-full transition-colors ${currentPage === totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                            >
                                <FontAwesomeIcon icon={faCaretRight} className="w-4 h-4" size="xl" />
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Modal
                footer={null}
                open={isAddressModalOpen}
                onCancel={() => setIsAddressModalOpen(false)}
                className="!w-fit"
                centered
                closeIcon={
                    <FontAwesomeIcon icon={faCircleXmark} className="text-blue-500" size="lg" />
                }
            >
                <section className="flex flex-col items-center justify-center gap-5 text-blue-500 p-5 font-century-gothic w-full">
                    <h3 className="text-center font-bold text-lg">Dirección</h3>
                    <p className="text-center text-base">{modalAddress || "No disponible"}</p>
                </section>
            </Modal>

            {/* Popup información del seguro */}
            <Modal
                footer={null}
                open={!!insurancePopup}
                onCancel={() => setInsurancePopup(null)}
                className="!max-w-sm !w-[calc(100%-2rem)]"
                centered
                closeIcon={
                    <FontAwesomeIcon icon={faCircleXmark} className="text-gray-500" size="lg" />
                }
                styles={{ body: { paddingTop: 8 } }}
            >
                {insurancePopup && (
                    <section className="py-2 font-century-gothic">
                        <h3 className="text-gray-900 font-bold text-lg mb-4">
                            {insurancePopup.name}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            <li className="flex items-center gap-3">
                                <span
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${insurancePopup.depositRequired ? "bg-green-100" : "bg-red-100"
                                        }`}
                                >
                                    {insurancePopup.depositRequired ? (
                                        <CheckIcon />
                                    ) : (
                                        <CloseIcon />
                                    )}
                                </span>
                                <span
                                    className={
                                        insurancePopup.depositRequired ? "text-green-700 font-medium" : "text-red-600 font-medium"
                                    }
                                >
                                    Depósito
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${insurancePopup.fullyContractedClinic ? "bg-green-100" : "bg-red-100"
                                        }`}
                                >
                                    {insurancePopup.fullyContractedClinic ? (
                                        <CheckIcon />
                                    ) : (
                                        <CloseIcon />
                                    )}
                                </span>
                                <span
                                    className={
                                        insurancePopup.fullyContractedClinic ? "text-green-700 font-medium" : "text-red-600 font-medium"
                                    }
                                >
                                    100% Convenida
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${insurancePopup.reasonableExpensesApplicable ? "bg-green-100" : "bg-red-100"
                                        }`}
                                >
                                    {insurancePopup.reasonableExpensesApplicable ? (
                                        <CheckIcon />
                                    ) : (
                                        <CloseIcon />
                                    )}
                                </span>
                                <span
                                    className={
                                        insurancePopup.reasonableExpensesApplicable ? "text-green-700 font-medium" : "text-red-600 font-medium"
                                    }
                                >
                                    Gastos razonables
                                </span>
                            </li>
                        </ul>
                    </section>
                )}
            </Modal>

            {/* Modal Seguros asociados (al hacer clic en "+N seguros más - ver detalles") */}
            <Modal
                footer={null}
                open={!!segurosAsociadosModalList?.length}
                onCancel={() => setSegurosAsociadosModalList(null)}
                className="!max-w-md !w-[calc(100%-2rem)]"
                centered
                title={null}
                closeIcon={
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                        <FontAwesomeIcon icon={faCircleXmark} className="text-lg" />
                    </span>
                }
                styles={{ header: { borderBottom: "none", paddingBottom: 0 } }}
            >
                {segurosAsociadosModalList && segurosAsociadosModalList.length > 0 && (
                    <section className="font-century-gothic pb-2">
                        <h2 className="text-gray-900 font-bold text-xl mb-4">Seguros asociados</h2>
                        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
                            {segurosAsociadosModalList.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                                >
                                    <h3 className="text-gray-900 font-bold text-base mb-3">{item.name}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                                item.depositRequired ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {item.depositRequired ? <CheckIcon /> : <CloseIcon />}
                                            Depósito
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                                item.fullyContractedClinic ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {item.fullyContractedClinic ? <CheckIcon /> : <CloseIcon />}
                                            100% Convenida
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                                                item.reasonableExpensesApplicable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {item.reasonableExpensesApplicable ? <CheckIcon /> : <CloseIcon />}
                                            Gastos razonables
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </Modal>

            {/* Modal Datos de contacto (al hacer clic en Contactar) */}
            <Modal
                footer={null}
                open={!!contactModalClinic}
                onCancel={() => setContactModalClinic(null)}
                className="!max-w-md !w-[calc(100%-2rem)]"
                centered
                title={null}
                closeIcon={
                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        <FontAwesomeIcon icon={faCircleXmark} className="text-lg" />
                    </span>
                }
                styles={{ header: { borderBottom: "none", paddingBottom: 0 } }}
            >
                {contactModalClinic && (() => {
                    const firstOffice = contactModalClinic.offices?.[0];
                    const addr = firstOffice?.address;
                    const displayAddress = addr
                        ? [addr.street, addr.city?.name, addr.state?.name, addr.country?.name].filter(Boolean).join(", ")
                        : "";
                    const phone = firstOffice?.phone ?? undefined;
                    const email = (contactModalClinic as SupplierType & { email?: string | null }).email ?? undefined;
                    const socialLinks = contactModalClinic.socialMediaLinks ?? [];
                    const websiteLink = socialLinks.find((l) => l.platform === SocialMediaPlatform.Website);
                    const websiteUrl = websiteLink?.url ?? undefined;
                    const whatsappLink = socialLinks.find((l) => l.platform === SocialMediaPlatform.Whatsapp);
                    const whatsappNumber = whatsappLink?.url ?? (phone ? phone.replace(/\D/g, "") : undefined);
                    const whatsappUrl = whatsappNumber
                        ? `https://wa.me/${whatsappNumber.startsWith("+") ? whatsappNumber.slice(1) : whatsappNumber}`
                        : undefined;
                    const googleMapsUrl = displayAddress
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayAddress)}`
                        : undefined;
                    const facebookLink = socialLinks.find((l) => l.platform === SocialMediaPlatform.Facebook);
                    const instagramLink = socialLinks.find((l) => l.platform === SocialMediaPlatform.Instagram);
                    const hasSocial = !!(facebookLink?.url || instagramLink?.url);

                    return (
                        <section className="font-century-gothic pb-2">
                            <h2 className="text-gray-900 font-bold text-xl text-center mb-6">Datos de contacto</h2>
                            <div className="flex flex-col gap-4">
                                {phone && (
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                                            <FontAwesomeIcon icon={faPhone} className="text-sm" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-gray-500 text-sm">Teléfono</p>
                                            <a href={`tel:${phone}`} className="text-blue-600 font-semibold hover:underline break-all">
                                                {phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {(whatsappUrl || phone) && (
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                            <FontAwesomeIcon icon={faWhatsapp} className="text-lg" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-gray-500 text-sm">WhatsApp</p>
                                            <a
                                                href={whatsappUrl || `tel:${phone}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 font-semibold hover:underline break-all"
                                            >
                                                {whatsappNumber || phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {email && (
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                                            <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-gray-500 text-sm">Correo</p>
                                            <a href={`mailto:${email}`} className="text-blue-600 font-semibold hover:underline break-all">
                                                {email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {displayAddress && (
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                                            <FontAwesomeIcon icon={faLocationDot} className="text-sm" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-gray-500 text-sm">Dirección</p>
                                            <a
                                                href={googleMapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 font-medium hover:underline break-all"
                                            >
                                                {displayAddress}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {websiteUrl && (
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                                            <FontAwesomeIcon icon={faGlobe} className="text-sm" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-gray-500 text-sm">Sitio web</p>
                                            <a
                                                href={websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 font-medium hover:underline break-all"
                                            >
                                                {websiteUrl}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {hasSocial && (
                                <>
                                    <div className="border-t border-gray-200 my-5" />
                                    <p className="text-gray-700 text-center mb-3">Redes sociales</p>
                                    <div className="flex justify-center gap-4">
                                        {facebookLink?.url && (
                                            <a
                                                href={facebookLink.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                                aria-label="Facebook"
                                            >
                                                <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
                                            </a>
                                        )}
                                        {instagramLink?.url && (
                                            <a
                                                href={instagramLink.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                                aria-label="Instagram"
                                            >
                                                <FontAwesomeIcon icon={faInstagram} className="text-lg" />
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </section>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default ClinicList;
