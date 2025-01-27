import { ORGANIZATION_MODALITY } from "@/constants/shared";
import {
  faBuildingCircleCheck,
  faGlobe,
  faHouseLaptop,
} from "@fortawesome/free-solid-svg-icons";

const { HYBRID, ONLINE, PHYSICAL } = ORGANIZATION_MODALITY;

export const ORGANIZATION_MODALITY_LABEL = {
  [HYBRID]: "Oficina física y online",
  [ONLINE]: "Oficina online",
  [PHYSICAL]: "Oficina física",
};

export const ORGANIZATION_MODALITY_ICON = {
  [HYBRID]: faGlobe,
  [ONLINE]: faHouseLaptop,
  [PHYSICAL]: faBuildingCircleCheck,
};
