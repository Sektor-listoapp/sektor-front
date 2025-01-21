import { ORGANIZATION_COMPONENTS } from "@/components/organizations/constants";
import DefaultHeroBanner from "@/components/organizations/default-hero-banner";
import InsuranceCompaniesHeroBanner from "@/components/organizations/insurance-companies-hero-banner";
import Searchbar from "@/components/organizations/searchbar";
import { USER_TYPES } from "@/constants/auth";
import { useRouter } from "next/router";

const { INSURANCE_COMPANY } = USER_TYPES;

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
      {organizationType === INSURANCE_COMPANY ? (
        <InsuranceCompaniesHeroBanner />
      ) : (
        <DefaultHeroBanner />
      )}
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
