import {
  faCar,
  faHeart,
  faHouseMedical,
  faMoneyBill1Wave,
  faPassport,
  faPeopleRoof,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import { OrganizationLineOfBusiness } from "@/lib/sektor-api/__generated__/types";

const { Auto, Aviation, Financial, Health, Life, Property, Travel } =
  OrganizationLineOfBusiness;

export const LINE_OF_BUSINESS_CONTENT_MAP = {
  [Auto]: {
    icon: faCar,
    content:
      "Este ramo se enfoca en brindar protección a los vehículos y a los conductores. Las pólizas de automóviles cubren una amplia gama de riesgos, desde daños al vehículo propio hasta responsabilidad civil por daños a terceros.",
  },
  [Aviation]: {
    icon: faPlane,
    content: "Este ramo se enfoca en la aviación",
  },
  [Financial]: {
    icon: faMoneyBill1Wave,
    content: "Este ramo se enfoca en la protección de activos financieros",
  },
  [Health]: {
    icon: faHouseMedical,
    content:
      "Este ramo está relacionado con la protección de los gastos médicos. Las pólizas de salud cubren los costos asociados a enfermedades, accidentes y otros eventos que requieran atención médica.",
  },
  [Life]: {
    icon: faHeart,
    content:
      "Este ramo está relacionado con la protección de los gastos médicos. Las pólizas de salud cubren los costos asociados a enfermedades, accidentes y otros eventos que requieran atención médica.",
  },
  [Property]: {
    icon: faPeopleRoof,
    content:
      "Este ramo abarca la protección de bienes inmuebles y otros activos. Las pólizas de patrimonio cubren riesgos como incendios, robos, daños por agua, entre otros, y pueden incluir también cobertura para responsabilidad civil.",
  },
  [Travel]: {
    icon: faPassport,
    content: "Este ramo se enfoca en la protección de viajes",
  },
} as const;
