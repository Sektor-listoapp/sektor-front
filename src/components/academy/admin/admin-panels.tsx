import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@apollo/client";
import { Empty, Modal } from "antd";
import TextInput from "@/components/ui/text-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faPen,
  faPlus,
  faQrcode,
  faSearch,
  faTrash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import {
  ACADEMY_CALENDAR_ITEMS_QUERY,
  ACADEMY_COURSES_QUERY,
  ACADEMY_DASHBOARD_QUERY,
  ACADEMY_STUDENTS_QUERY,
} from "@/lib/sektor-api/queries";
import { DELETE_ACADEMY_COURSE } from "@/lib/sektor-api/mutations";
import {
  AcademyCourseListItem,
  AcademyCourseModality,
  AcademyCourseStatus,
  Query,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import { useAuthStore } from "@/store/auth";
import { AcademyLoader } from "../academy-layout";
import {
  CATEGORY_LABEL,
  MODALITY_LABEL,
  formatUsd,
  friendlyError,
} from "../constants";
import { Pill, ToggleButtons } from "../ui";

const ErrorBox = ({ error }: { error: unknown }) => (
  <p className="text-red-500 py-10 text-center">{friendlyError(error)}</p>
);

/* --------------------------------- Resumen -------------------------------- */

const trend = (current: number, previous: number) => {
  if (!previous) return current ? "+100%" : "0%";
  const pct = Math.round(((current - previous) / previous) * 100);
  return `${pct >= 0 ? "+" : ""}${pct}%`;
};

const Stat = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-1">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-2xl font-bold">{value}</span>
    {hint && <span className="text-xs text-gray-500">{hint}</span>}
  </div>
);

