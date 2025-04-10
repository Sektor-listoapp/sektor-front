import {
  AutoCoverages,
  AutoUsageTypes,
} from "@/lib/sektor-api/__generated__/types";

const {
  TotalLossCoverage,
  ComprehensiveCoverage,
  BasicThirdPartyLiability,
  BasicThirdPartyLiabilityPlusTowingService,
} = AutoCoverages;

const { Cargo, Motorcycle, Personal, Pickup, Rustic } = AutoUsageTypes;

export const AUTO_COVERAGE_OPTIONS = [
  {
    label: "Tipo de cobertura",
    value: "",
    disabled: true,
    hidden: true,
  },
  {
    label: "Responsabilidad civil básica",
    value: BasicThirdPartyLiability,
  },
  {
    label: "Responsabilidad civil básica + grúa",
    value: BasicThirdPartyLiabilityPlusTowingService,
  },
  {
    label: "Cobertura amplia",
    value: ComprehensiveCoverage,
  },
  {
    label: "Cobertura total",
    value: TotalLossCoverage,
  },
];

export const AUTO_USAGE_TYPE_OPTIONS = [
  {
    label: "Tipo de auto",
    value: "",
    disabled: true,
    hidden: true,
  },
  {
    label: "Particular",
    value: Personal,
  },
  {
    label: "Rústico",
    value: Rustic,
  },
  {
    label: "Pick Up",
    value: Pickup,
  },
  {
    label: "Carga",
    value: Cargo,
  },
  {
    label: "Moto",
    value: Motorcycle,
  },
];
