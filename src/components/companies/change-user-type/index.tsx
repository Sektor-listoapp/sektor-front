import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Modal } from "antd";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import {
  ADMIN_USER_TYPE_SELECT_OPTIONS,
  ORGANIZATION_TYPE_SELECT_OPTIONS,
} from "@/constants/forms";
import { ADMIN_CHANGE_USER_TYPE } from "@/lib/sektor-api/mutations";
import {
  Mutation,
  MutationAdminChangeUserTypeArgs,
  OrganizationTypes,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import { parseApiError } from "@/utils/form/api-errors";

export const getUserTypeLabel = (type?: string | null) =>
  ADMIN_USER_TYPE_SELECT_OPTIONS.find((option) => option.value === type)
    ?.label ?? "Otro";

export const useChangeUserType = () => {
  const [mutate, { loading }] = useMutation<
    Mutation,
    MutationAdminChangeUserTypeArgs
  >(ADMIN_CHANGE_USER_TYPE);

  const changeUserType = async (userId: string, type: OrganizationTypes) => {
    try {
      await mutate({ variables: { input: { userId, type } } });
      toast.success(`Usuario cambiado a ${getUserTypeLabel(type)}.`);
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        parseApiError(
          error,
          "No se pudo cambiar el tipo de usuario, por favor intenta de nuevo más tarde."
        ).message
      );
      return false;
    }
  };

  return { changeUserType, isChangingUserType: loading };
};

export type ChangeUserTypeTarget = {
  id: string;
  name: string;
  /** Current OrganizationTypes value, or UserGroups.Customer for personas naturales. */
  currentType: string;
  newType: OrganizationTypes;
};

interface ChangeUserTypeModalProps {
  target: ChangeUserTypeTarget | null;
  onClose: () => void;
  onConfirm: (target: ChangeUserTypeTarget) => void;
  loading: boolean;
}

export const ChangeUserTypeModal = ({
  target,
  onClose,
  onConfirm,
  loading,
}: ChangeUserTypeModalProps) => {
  const isCustomer = target?.currentType === UserGroups.Customer;

  return (
    <Modal
      footer={null}
      open={Boolean(target)}
      onCancel={loading ? undefined : onClose}
      maskClosable={!loading}
    >
      <section className="flex flex-col items-center justify-center gap-8 text-blue-500 px-5 py-10">
        <h2 className="text-2xl font-bold font-arial-rounded text-center text-balance">
          ¿Cambiar a {target?.name} de {getUserTypeLabel(target?.currentType)} a{" "}
          {getUserTypeLabel(target?.newType)}?
        </h2>

        <p className="font-century-gothic text-center text-balance">
          {isCustomer
            ? "La persona natural pasará a tener un perfil de empresa, activo y visible en el directorio. Se conservan su nombre, correo y contraseña; completa su perfil después del cambio."
            : "Se conservan los datos del perfil. Los campos que el nuevo tipo requiera y no existan se crean vacíos para que los completes."}{" "}
          Si el usuario tiene la sesión abierta, verá el cambio al volver a
          iniciar sesión.
        </p>

        <footer className="flex flex-col gap-5 w-full md:flex-row md:gap-10">
          <Button
            className="w-full"
            variant="solid-blue"
            loading={loading}
            disabled={loading || !target}
            onClick={() => target && onConfirm(target)}
          >
            Confirmar
          </Button>
          <Button
            className="w-full bg-blue-200"
            variant="soft"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
        </footer>
      </section>
    </Modal>
  );
};

interface UserTypeSelectorProps {
  userId: string;
  name: string;
  currentType: string;
  onChanged: () => void;
}

/** Admin control on the account detail page to switch the user type. */
export const UserTypeSelector = ({
  userId,
  name,
  currentType,
  onChanged,
}: UserTypeSelectorProps) => {
  const [selectedType, setSelectedType] = useState("");
  const [target, setTarget] = useState<ChangeUserTypeTarget | null>(null);
  const { changeUserType, isChangingUserType } = useChangeUserType();

  const options = ORGANIZATION_TYPE_SELECT_OPTIONS.filter(
    (option) => option.value !== currentType
  );

  const handleConfirm = async ({ id, newType }: ChangeUserTypeTarget) => {
    const ok = await changeUserType(id, newType);
    if (!ok) return;
    setTarget(null);
    setSelectedType("");
    onChanged();
  };

  return (
    <section className="w-full flex flex-col gap-3 rounded-xl border border-blue-500 p-5 md:flex-row md:items-center md:justify-between font-century-gothic">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg">Tipo de usuario</h3>
        <p className="text-sm">
          Actual: <b>{getUserTypeLabel(currentType)}</b>
        </p>
      </div>

      <form
        className="flex flex-col gap-3 w-full md:w-auto md:flex-row md:items-center"
        onSubmit={(e) => {
          e.preventDefault();
          if (!selectedType) return;
          setTarget({
            id: userId,
            name,
            currentType,
            newType: selectedType as OrganizationTypes,
          });
        }}
      >
        <Select
          wrapperClassName="md:w-64"
          options={[
            { label: "Cambiar a…", value: "", disabled: true, hidden: true },
            ...options,
          ]}
          value={selectedType}
          disabled={isChangingUserType}
          onChange={(e) => setSelectedType(e.target.value)}
        />
        <Button
          type="submit"
          className="w-full md:w-fit md:px-10"
          variant="solid-blue"
          disabled={!selectedType || isChangingUserType}
        >
          Cambiar tipo
        </Button>
      </form>

      <ChangeUserTypeModal
        target={target}
        onClose={() => setTarget(null)}
        onConfirm={handleConfirm}
        loading={isChangingUserType}
      />
    </section>
  );
};
