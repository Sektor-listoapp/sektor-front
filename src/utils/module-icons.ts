export interface ModuleIconOption {
  label: string;
  value: string;
  imagePath: string;
}


const WEBP_ICONS = ["icon1", "icon2", "icon3", "icon4", "icon5", "icon6", "icon7", "icon8", "icon9", "icon10"];

export const MODULE_ICON_OPTIONS: ModuleIconOption[] = [
  { label: "Icono 1", value: "icon1", imagePath: "/images/modules-icons/icon1.webp" },
  { label: "Icono 2", value: "icon2", imagePath: "/images/modules-icons/icon2.webp" },
  { label: "Icono 3", value: "icon3", imagePath: "/images/modules-icons/icon3.webp" },
  { label: "Icono 4", value: "icon4", imagePath: "/images/modules-icons/icon4.webp" },
  { label: "Icono 5", value: "icon5", imagePath: "/images/modules-icons/icon5.webp" },
  { label: "Icono 6", value: "icon6", imagePath: "/images/modules-icons/icon6.webp" },
  { label: "Icono 7", value: "icon7", imagePath: "/images/modules-icons/icon7.webp" },
  { label: "Icono 8", value: "icon8", imagePath: "/images/modules-icons/icon8.webp" },
  { label: "Icono 9", value: "icon9", imagePath: "/images/modules-icons/icon9.webp" },
  { label: "Icono 10", value: "icon10", imagePath: "/images/modules-icons/icon10.webp" },
  { label: "Icono 11", value: "icon11", imagePath: "/images/modules-icons/icon11.png" },
  { label: "Icono 12", value: "icon12", imagePath: "/images/modules-icons/icon12.png" },
  { label: "Icono 13", value: "icon13", imagePath: "/images/modules-icons/icon13.png" },
  { label: "C-16", value: "c-16", imagePath: "/images/modules-icons/c-16.png" },
  { label: "C-17", value: "c-17", imagePath: "/images/modules-icons/c-17.png" },
  { label: "C-18", value: "c-18", imagePath: "/images/modules-icons/c-18.png" },
  { label: "C-19", value: "c-19", imagePath: "/images/modules-icons/c-19.png" },
  { label: "C-20", value: "c-20", imagePath: "/images/modules-icons/c-20.png" },
  { label: "C-21", value: "c-21", imagePath: "/images/modules-icons/c-21.png" },
  { label: "Logos 01", value: "logos-01", imagePath: "/images/modules-icons/logos-01.png" },
  { label: "Logos 02", value: "logos-02", imagePath: "/images/modules-icons/logos-02.png" },
  { label: "Logos 03", value: "logos-03", imagePath: "/images/modules-icons/logos-03.png" },
  { label: "Logos 04", value: "logos-04", imagePath: "/images/modules-icons/logos-04.png" },
  { label: "Logos 05", value: "logos-05", imagePath: "/images/modules-icons/logos-05.png" },
  { label: "Logos 06", value: "logos-06", imagePath: "/images/modules-icons/logos-06.png" },
  { label: "Logos 07", value: "logos-07", imagePath: "/images/modules-icons/logos-07.png" },
  { label: "Logos 08", value: "logos-08", imagePath: "/images/modules-icons/logos-08.png" },
  { label: "Logos 09", value: "logos-09", imagePath: "/images/modules-icons/logos-09.png" },
  { label: "Logos 10", value: "logos-10", imagePath: "/images/modules-icons/logos-10.png" },
  { label: "Logos 11", value: "logos-11", imagePath: "/images/modules-icons/logos-11.png" },
  { label: "Logos 12", value: "logos-12", imagePath: "/images/modules-icons/logos-12.png" },
  { label: "Logos 13", value: "logos-13", imagePath: "/images/modules-icons/logos-13.png" },
  { label: "Logos 14", value: "logos-14", imagePath: "/images/modules-icons/logos-14.png" },
  { label: "Logos 15", value: "logos-15", imagePath: "/images/modules-icons/logos-15.png" },
];

export function getModuleIcon(icon: string | null | undefined): string {
  const v = icon && typeof icon === "string" && icon.trim() ? icon : "icon1";
  return v;
}

export function getModuleIconPath(icon: string | null | undefined): string {
  const name = getModuleIcon(icon);
  const ext = WEBP_ICONS.includes(name) ? "webp" : "png";
  return `/images/modules-icons/${name}.${ext}`;
}
