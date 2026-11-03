import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useQuery } from "@apollo/client";
import { Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCertificate } from "@fortawesome/free-solid-svg-icons";
import withAuth from "@/components/shared/with-auth";
import AcademyLayout, {
  AcademyLoader,
  useAcademyRoleGuard,
} from "@/components/academy/academy-layout";
import { friendlyError, isAcademyAdmin } from "@/components/academy/constants";
import { ROUTES } from "@/constants/router";
import { ACADEMY_STUDENT_QUERY } from "@/lib/sektor-api/queries";
import { Query } from "@/lib/sektor-api/__generated__/types";
import { Pill } from "@/components/academy/ui";

const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-xl font-bold">{value}</span>
  </div>
);

const StudentDetailPage = () => {
  const { query } = useRouter();
  const allowed = useAcademyRoleGuard(isAcademyAdmin);
  const { data, loading, error } = useQuery<Query>(ACADEMY_STUDENT_QUERY, {
    variables: { id: query.id },
    skip: !allowed || !query.id,
  });
  const s = data?.academyStudent;

  return (
    <AcademyLayout title={s?.name ?? "Estudiante"} hideTabs>
      <Link
        href={`${ROUTES.ACADEMY_ADMIN}?tab=estudiantes`}
        className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Volver a estudiantes
      </Link>
      {!allowed || (loading && !s) ? (
        <AcademyLoader />
      ) : error || !s ? (
        <p className="text-red-500">{error ? friendlyError(error) : "Estudiante no encontrado"}</p>
      ) : (
        <div className="flex flex-col gap-8">
          <header className="flex items-center gap-4">
            <span className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
              {s.initials}
            </span>
            <div>
              <h1 className="text-2xl font-bold">{s.name}</h1>
              <p className="text-gray-500 text-sm">
                {s.email}
                {s.firstEnrolledAt &&
                  ` · Estudiante desde ${dayjs(s.firstEnrolledAt).format("MMMM YYYY")}`}
              </p>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Cursos inscritos" value={s.enrolledCoursesCount} />
            <Stat label="Cursos aprobados" value={s.approvedCoursesCount} />
            <Stat label="Tasa de aprobación" value={`${Math.round(s.approvedCoursesRatio)}%`} />
            <Stat label="Nota promedio" value={s.averageScore != null ? Math.round(s.averageScore) : "—"} />
          </div>

          <section>
            <h2 className="text-lg font-bold mb-3">Cursos</h2>
            {s.completedCourses.length === 0 ? (
              <Empty description="Sin cursos todavía" />
            ) : (
              <div className="flex flex-col gap-2">
                {s.completedCourses.map((c) => (
                  <div key={c.courseId} className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
                    <span className="flex-1 font-bold">{c.title}</span>
                    {c.score != null && <span className="text-sm">{Math.round(c.score)} pts</span>}
                    <Pill>{c.status}</Pill>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Certificados</h2>
            {s.certificates.length === 0 ? (
              <Empty description="Sin certificados" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {s.certificates.map((c) => (
                  <div key={c.certificateId} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
                    <FontAwesomeIcon icon={faCertificate} size="2x" />
                    <div className="flex-1">
                      <p className="font-bold">{c.courseTitle}</p>
                      <p className="text-xs text-gray-500">Código {c.certificateCode}</p>
                    </div>
                    {c.downloadUrl && (
                      <a href={c.downloadUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">
                        Descargar
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </AcademyLayout>
  );
};

export default withAuth(StudentDetailPage);
