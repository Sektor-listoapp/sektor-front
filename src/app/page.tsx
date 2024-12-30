import Footer from "@/components/home/footer";
import HeroBanner from "@/components/home/hero-banner";
import InsuranceBrokers from "@/components/home/insurance-brokers";
import InsuranceCompaniesInfo from "@/components/home/insurance-companies";
import Intermediaries from "@/components/home/intermediaries";
import JoinOurTeam from "@/components/home/join-our-team";
import Suppliers from "@/components/home/suppliers";

export default async function Home() {
  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start overflow-hidden">
      <HeroBanner />
      <main className="text-blue-500 w-full max-w-screen-xl flex flex-col items-center justify-center py-10 px-7 2xl:px-0">
        <InsuranceCompaniesInfo />
        <Intermediaries />
        <InsuranceBrokers />
        <Suppliers />
        <JoinOurTeam />
      </main>
      <Footer />
    </div>
  );
}
