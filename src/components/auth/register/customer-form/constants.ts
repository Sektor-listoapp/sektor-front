import { GENRES } from "@/constants/auth";

const { MALE, FEMALE } = GENRES;

export const GENERIC_ERROR_MESSAGE =
  "Ocurrió un error al intentar crear tu cuenta, por favor intenta de nuevo más tarde.";

export const GENERIC_SUCCESS_MESSAGE =
  "Tu cuenta ha sido creada exitosamente, ahora puedes iniciar sesión.";

export const SELECT_GENRE_OPTIONS = [
  {
    label: "Sexo",
    value: "",
    disabled: true,
    hidden: true,
  },
  { label: "Femenino", value: FEMALE },
  { label: "Masculino", value: MALE },
];
