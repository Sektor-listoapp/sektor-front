import { ROUTES } from "@/constants/router";

export const SUPPLIER_SERVICES = [
  {
    type: "Clinicas",
    image: "/images/clinicas.webp",
    url: ROUTES.ORGANIZATIONS,
    info: ["Seguros activos", "Ubicaciones"],
  },
  {
    type: "Laboratorios",
    image: "/images/laboratorios.webp",
    url: ROUTES.ORGANIZATIONS,
    info: ["Seguros activos", "Ubicaciones"],
  },
  {
    type: "Talleres",
    image: "/images/talleres.webp",
    url: ROUTES.ORGANIZATIONS,
    info: ["Seguros activos", "Ubicaciones"],
  },
  {
    type: "Casas médicas",
    image: "/images/casas-medicas.webp",
    url: ROUTES.ORGANIZATIONS,
    info: ["Seguros activos", "Ubicaciones"],
  },
] as const;
