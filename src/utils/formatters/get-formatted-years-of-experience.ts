import dayjs from "dayjs";

export const getFormattedYearsOfExperience = (startDate: string) => {
  if (!startDate) return;

  const yearsOfExperience = dayjs().diff(startDate, "year");
  if (yearsOfExperience === 0) {
    return "Menos de un año";
  }
  if (yearsOfExperience === 1) {
    return "1 año de experiencia";
  }

  return `${yearsOfExperience} años de experiencia`;
};
