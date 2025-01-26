import { ORGANIZATION_COMPONENTS } from "@/components/organizations/constants";
import HeroBanner from "@/components/organizations/hero-banner";
import Searchbar from "@/components/organizations/searchbar";
import { useRouter } from "next/router";

const Organizations = () => {
  const { query } = useRouter();
  const organizationType = query?.type;

  const filteredOrganizationTypes = ORGANIZATION_COMPONENTS.filter(
    (organization) => {
      const isSelected = organizationType === organization.type;
      return !organizationType || isSelected;
    }
  );

  return (
    <div className="min-h-svh bg-white text-white w-full flex flex-col items-center justify-start overflow-hidden">
      <HeroBanner />
      <main className="text-blue-500 w-full max-w-screen-xl flex flex-col items-center justify-center gap-8 py-10 px-7 2xl:px-0">
        <Searchbar />
        {filteredOrganizationTypes.map(
          ({ component: Organization, type }, index) => (
            <Organization key={`${type}-organization-${index}`} />
          )
        )}
      </main>
    </div>
  );
};

export default Organizations;
