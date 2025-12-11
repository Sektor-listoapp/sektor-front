import React, { useEffect, useState } from "react";
import { Modal, ModalProps } from "antd";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { SupplierInsuranceCompanyRelationInputType, InsuranceCompanyType } from "@/lib/sektor-api/__generated__/types";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InsuranceCompanyModalProps extends ModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    relationToEdit: string | null;
    localRelations: SupplierInsuranceCompanyRelationInputType[];
    setLocalRelations: React.Dispatch<React.SetStateAction<SupplierInsuranceCompanyRelationInputType[]>>;
    insuranceCompanies: InsuranceCompanyType[];
}

const InsuranceCompanyModal = ({
    open,
    setOpen,
    relationToEdit,
    localRelations,
    setLocalRelations,
    insuranceCompanies,
    ...modalProps
}: InsuranceCompanyModalProps) => {
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
    const [depositRequired, setDepositRequired] = useState<string>("");
    const [fullyContractedClinic, setFullyContractedClinic] = useState<string>("");
    const [reasonableExpensesApplicable, setReasonableExpensesApplicable] = useState<string>("");

    // Filter out companies that are already selected (except when editing)
    const availableCompanies = insuranceCompanies.filter(company => {
        if (relationToEdit && company.id === relationToEdit) {
            return true; // Allow the company being edited
        }
        return !localRelations.some(relation => relation.insuranceCompanyId === company.id);
    });

    const insuranceCompanyOptions = [
        { label: "Elige la compañía de seguro", value: "", disabled: true },
        ...availableCompanies
            .map(company => ({
                label: company.name,
                value: company.id
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
    ];

    const booleanOptions = [
        { label: "Sí", value: "true" },
        { label: "No", value: "false" }
    ];

    useEffect(() => {
        if (relationToEdit) {
            const existingRelation = localRelations.find(relation => relation.insuranceCompanyId === relationToEdit);
            if (existingRelation) {
                setSelectedCompanyId(existingRelation.insuranceCompanyId);
                setDepositRequired(existingRelation.depositRequired ? "true" : "false");
                setFullyContractedClinic(existingRelation.fullyContractedClinic ? "true" : "false");
                setReasonableExpensesApplicable(existingRelation.reasonableExpensesApplicable ? "true" : "false");
            }
        } else {
            setSelectedCompanyId("");
            setDepositRequired("");
            setFullyContractedClinic("");
            setReasonableExpensesApplicable("");
        }
    }, [relationToEdit, localRelations]);

    const handleClose = () => {
        setSelectedCompanyId("");
        setDepositRequired("");
        setFullyContractedClinic("");
        setReasonableExpensesApplicable("");
        setOpen(false);
    };

    const handleSubmit = () => {
        if (!selectedCompanyId) return;

        const newRelation: SupplierInsuranceCompanyRelationInputType = {
            insuranceCompanyId: selectedCompanyId,
            depositRequired: depositRequired === "true",
            fullyContractedClinic: fullyContractedClinic === "true",
            reasonableExpensesApplicable: reasonableExpensesApplicable === "true",
        };

        if (relationToEdit) {
            setLocalRelations(prev =>
                prev.map(relation =>
                    relation.insuranceCompanyId === relationToEdit ? newRelation : relation
                )
            );
        } else {
            setLocalRelations(prev => [...prev, newRelation]);
        }

        handleClose();
    };

    return (
        <Modal
            open={open}
            closeIcon={null}
            onClose={handleClose}
            onCancel={handleClose}
            footer={null}
            width={600}
            styles={{
                body: {
                    padding: '24px',
                    borderRadius: '30px'
                },
                content: {
                    borderRadius: '30px'
                }
            }}
            {...modalProps}
        >
            <div className="space-y-6">
                <header className="text-blue-500 flex flex-col gap-6">
                    <div className="w-full flex justify-end">
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            size="2xl"
                            className="cursor-pointer"
                            onClick={handleClose}
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-start">
                        Añadir compañía de seguros
                    </h2>
                </header>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-800">
                        Compañía de seguros
                    </label>
                    <Select
                        wrapperClassName="w-full"
                        value={selectedCompanyId}
                        options={insuranceCompanyOptions}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                    />
                </div>

                {/* Options Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-medium text-blue-800">
                        Selecciona la opción que es valida para este seguro
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Cobro deposito */}
                        <div className="space-y-2">
                            <Select
                                wrapperClassName="w-full"
                                value={depositRequired}
                                options={[
                                    { label: "Cobro deposito", value: "", disabled: true },
                                    ...booleanOptions
                                ]}
                                onChange={(e) => setDepositRequired(e.target.value)}
                            />
                        </div>

                        {/* 100% clinica convenida */}
                        <div className="space-y-2">
                            <Select
                                wrapperClassName="w-full"
                                value={fullyContractedClinic}
                                options={[
                                    { label: "100% clinica convenida", value: "", disabled: true },
                                    ...booleanOptions
                                ]}
                                onChange={(e) => setFullyContractedClinic(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Aplica gastos razonables */}
                    <div className="space-y-2">
                        <Select
                            wrapperClassName="w-full"
                            value={reasonableExpensesApplicable}
                            options={[
                                { label: "Aplica gastos razonables", value: "", disabled: true },
                                ...booleanOptions
                            ]}
                            onChange={(e) => setReasonableExpensesApplicable(e.target.value)}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center pt-4">
                    <Button
                        variant="solid-blue"
                        onClick={handleSubmit}
                        disabled={!selectedCompanyId}
                        className="px-8 py-2"
                    >
                        Guardar
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default InsuranceCompanyModal;
