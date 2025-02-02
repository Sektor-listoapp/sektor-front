import dayjs from "dayjs";

export const getFormattedYearsOfExperience = (yearsOfExperience: number) => {
  if (!yearsOfExperience) return;

  const diff = dayjs().diff(yearsOfExperience, "year");
  if (diff === 0) {
    return "Menos de un año";
  }
  if (diff === 1) {
    return "1 año de experiencia";
  }

  return `${yearsOfExperience} años de experiencia`;
};
