export interface ModuleIconOption {
  label: string;
  value: string;
  imagePath: string;
}


const PNG_ICONS = ["icon11", "icon12", "icon13"];

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
];


export function getModuleIcon(icon: string | null | undefined): string {
  const v = icon && typeof icon === "string" && icon.trim() ? icon : "icon1";
  return v;
}

export function getModuleIconPath(icon: string | null | undefined): string {
  const name = getModuleIcon(icon);
  const ext = PNG_ICONS.includes(name) ? "png" : "webp";
  return `/images/modules-icons/${name}.${ext}`;
}
