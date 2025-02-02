import { ORGANIZATION_COMPONENTS } from "@/components/organizations/constants";
import HeroBanner from "@/components/organizations/hero-banner";
import Searchbar from "@/components/organizations/searchbar";
import OrganizationDetailsModal from "@/components/shared/organization-details-modal";
import Spinner from "@/components/ui/spinner";
import { usePublicOrganizationsStore } from "@/store/public-organizations";
import { useRouter } from "next/router";

const Organizations = () => {
  const { query } = useRouter();
  const organizationType = query?.type;
  const isLoadingPublicOrganizations = usePublicOrganizationsStore(
    (state) => state.isLoadingPublicOrganizations
  );

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
        {isLoadingPublicOrganizations ? (
          <div className="w-full transition-all py-20 lg:py-10">
            <Spinner className="m-auto w-10 h-10 text-blue-500 text-opacity-70" />
          </div>
        ) : (
          filteredOrganizationTypes.map(
            ({ component: Organization, type }, index) => (
              <Organization key={`${type}-organization-${index}`} />
            )
          )
        )}
      </main>
      <OrganizationDetailsModal />
    </div>
  );
};

export default Organizations;
