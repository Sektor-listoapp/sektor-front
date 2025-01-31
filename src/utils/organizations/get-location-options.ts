import { CountryType, Maybe } from "@/lib/sektor-api/__generated__/graphql";

export const getLocationOptions = (
  countryData: Maybe<CountryType> | undefined
) => {
  const locationOptions = [
    {
      label: "Ubicación",
      value: "",
      disabled: true,
      hidden: true,
    },
  ];

  if (!countryData) return locationOptions;

  const states = countryData?.states.map((state) => ({
    label: state?.name,
    value: state?.id,
  }));

  return [...locationOptions, ...states];
};
