import React from "react";
import SelectMultiple from "@/components/ui/select-multiple";
import TextInput from "@/components/ui/text-input";
import { SELECT_LINE_OF_BUSINESS_OPTIONS } from "@/constants/forms";

const SupplierForm = () => {
  return (
    <section className="border-2 border-blue-500 py-5 w-full flex flex-col items-center justify-center gap-10 font-century-gothic">
      <div className="w-full border-2 border-green-500 grid grid-cols-1 gap-10 md:grid-cols-2">
        <h3 className="col-span-2">Datos obligatorios</h3>

        <TextInput
          name="name"
          placeholder="Nombre completo"
          // error={Boolean(errors.name.length)}
          // errors={errors.name}
          // disabled={loading}
          // onChange={handleInputChange}
          // value={input.name}
        />

        <SelectMultiple
          wrapperClassName="w-full"
          selectProps={{
            placeholder: "Ramos con los que trabajas",
            options: SELECT_LINE_OF_BUSINESS_OPTIONS,
            notFoundContent: "No hay opciones disponibles",
          }}
        />

        <TextInput
          name="license"
          placeholder="SCSMP-"
          maxLength={12}
          // error={Boolean(errors.license.length)}
          // errors={errors.license}
          // disabled={loading}
          // onChange={handleInputChange}
          // value={input.license}
          popoverProps={{
            content: (
              <p className="text-xs max-w-xs text-white font-century-gothic">
                Ingresa tus credenciales como<b> sociedad de corretaje. </b>
                Con el formato<b> SCSMP-123456</b>
              </p>
            ),
          }}
        />

        <TextInput
          name="identification"
          placeholder="Documento de identidad"
          // error={Boolean(errors.name.length)}
          // errors={errors.name}
          // disabled={loading}
          // onChange={handleInputChange}
          // value={input.name}
        />
      </div>
      <div className="w-full border-2 border-orange-500">
        <h3>Datos adicionales</h3>
      </div>
    </section>
  );
};

export default SupplierForm;
