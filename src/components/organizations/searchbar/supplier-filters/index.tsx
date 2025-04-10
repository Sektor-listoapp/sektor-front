import React from "react";
import Select from "@/components/ui/select";
import { SELECT_SUPPLIER_SERVICE_OPTIONS } from "@/constants/forms";
import { getLocationOptions } from "@/utils/organizations";
import { COUNTRY_BY_CODE_QUERY } from "@/lib/sektor-api/queries";
import { Query } from "@/lib/sektor-api/__generated__/graphql";
import { useQuery } from "@apollo/client";

const SupplierFilters = () => {
  const { data: countryData, loading: isLoadingCountryData } = useQuery<Query>(
    COUNTRY_BY_CODE_QUERY,
    { variables: { code: "VE" } }
  );
  const locationOptions = getLocationOptions(countryData?.getCountryByCode);

  const [filters, setFilters] = React.useState({
    location: locationOptions[0].value,
    supplierType: SELECT_SUPPLIER_SERVICE_OPTIONS[0].value,
  });

  return (
    <section className="w-full flex flex-col gap-6 items-center justify-center">
      <Select
        wrapperClassName="w-full"
        options={locationOptions}
        value={filters.location}
        disabled={isLoadingCountryData}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, location: e.target.value }))
        }
        defaultValue={locationOptions[0].value}
      />

      <Select
        wrapperClassName="w-full"
        options={SELECT_SUPPLIER_SERVICE_OPTIONS}
        value={filters.supplierType}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, supplierType: e.target.value }))
        }
        defaultValue={SELECT_SUPPLIER_SERVICE_OPTIONS[0].value}
      />
    </section>
  );
};

export default SupplierFilters;
