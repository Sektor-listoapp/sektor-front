import React from "react";
import RegisterFormHeader from "../register-form-header";
import TextInput from "@/components/ui/text-input";
import PasswordInput from "@/components/ui/password-input";
import {
  faPerson,
  faUser,
  faPersonHalfDress,
} from "@fortawesome/free-solid-svg-icons";
import Select from "@/components/ui/select";
import { GENRES } from "@/constants/auth";
import DatePicker from "@/components/ui/date-picker";

const { MALE, FEMALE } = GENRES;

const CustomerForm = () => {
  return (
    <section>
      <RegisterFormHeader />

      <div className="border-2 border-green-500 flex flex-col gap-4 items-start justify-center mt-4 lg:my-8 xl:grid xl:grid-cols-2 xl:gap-y-8 xl:gap-x-8">
        <TextInput icon={faPerson} placeholder="Nombres y apellidos" required />
        <TextInput icon={faUser} placeholder="Correo electrónico" required />
        <PasswordInput placeholder="Contraseña" required />
        <PasswordInput placeholder="Confirmar contraseña" required />
        <div className="border-2 border-red-500 grid grid-cols-4 sm:grid-cols-3 gap-4 w-full xl:col-span-2 xl:grid-cols-2">
          <DatePicker
            wrapperClassName="col-span-2 sm:col-span-2 w-full xl:col-span-1"
            placeholder="Fecha de nacimiento"
            required
          />
          <Select
            wrapperClassName="col-span-2 sm:col-span-1 xl:col-span-1 xl:w-3/4 2xl:w-2/4"
            icon={faPersonHalfDress}
            required
            value=""
            options={[
              {
                label: "Sexo",
                value: "",
                disabled: true,
                hidden: true,
              },
              { label: "Femenino", value: FEMALE },
              { label: "Masculino", value: MALE },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default CustomerForm;
