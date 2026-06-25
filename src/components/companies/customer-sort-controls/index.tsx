import Button from "@/components/ui/button";
import {
  CUSTOMER_SORT_OPTIONS,
  CustomerSortOption,
} from "../constants";

interface CustomerSortControlsProps {
  value: CustomerSortOption;
  onChange: (sort: CustomerSortOption) => void;
  disabled?: boolean;
}

const CustomerSortControls = ({
  value,
  onChange,
  disabled = false,
}: CustomerSortControlsProps) => (
  <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
    <span className="text-sm font-century-gothic text-blue-500 shrink-0">
      Ordenar:
    </span>
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Button
        type="button"
        variant={value === CUSTOMER_SORT_OPTIONS.name ? "solid-blue" : "outline"}
        className="w-full sm:w-auto text-sm px-4 py-2"
        disabled={disabled}
        onClick={() => onChange(CUSTOMER_SORT_OPTIONS.name)}
      >
        Ordenar de forma alfabética
      </Button>
      <Button
        type="button"
        variant={
          value === CUSTOMER_SORT_OPTIONS.createdAt ? "solid-blue" : "outline"
        }
        className="w-full sm:w-auto text-sm px-4 py-2"
        disabled={disabled}
        onClick={() => onChange(CUSTOMER_SORT_OPTIONS.createdAt)}
      >
        Ordenar por fecha de creación
      </Button>
    </div>
  </div>
);

export default CustomerSortControls;
