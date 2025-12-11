import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { faEdit, faTrash, faPlus, faCircleXmark, faMoneyBillWave, faHospital, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import Select from '@/components/ui/select';
import SwitchInput from '@/components/ui/switch-input';
import Button from '@/components/ui/button';
import { SupplierInsuranceCompanyRelationInputType, InsuranceCompanyType } from '@/lib/sektor-api/__generated__/types';

interface InsuranceCompanyRelation extends SupplierInsuranceCompanyRelationInputType {
    id?: string;
    companyName?: string;
    companyLogo?: string;
}

interface InsuranceCompanyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (relations: SupplierInsuranceCompanyRelationInputType[]) => void;
    existingRelations: InsuranceCompanyRelation[];
    insuranceCompanies: InsuranceCompanyType[];
    disabled?: boolean;

}

const InsuranceCompanyModal: React.FC<InsuranceCompanyModalProps> = ({
    isOpen,
    onClose,
    onSave,
    existingRelations,
    insuranceCompanies,
    disabled = false
}) => {
    const [relations, setRelations] = useState<InsuranceCompanyRelation[]>([]);
    const [editingRelation, setEditingRelation] = useState<InsuranceCompanyRelation | null>(null);
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        if (isOpen) {

            setRelations(existingRelations);
        }
    }, [isOpen, existingRelations]);

    const insuranceCompanyOptions = insuranceCompanies
        .map(company => ({
            label: company.name,
            value: company.id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const handleAddRelation = () => {
        setEditingRelation({
            insuranceCompanyId: '',
            depositRequired: false,
            fullyContractedClinic: false,
            reasonableExpensesApplicable: false
        });
        setIsEditing(true);
    };

    const handleEditRelation = (relation: InsuranceCompanyRelation) => {
        setEditingRelation({ ...relation });
        setIsEditing(true);
    };

    const handleDeleteRelation = (relationId: string) => {
        setRelations(prev => prev.filter(rel => rel.id !== relationId));
    };

    const handleSaveRelation = () => {

        if (!editingRelation?.insuranceCompanyId) {
            return;
        }

        const company = insuranceCompanies.find(c => c.id === editingRelation.insuranceCompanyId);


        const newRelation: InsuranceCompanyRelation = {
            ...editingRelation,
            id: editingRelation.id || `temp-${Date.now()}`,
            companyName: company?.name,
            companyLogo: company?.logoUrl || undefined
        };



        if (editingRelation.id) {

            setRelations(prev =>
                prev.map(rel => rel.id === editingRelation.id ? newRelation : rel)
            );
        } else {

            setRelations(prev => [...prev, newRelation]);
        }

        setEditingRelation(null);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditingRelation(null);
        setIsEditing(false);
    };

    const handleSaveAll = () => {
        const relationsToSave: SupplierInsuranceCompanyRelationInputType[] = relations.map(rel => ({
            insuranceCompanyId: rel.insuranceCompanyId,
            depositRequired: rel.depositRequired,
            fullyContractedClinic: rel.fullyContractedClinic,
            reasonableExpensesApplicable: rel.reasonableExpensesApplicable
        }));


        onSave(relationsToSave);
        onClose();
    };

    const getCompanyName = (companyId: string) => {
        const company = insuranceCompanies.find(c => c.id === companyId);
        return company?.name || 'Compañía no encontrada';
    };

    const getCompanyLogo = (companyId: string) => {
        const company = insuranceCompanies.find(c => c.id === companyId);
        return company?.logoUrl || '/images/placeholder.png';
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            width={800}
            closeIcon={null}
            footer={null}
            className="!w-11/12 md:!w-3/4 lg:!w-11/12 !max-w-[843px]"
            styles={{
                body: {
                    padding: "3rem 2rem",
                    borderRadius: "1.5rem",
                }
            }}
        >
            <section className="text-[#11284B] flex flex-col gap-10">
                <header className="flex flex-col gap-6">
                    <div className="w-full flex justify-end">
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            size="2xl"
                            className="cursor-pointer text-blue-500"
                            onClick={onClose}
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-start">
                        Compañías con las que trabajas
                    </h2>
                </header>

                <div className="space-y-4">

                    <div className="flex justify-end">
                        <Button
                            variant="solid-blue"
                            onClick={handleAddRelation}
                            disabled={disabled || isEditing}
                        >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Agregar Compañía
                        </Button>
                    </div>


                    <div className="space-y-3">
                        {relations.map((relation) => (
                            <div key={relation.id} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Image
                                            src={getCompanyLogo(relation.insuranceCompanyId)}
                                            alt={getCompanyName(relation.insuranceCompanyId)}
                                            width={40}
                                            height={40}
                                            className="rounded"
                                        />
                                        <div>
                                            <h4 className="font-medium">{getCompanyName(relation.insuranceCompanyId)}</h4>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div>Cobro de depósito: {relation.depositRequired ? 'Sí' : 'No'}</div>
                                                <div>100% Clínica convenida: {relation.fullyContractedClinic ? 'Sí' : 'No'}</div>
                                                <div>Aplica gastos razonables: {relation.reasonableExpensesApplicable ? 'Sí' : 'No'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            className="px-3 py-1"
                                            onClick={() => handleEditRelation(relation)}
                                            disabled={disabled}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="px-3 py-1 text-red-500 border-red-500 hover:bg-red-50"
                                            onClick={() => handleDeleteRelation(relation.id!)}
                                            disabled={disabled}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                    {isEditing && editingRelation && (
                        <div className="border-t pt-4">
                            <h4 className="font-medium mb-4">
                                {editingRelation.id ? 'Editar' : 'Agregar'} Compañía
                            </h4>

                            <div className="space-y-4">
                                <Select
                                    wrapperClassName="w-full"
                                    value={editingRelation.insuranceCompanyId}
                                    options={[
                                        { label: "Seleccionar compañía de seguros", value: "", disabled: true },
                                        ...insuranceCompanyOptions
                                    ]}
                                    onChange={(e) => {

                                        setEditingRelation(prev => ({ ...prev!, insuranceCompanyId: e.target.value }));
                                    }}
                                    disabled={disabled}
                                />

                                <div className="space-y-4">
                                    <SwitchInput
                                        icon={faMoneyBillWave}
                                        label="Cobro de depósito"
                                        switchProps={{
                                            checked: editingRelation.depositRequired || false,
                                            onChange: (checked) => setEditingRelation(prev => ({ ...prev!, depositRequired: checked })),
                                            disabled: disabled
                                        }}
                                    />

                                    <SwitchInput
                                        icon={faHospital}
                                        label="100% Clínica convenida"
                                        switchProps={{
                                            checked: editingRelation.fullyContractedClinic || false,
                                            onChange: (checked) => setEditingRelation(prev => ({ ...prev!, fullyContractedClinic: checked })),
                                            disabled: disabled
                                        }}
                                    />

                                    <SwitchInput
                                        icon={faReceipt}
                                        label="Aplica gastos razonables"
                                        switchProps={{
                                            checked: editingRelation.reasonableExpensesApplicable || false,
                                            onChange: (checked) => setEditingRelation(prev => ({ ...prev!, reasonableExpensesApplicable: checked })),
                                            disabled: disabled
                                        }}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                        disabled={disabled}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="solid-blue"
                                        onClick={handleSaveRelation}
                                        disabled={disabled || !editingRelation.insuranceCompanyId}
                                    >
                                        {editingRelation.id ? 'Actualizar' : 'Agregar'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {relations.length === 0 && !isEditing && (
                        <div className="text-center py-8 text-gray-500">
                            No hay compañías agregadas. Haz clic en &quot;Agregar Compañía&quot; para comenzar.
                        </div>
                    )}
                </div>

                <div className="w-full flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={disabled}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="solid-blue"
                        onClick={handleSaveAll}
                        disabled={disabled}
                    >
                        Guardar
                    </Button>
                </div>
            </section>
        </Modal>
    );
};

export default InsuranceCompanyModal;
