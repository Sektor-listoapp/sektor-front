import React, { useState, useEffect } from 'react';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Button from '@/components/ui/button';
import InsuranceCompanyModal from './insurance-company-modal';
import { SupplierInsuranceCompanyRelationInputType, InsuranceCompanyType } from '@/lib/sektor-api/__generated__/types';
import { useLocalStorage } from '@uidotdev/usehooks';

interface InsuranceCompaniesButtonProps {
    relations: SupplierInsuranceCompanyRelationInputType[];
    insuranceCompanyRelations?: SupplierInsuranceCompanyRelationInputType[];
    insuranceCompanies: InsuranceCompanyType[];
    onRelationsChange: (relations: SupplierInsuranceCompanyRelationInputType[]) => void;
    disabled?: boolean;
}

const InsuranceCompaniesButton: React.FC<InsuranceCompaniesButtonProps> = ({
    insuranceCompanyRelations = [],
    insuranceCompanies,
    onRelationsChange,
    disabled = false
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localRelations, setLocalRelations] = useLocalStorage<SupplierInsuranceCompanyRelationInputType[]>(
        "insurance-company-relations",
        []
    );

   
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

    const getCompanyName = (companyId: string) => {
        const company = insuranceCompanies.find(c => c.id === companyId);
        return company?.name || 'Compañía no encontrada';
    };

    const getCompanyLogo = (companyId: string) => {
        const company = insuranceCompanies.find(c => c.id === companyId);
        return company?.logoUrl || '/images/placeholder.png';
    };

    const handleSaveRelations = (newRelations: SupplierInsuranceCompanyRelationInputType[]) => {
        console.log('🔍 DEBUG - InsuranceCompaniesButton received relations:', newRelations);
        console.log('🔍 DEBUG - Relations count:', newRelations.length);
        setLocalRelations(newRelations);
        onRelationsChange(newRelations);
    };

    const getButtonText = () => {
        if (localRelations.length === 0) {
            return 'Agregar compañías con las que trabajas';
        }
        return `Editar compañías (${localRelations.length})`;
    };

    const getButtonIcon = () => {
        return localRelations.length === 0 ? faPlus : faEdit;
    };

    return (
        <>
            <div className="w-full">
                <Button
                    variant="outline"
                    className="w-full h-12 border-dashed border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500"
                    onClick={() => setIsModalOpen(true)}
                    disabled={disabled}
                >
                    <FontAwesomeIcon icon={getButtonIcon()} className="mr-2" />
                    {getButtonText()}
                </Button>

               
                {localRelations.length > 0 && (
                    <div className="mt-3 space-y-2">
                        <div className="text-sm text-gray-600 font-medium">
                            Compañías seleccionadas:
                        </div>
                        <div className="space-y-2">
                            {localRelations.map((relation, index) => (
                                <div key={`${relation.insuranceCompanyId}-${index}`} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                                    <Image
                                        src={getCompanyLogo(relation.insuranceCompanyId)}
                                        alt={getCompanyName(relation.insuranceCompanyId)}
                                        width={32}
                                        height={32}
                                        className="rounded"
                                    />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">{getCompanyName(relation.insuranceCompanyId)}</div>
                                        <div className="text-xs text-gray-500">
                                            {[
                                                relation.depositRequired && 'Depósito',
                                                relation.fullyContractedClinic && '100% Convenida',
                                                relation.reasonableExpensesApplicable && 'Gastos Razonables'
                                            ].filter(Boolean).join(' • ') || 'Sin características especiales'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <InsuranceCompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRelations}
                existingRelations={localRelations.map((relation, index) => ({
                    ...relation,
                    id: `${relation.insuranceCompanyId}-${index}`,
                    companyName: getCompanyName(relation.insuranceCompanyId),
                    companyLogo: getCompanyLogo(relation.insuranceCompanyId)
                }))}
                insuranceCompanies={insuranceCompanies}
                disabled={disabled}
            />
        </>
    );
};

export default InsuranceCompaniesButton;
