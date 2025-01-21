import React from "react";
import Select from "@/components/ui/select";
import {
  SELECT_LOCATION_OPTIONS,
  SELECT_SUPPLIER_SERVICE_OPTIONS,
} from "@/constants/forms";

const SupplierFilters = () => {
  const [filters, setFilters] = React.useState({
    location: SELECT_LOCATION_OPTIONS[0].value,
    supplierType: SELECT_SUPPLIER_SERVICE_OPTIONS[0].value,
  });

  return (
    <section className="w-full flex flex-col gap-6 items-center justify-center">
      <Select
        wrapperClassName="w-full"
        options={SELECT_LOCATION_OPTIONS}
        value={filters.location}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, location: e.target.value }))
        }
        defaultValue={SELECT_LOCATION_OPTIONS[0].value}
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
