import React from "react";
import withAuth from "@/components/shared/with-auth";
import Header from "@/components/my-account/header";
import Navbar from "@/components/my-account/navbar";
import { useAuthStore } from "@/store/auth";
import { useShallow } from "zustand/shallow";
import InsuranceBrokerForm from "@/components/my-account/insurance-broker-form";

const MyAccount = () => {
  const userId = useAuthStore(useShallow((state) => state.user?.id));

  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start gap-8  overflow-hidden">
      <Navbar />
      <Header />

      <main className="text-blue-500 w-11/12 max-w-screen-xl border-2 border-red-500 flex flex-col items-center justify-center gap-4">
        <header className=" w-full flex flex-col items-center justify-center gap-2 border-4">
          <h2 className="text-lg md:text-xl lg:text-3xl">
            Llena el siguiente formulario
          </h2>
          <p className="font-century-gothic text-base text-center max-w-xl text-balance">
            Tú perfil es la ventana a nuevos prospectos asegurados, completa
            cada campo necesario y <b>Sektor</b> potenciará tu marca
          </p>
        </header>

        <InsuranceBrokerForm />
      </main>
    </div>
  );
};

export default withAuth(MyAccount);
