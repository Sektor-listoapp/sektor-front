export interface ModuleIconOption {
  label: string;
  value: string;
  imagePath: string;
}

const MODULE_ICON_NAMES = [
  // Existing icons
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

  // New icons
  "module_icon_new_01",
  "module_icon_new_02",
  "module_icon_new_03",
  "module_icon_new_04",
  "module_icon_new_05",
  "module_icon_new_06",
  "module_icon_new_07",
  "module_icon_new_08",
  "module_icon_new_09",
  "module_icon_new_10",
  "module_icon_new_11",
  "module_icon_new_12",
  "module_icon_new_13",
  "module_icon_new_14",
  "module_icon_new_15",
  "module_icon_new_16",
  "module_icon_new_17",
  "module_icon_new_18",
  "module_icon_new_19",
  "module_icon_new_20",
  "module_icon_new_21",
  "module_icon_new_22",
  "module_icon_new_23",
  "module_icon_new_24",
  "module_icon_new_25",
  "module_icon_new_26",
  "module_icon_new_27",
  "module_icon_new_28",
  "module_icon_new_29",
  "module_icon_new_30",
  "module_icon_new_31",
  "module_icon_new_32",
  "module_icon_new_33",
  "module_icon_new_34",
  "module_icon_new_35",
  "module_icon_new_36",
  "module_icon_new_37",
  "module_icon_new_38",
  "module_icon_new_39",
  "module_icon_new_40",
  "module_icon_new_41",
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
