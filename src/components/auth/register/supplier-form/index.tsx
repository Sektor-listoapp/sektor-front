import React from "react";
import RegisterFormHeader from "../register-form-header";
import TextInput from "@/components/ui/text-input";
import PasswordInput from "@/components/ui/password-input";
import Select from "@/components/ui/select";
import {
  faBriefcase,
  faPerson,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const supplierTypeOptions = [
  { label: "Tipo de proveedor", value: "", disabled: true, hidden: true },
  { label: "Clinica", value: "clinica" },
  { label: "Taller", value: "taller" },
  { label: "Casa medica", value: "casa-medica" },
  { label: "atencion medica primaria", value: "primary-health-care" },
];

const SupplierForm = () => {
  return (
    <section>
      <RegisterFormHeader />

      <div className="border-2 border-green-500 flex flex-col gap-4 items-start justify-center mt-4 lg:my-8 xl:grid xl:grid-cols-2 xl:gap-y-8 xl:gap-x-8">
        <TextInput icon={faPerson} placeholder="Nombres y apellidos" required />
        <TextInput
          type="email"
          autoComplete="off"
          icon={faUser}
          placeholder="Correo electrónico"
          required
        />
        <PasswordInput placeholder="Contraseña" required />
        <PasswordInput placeholder="Confirmar contraseña" required />
        <Select
          icon={faBriefcase}
          required
          value=""
          options={supplierTypeOptions}
        />
      </div>
    </section>
  );
};

export default SupplierForm;
