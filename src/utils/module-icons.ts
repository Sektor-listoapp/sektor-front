export interface ModuleIconOption {
  label: string;
  value: string;
  imagePath: string;
}

const MODULE_ICON_NAMES = [
  "module_icon1",
  "module_icon2",
  "module_icon3",
  "module_icon4",
  "module_icon5",
  "module_icon6",
  "module_icon7",
  "module_icon8",
  "module_icon9",
  "module_icon10",
  "module_icon11",
  "module_icon12",
  "module_icon13",
  "module_icon14",
  "module_icon15",
  "module_icon16",
  "module_icon17",
  "module_icon18",
  "module_icon19",
  "module_icon20",
  "module_icon21",
  "module_icon22",
  "module_icon23",
  "module_icon24",
  "module_icon25",
  "module_icon26",
  "module_icon27",
  "module_icon28",
  "module_icon29",
  "module_icon30",
  "module_icon31",
  "module_icon32",
  "module_icon33",
  "module_icon34",
  "module_icon35",
  "module_icon36",
  "module_icon37",
  "module_icon38",
  "module_icon39",
];

export const MODULE_ICON_OPTIONS: ModuleIconOption[] = MODULE_ICON_NAMES.map((name, index) => ({
  label: `Icono ${index + 1}`,
  value: name,
  imagePath: `/module_icons/${name}.svg`,
}));

export function getModuleIcon(icon: string | null | undefined): string {
  const v = icon && typeof icon === "string" && icon.trim() ? icon : "module_icon1";
  return v;
}

export function getModuleIconPath(icon: string | null | undefined): string {
  const name = getModuleIcon(icon);
  return `/module_icons/${name}.svg`;
}
