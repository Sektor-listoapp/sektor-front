import dayjs from "dayjs";

export const getFormattedYearsOfExperience = (yearsOfExperience: number) => {
  if (!yearsOfExperience) return;

  const currentYear = dayjs().year();
  const diff = currentYear - yearsOfExperience;

  if (diff === 0) {
    return "Menos de un año de experiencia";
  }
  if (diff === 1) {
    return "1 año de experiencia";
  }

  return `${diff} años de experiencia`;
};
