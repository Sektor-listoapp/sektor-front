import HeroBanner from "@/components/home/hero-banner";
import InsuranceCompaniesInfo from "@/components/home/insurance-companies";
import Intermediaries from "@/components/home/intermediaries";
import InsuranceBrokers from "@/components/home/insurance-brokers";
import Suppliers from "@/components/home/suppliers";
import JoinOurTeam from "@/components/home/join-our-team";
import Footer from "@/components/home/footer";
import createSektorApiClient from "@/lib/sektor-api/conflg/client";
import { PUBLIC_ORGANIZATIONS_QUERY } from "@/lib/sektor-api/queries";
import { PublicOrganizationType } from "@/types/public";

interface HomeProps {
  insuranceCompanies: PublicOrganizationType[];
}

const Home = ({ insuranceCompanies }: HomeProps) => {
  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start overflow-hidden">
      <HeroBanner />
      <main className="text-blue-500 w-full max-w-screen-xl flex flex-col items-center justify-center py-10 px-7 2xl:px-0">
        <InsuranceCompaniesInfo insuranceCompanies={insuranceCompanies} />
        <Intermediaries />
        <InsuranceBrokers />
        <Suppliers />
        <JoinOurTeam />
      </main>
      <Footer />
    </div>
  );
};

export async function getServerSideProps() {
  const client = createSektorApiClient();
  const { data } = await client.query({
    query: PUBLIC_ORGANIZATIONS_QUERY,
    variables: { type: "InsuranceCompany" },
  });

  return {
    props: {
      insuranceCompanies: data?.getPublicOrganizations?.items || [],
    },
  };
}

export default Home;
