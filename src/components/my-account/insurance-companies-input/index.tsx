import React, { useEffect, useMemo, useState } from "react";
import { faPen, faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import { useLocalStorage } from "@uidotdev/usehooks";
import { cn } from "@/utils/class-name";
import InsuranceCompanyModal from "./insurance-company-modal";
import { SupplierInsuranceCompanyRelationInputType, InsuranceCompanyType } from "@/lib/sektor-api/__generated__/types";

interface InsuranceCompaniesInputProps {
    disabled?: boolean;
    setHasInsuranceCompanies: React.Dispatch<React.SetStateAction<boolean>>;
    insuranceCompanyRelations?: SupplierInsuranceCompanyRelationInputType[];
    insuranceCompanies: InsuranceCompanyType[];
}

const InsuranceCompaniesInput = ({
    disabled,
    setHasInsuranceCompanies,
    insuranceCompanyRelations = [],
    insuranceCompanies = [],
}: InsuranceCompaniesInputProps) => {
    const [localRelations, setLocalRelations] = useLocalStorage<SupplierInsuranceCompanyRelationInputType[]>(
        "insurance-company-relations",
        []
    );

    const [openModal, setOpenModal] = useState(false);
    const [relationToEdit, setRelationToEdit] = useState<string | null>(null);

    useEffect(() => {
        setHasInsuranceCompanies(localRelations.length > 0);
    }, [localRelations, setHasInsuranceCompanies]);

    useEffect(() => {
        if (insuranceCompanyRelations && insuranceCompanyRelations.length > 0) {
            const formattedRelations = insuranceCompanyRelations.map((relation: SupplierInsuranceCompanyRelationInputType) => ({
                insuranceCompanyId: relation.insuranceCompanyId,
                depositRequired: relation.depositRequired,
                fullyContractedClinic: relation.fullyContractedClinic,
                reasonableExpensesApplicable: relation.reasonableExpensesApplicable
            }));
            setLocalRelations(formattedRelations);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const options = useMemo(() => {
        const getCompanyName = (companyId: string) => {
            const company = insuranceCompanies.find(c => c.id === companyId);
            return company?.name || 'Compañía no encontrada';
        };

        return localRelations.map((relation) => {
            const companyName = getCompanyName(relation.insuranceCompanyId);
            const features = [
                relation.depositRequired && 'Depósito',
                relation.fullyContractedClinic && '100% Convenida',
                relation.reasonableExpensesApplicable && 'Gastos Razonables'
            ].filter(Boolean).join(' • ') || 'Sin características especiales';

            return {
                label: `${companyName}: ${features}`,
                value: relation.insuranceCompanyId,
                data: {
                    label: companyName,
                    value: relation.insuranceCompanyId,
                    insuranceCompanyId: relation.insuranceCompanyId,
                    depositRequired: relation.depositRequired,
                    fullyContractedClinic: relation.fullyContractedClinic,
                    reasonableExpensesApplicable: relation.reasonableExpensesApplicable,
                },
            };
        });
    }, [localRelations, insuranceCompanies]);

    return (
        <>
            <div
                className={cn(
                    "w-full border rounded-xl h-[46px] overflow-hidden border-blue-500 relative flex justify-between items-center cursor-pointer px-4",
                    {
                        "border-red-500": localRelations.length === 0,
                    }
                )}
            >
                <span className="text-sm">Compañías con las que trabajas</span>
                <Select
                    className="w-full absolute inset-0 h-full opacity-0"
                    suffixIcon={null}
                    size="large"
                    disabled={disabled}
                    value={null}
                    options={options}
                    notFoundContent="No hay compañías agregadas"
                    optionRender={(option) => (
                        <div className="flex items-center gap-3 justify-between p-2 bg-transparent">
                            <div>
                                <b>{option?.data?.data?.label}:</b> {[
                                    option?.data?.data?.depositRequired && 'Depósito',
                                    option?.data?.data?.fullyContractedClinic && '100% Convenida',
                                    option?.data?.data?.reasonableExpensesApplicable && 'Gastos Razonables'
                                ].filter(Boolean).join(' • ') || 'Sin características especiales'}
                            </div>
                            <FontAwesomeIcon
                                className="ml-auto cursor-pointer"
                                icon={faPen}
                                size="lg"
                                title="Editar"
                                onClick={() => {
                                    setRelationToEdit(option?.data?.data?.insuranceCompanyId);
                                    setOpenModal(true);
                                }}
                            />
                            <FontAwesomeIcon
                                className="ml-2 cursor-pointer text-red-500"
                                icon={faTrashCan}
                                size="lg"
                                title="Eliminar"
                                onClick={() => {
                                    const updatedRelations = localRelations.filter(
                                        (relation) => relation.insuranceCompanyId !== option?.data?.data?.insuranceCompanyId
                                    );
                                    setLocalRelations(updatedRelations);
                                }}
                            />
                        </div>
                    )}
                />
                <div className="flex items-center justify-center gap-3 h-full w-fit bg-white z-10">
                    <FontAwesomeIcon
                        icon={faPlus}
                        size="xl"
                        title="Agregar"
                        onClick={() => {
                            setRelationToEdit(null);
                            setOpenModal(true);
                        }}
                    />
                </div>
            </div>

            <InsuranceCompanyModal
                open={openModal}
                relationToEdit={relationToEdit}
                setOpen={setOpenModal}
                localRelations={localRelations}
                setLocalRelations={setLocalRelations}
                insuranceCompanies={insuranceCompanies}
            />
        </>
    );
};

export default InsuranceCompaniesInput;
