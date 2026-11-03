import {
  AcademyCourseCategory,
  AcademyCourseLevel,
  AcademyCourseModality,
  AcademyCourseModuleType,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";

export const MODALITY_LABEL: Record<AcademyCourseModality, string> = {
  [AcademyCourseModality.Online]: "Online",
  [AcademyCourseModality.LiveStreaming]: "En vivo",
  [AcademyCourseModality.Presential]: "Presencial",
};

export const CATEGORY_LABEL: Record<AcademyCourseCategory, string> = {
  [AcademyCourseCategory.Workshop]: "Taller",
  [AcademyCourseCategory.Training]: "Formación",
  [AcademyCourseCategory.Information]: "Información",
};

export const LEVEL_LABEL: Record<AcademyCourseLevel, string> = {
  [AcademyCourseLevel.Basic]: "Básico",
  [AcademyCourseLevel.Intermediate]: "Intermedio",
  [AcademyCourseLevel.Advanced]: "Avanzado",
};

export const MODULE_TYPE_LABEL: Record<AcademyCourseModuleType, string> = {
  [AcademyCourseModuleType.Video]: "Video",
  [AcademyCourseModuleType.Text]: "Lectura",
  [AcademyCourseModuleType.Quiz]: "Quiz",
};

/** Minimum fraction of a video lesson that must be watched to continue. */
export const VIDEO_REQUIRED_FRACTION = 0.9;

/** Sektor's receiving account for Pago Móvil (same data shown in the app). */
export const SEKTOR_MOBILE_PAYMENT_ACCOUNT = {
  bank: "R4 (0169)",
  rif: "J507800857",
  phone: "04223005099",
};

export const ACADEMY_ADMIN_GROUPS: UserGroups[] = [
  UserGroups.Admin,
  UserGroups.AcademyAdmin,
];

export const isAcademyAdmin = (group?: UserGroups | null) =>
  !!group && ACADEMY_ADMIN_GROUPS.includes(group);

/** Any signed-in end user can take courses; only academy admins can't. */
export const isAcademyStudent = (group?: UserGroups | null) =>
  !isAcademyAdmin(group);

export const formatUsd = (value?: number | null) =>
  !value ? "Gratis" : `$${value.toLocaleString("es-VE", { maximumFractionDigits: 2 })}`;

export const formatVes = (value?: number | null) =>
  `Bs. ${(value ?? 0).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const formatDuration = (seconds?: number | null) => {
  if (!seconds) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

/** Translates backend error messages the user can actually act on. */
const FRIENDLY_ERRORS: Record<string, string> = {
  "Only the course creator or an admin can modify this course":
    "Solo el creador del curso o un administrador puede modificarlo",
  "Only admins can force delete a course":
    "Solo un administrador puede eliminar un curso con alumnos inscritos",
  "Cannot delete a course with existing enrollments":
    "No se puede eliminar un curso que tiene alumnos inscritos",
  "This course requires payment": "Este curso requiere pago",
  "Course is not available": "El curso no está disponible",
  "Academy asset must be uploaded first":
    "Uno de los archivos no terminó de subirse. Intenta de nuevo.",
};

export const friendlyError = (error: unknown) => {
  const message =
    (error as { message?: string })?.message ?? String(error ?? "");
  return FRIENDLY_ERRORS[message] ?? message ?? "Ocurrió un error";
};
