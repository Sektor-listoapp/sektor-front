import Button from "@/components/ui/button";
import {
  COMPANY_SORT_OPTIONS,
  CompanySortOption,
} from "../constants";

interface CompanySortControlsProps {
  value: CompanySortOption;
  onChange: (sort: CompanySortOption) => void;
  disabled?: boolean;
}

const CompanySortControls = ({
  value,
  onChange,
  disabled = false,
}: CompanySortControlsProps) => (
  <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
    <span className="text-sm font-century-gothic text-blue-500 shrink-0">
      Ordenar:
    </span>
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <Button
        type="button"
        variant={value === COMPANY_SORT_OPTIONS.name ? "solid-blue" : "outline"}
        className="w-full sm:w-auto text-sm px-4 py-2"
        disabled={disabled}
        onClick={() => onChange(COMPANY_SORT_OPTIONS.name)}
      >
        Ordenar de forma alfabética
      </Button>
      <Button
        type="button"
        variant={
          value === COMPANY_SORT_OPTIONS.createdAt ? "solid-blue" : "outline"
        }
        className="w-full sm:w-auto text-sm px-4 py-2"
        disabled={disabled}
        onClick={() => onChange(COMPANY_SORT_OPTIONS.createdAt)}
      >
        Ordenar por fecha de creación
      </Button>
    </div>
  </div>
);

export default CompanySortControls;
