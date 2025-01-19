import BrokerageSocieties from "@/components/organizations/brokerage-societies";
import ExclusiveAgents from "@/components/organizations/exclusive-agents";
import HeroBanner from "@/components/organizations/hero-banner";
import InsuranceBrokers from "@/components/organizations/insurance-brokers";
import Suppliers from "@/components/organizations/suppliers";

const Organizations = () => {
  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start overflow-hidden">
      <HeroBanner />
      <main className="text-blue-500 w-full max-w-screen-xl flex flex-col items-center justify-center gap-8 py-10 px-7 2xl:px-0">
        <InsuranceBrokers />
        <BrokerageSocieties />
        <ExclusiveAgents />
        <Suppliers />
      </main>
    </div>
  );
};

export default Organizations;