export const DashboardPanel = () => {
  const { data, loading, error } = useQuery<Query>(ACADEMY_DASHBOARD_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const d = data?.academyDashboard;
  if (loading && !d) return <AcademyLoader />;
  if (error && !d) return <ErrorBox error={error} />;
  if (!d) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Estudiantes"
          value={d.uniqueStudentsTotal}
          hint={`${d.uniqueStudentsCurrentMonth} este mes (${trend(
            d.uniqueStudentsCurrentMonth,
            d.uniqueStudentsPreviousMonth
          )})`}
        />
        <Stat label="Cursos publicados" value={d.publishedCoursesCount} />
        <Stat
          label="Ingresos"
          value={formatUsd(d.revenueTotalUsd).replace("Gratis", "$0")}
          hint={`${formatUsd(d.revenueCurrentMonthUsd).replace(
            "Gratis",
            "$0"
          )} este mes (${trend(
            d.revenueCurrentMonthUsd,
            d.revenuePreviousMonthUsd
          )})`}
        />
        <Stat
          label="Tasa de aprobación"
          value={`${Math.round(d.approvalRate)}%`}
        />
      </div>

      <section>
        <h2 className="text-lg font-bold mb-3">Cursos más populares</h2>
        {d.topCourses.length === 0 ? (
          <Empty description="Aún no hay inscripciones" />
        ) : (
          <div className="flex flex-col gap-2">
            {d.topCourses.map((course) => (
              <div
                key={course.courseId}
                className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-4"
              >
                {course.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.imageUrl}
                    alt=""
                    className="w-16 h-12 object-cover rounded-md"
                  />
                )}
                <span className="flex-1 font-bold">{course.title}</span>
                <span className="text-sm text-gray-500">
                  {course.studentCount} estudiantes
                </span>
                <span className="text-sm font-bold w-20 text-right">
                  {formatUsd(course.revenueUsd).replace("Gratis", "$0")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/* --------------------------------- Cursos --------------------------------- */

const STATUS_FILTERS = [
  { label: "Publicados", value: AcademyCourseStatus.Published },
  { label: "Borradores", value: AcademyCourseStatus.Draft },
  { label: "Archivados", value: AcademyCourseStatus.Archived },
];

export const CoursesPanel = () => {
  const { push } = useRouter();
  const group = useAuthStore(useShallow((state) => state.user?.group));
  const [status, setStatus] = useState(AcademyCourseStatus.Published);
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useQuery<Query>(
    ACADEMY_COURSES_QUERY,
    { variables: { status }, fetchPolicy: "cache-and-network" }
  );
  const [deleteCourse] = useMutation(DELETE_ACADEMY_COURSE);
  // Static Modal.confirm does not render under React 19 (antd 5), so the
  // confirmations go through the hook and its contextHolder.
  const [modal, modalContextHolder] = Modal.useModal();

  const courses = useMemo(
    () =>
      (data?.academyCourses ?? []).filter((course) =>
        course.title.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [data, search]
  );

  const runDelete = async (course: AcademyCourseListItem, force = false) => {
    try {
      await deleteCourse({ variables: { id: course.id, force } });
      toast.success("Curso eliminado");
      refetch();
    } catch (e) {
      const message = (e as Error).message;
      // Same behaviour as the app: only Admins may force-delete a course
      // that already has students, after an extra confirmation.
      if (
        !force &&
        message === "Cannot delete a course with existing enrollments" &&
        group === UserGroups.Admin
      ) {
        modal.confirm({
          title: "El curso tiene alumnos inscritos",
          content:
            "Si lo eliminas, los alumnos perderán el acceso. ¿Eliminar de todas formas?",
          okText: "Eliminar",
          okButtonProps: { danger: true },
          cancelText: "Cancelar",
          onOk: () => runDelete(course, true),
        });
        return;
      }
      toast.error(friendlyError(e));
    }
  };

  const confirmDelete = (course: AcademyCourseListItem) =>
    modal.confirm({
      title: `¿Eliminar "${course.title}"?`,
      content: "Esta acción no se puede deshacer.",
      okText: "Eliminar",
      okButtonProps: { danger: true },
      cancelText: "Cancelar",
      onOk: () => runDelete(course),
    });

  return (
    <div className="flex flex-col gap-4">
      {modalContextHolder}
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <ToggleButtons
          options={STATUS_FILTERS}
          value={status}
          onChange={setStatus}
        />
        <TextInput
          placeholder="Buscar curso"
          icon={faSearch}
          iconPosition="end"
          wrapperClassName="md:max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="solid-blue"
          className="md:ml-auto flex items-center gap-2 justify-center"
          onClick={() => push(ROUTES.ACADEMY_ADMIN_NEW_COURSE)}
        >
          <FontAwesomeIcon icon={faPlus} /> Nuevo curso
        </Button>
      </div>

      {loading && !data ? (
        <AcademyLoader />
      ) : error && !data ? (
        <ErrorBox error={error} />
      ) : courses.length === 0 ? (
        <Empty description="No hay cursos" className="py-10" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <article
              key={course.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              {course.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.imageUrl}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="h-36 bg-gray-200" />
              )}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex gap-1 flex-wrap">
                  {course.modality && (
                    <Pill solid>{MODALITY_LABEL[course.modality]}</Pill>
                  )}
                  {course.courseType && (
                    <Pill>{CATEGORY_LABEL[course.courseType]}</Pill>
                  )}
                </div>
                <h3 className="font-bold">{course.title}</h3>
                <p className="text-sm text-gray-500">
                  {formatUsd(course.priceUsd)} · {course.enrolledCount}
                  {course.maxCapacity ? `/${course.maxCapacity}` : ""} inscritos
                </p>
                <div className="flex gap-2 mt-auto pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center gap-2 justify-center !py-1.5"
                    onClick={() =>
                      push(`${ROUTES.ACADEMY_ADMIN_COURSE}/${course.id}`)
                    }
                  >
                    <FontAwesomeIcon icon={faPen} />
                    {course.canEdit ? "Editar" : "Ver"}
                  </Button>
                  {course.canEdit && (
                    <button
                      aria-label="Eliminar curso"
                      className="px-3 rounded-lg border border-red-300 text-red-500 hover:bg-red-50"
                      onClick={() => confirmDelete(course)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

/* -------------------------------- Calendario ------------------------------- */

export const CalendarPanel = () => {
  const { push } = useRouter();
  const { data, loading, error } = useQuery<Query>(
    ACADEMY_CALENDAR_ITEMS_QUERY,
    { fetchPolicy: "cache-and-network" }
  );
  const items = [...(data?.academyCalendarItems ?? [])].sort(
    (a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf()
  );

  if (loading && !data) return <AcademyLoader />;
  if (error && !data) return <ErrorBox error={error} />;
  if (items.length === 0)
    return <Empty description="No hay clases agendadas" className="py-10" />;

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const date = dayjs(item.scheduledAt);
        const isPresential = item.modality === AcademyCourseModality.Presential;
        return (
          <div
            key={item.courseId}
            className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 text-center bg-blue-500 text-white rounded-lg py-2 shrink-0">
                <div className="text-xl font-bold leading-none">
                  {date.format("DD")}
                </div>
                <div className="text-xs uppercase">{date.format("MMM")}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold">{item.title}</span>
                <span className="text-sm text-gray-500">
                  <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
                  {date.format("dddd DD/MM/YYYY · hh:mm a")} ·{" "}
                  {MODALITY_LABEL[item.modality]}
                  {item.location ? ` · ${item.location}` : ""}
                </span>
              </div>
            </div>
            {isPresential && (
              <Button
                variant="solid-blue"
                className="flex items-center gap-2 justify-center"
                onClick={() =>
                  push(`${ROUTES.ACADEMY_ADMIN_ATTENDANCE}/${item.courseId}`)
                }
              >
                <FontAwesomeIcon icon={faQrcode} /> Tomar asistencia
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------- Estudiantes ------------------------------- */

export const StudentsPanel = () => {
  const [search, setSearch] = useState("");
  const { data, loading, error } = useQuery<Query>(ACADEMY_STUDENTS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const students = (data?.academyStudents ?? []).filter((s) =>
    s.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        placeholder="Buscar estudiante"
        icon={faSearch}
        iconPosition="end"
        wrapperClassName="md:max-w-xs"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && !data ? (
        <AcademyLoader />
      ) : error && !data ? (
        <ErrorBox error={error} />
      ) : students.length === 0 ? (
        <Empty description="No hay estudiantes" className="py-10" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.map((student) => (
            <Link
              key={student.id}
              href={`${ROUTES.ACADEMY_ADMIN_STUDENT}/${student.id}`}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <span className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold shrink-0">
                {student.initials}
              </span>
              <span className="flex flex-col">
                <span className="font-bold text-blue-500">{student.name}</span>
                <span className="text-xs text-gray-500">
                  <FontAwesomeIcon icon={faUsers} className="mr-1" />
                  {student.approvedCoursesCount} cursos aprobados
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
