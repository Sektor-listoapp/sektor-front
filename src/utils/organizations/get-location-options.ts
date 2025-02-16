import { CountryType, Maybe } from "@/lib/sektor-api/__generated__/graphql";

export const getLocationOptions = (
  countryData: Maybe<CountryType> | undefined,
  detailed = false
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
    value: String(state?.id),
  }));

  const detailedLocations = countryData?.states
    .map((state) => {
      return state?.cities.map((city) => ({
        label: `${city?.name}, ${state?.name}`,
        value: String(city?.id),
      }));
    })
    .flat();

  if (detailed) {
    return [...locationOptions, ...detailedLocations];
  }

  return [...locationOptions, ...states];
};
