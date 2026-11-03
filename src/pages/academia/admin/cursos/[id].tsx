import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import withAuth from "@/components/shared/with-auth";
import AcademyLayout, {
  AcademyLoader,
  useAcademyRoleGuard,
} from "@/components/academy/academy-layout";
import { friendlyError, isAcademyAdmin } from "@/components/academy/constants";
import CourseForm from "@/components/academy/admin/course-form";
import { ROUTES } from "@/constants/router";
import { ACADEMY_COURSE_ADMIN_QUERY } from "@/lib/sektor-api/queries";
import { Query } from "@/lib/sektor-api/__generated__/types";

const EditCoursePage = () => {
  const { query } = useRouter();
  const id = query.id as string;
  const allowed = useAcademyRoleGuard(isAcademyAdmin);
  const { data, loading, error } = useQuery<Query>(ACADEMY_COURSE_ADMIN_QUERY, {
    variables: { id },
    skip: !allowed || !id,
    fetchPolicy: "network-only",
  });
  const course = data?.academyCourse;

  return (
    <AcademyLayout title={course ? `Editar ${course.title}` : "Editar curso"} hideTabs>
      <Link
        href={`${ROUTES.ACADEMY_ADMIN}?tab=cursos`}
        className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Volver a cursos
      </Link>
      <h1 className="text-2xl font-bold mb-6">
        {course?.canEdit === false ? "Ver curso" : "Editar curso"}
      </h1>
      {!allowed || loading ? (
        <AcademyLoader />
      ) : error || !course ? (
        <p className="text-red-500">
          {error ? friendlyError(error) : "Curso no encontrado"}
        </p>
      ) : (
        // key forces a fresh form if the course id changes
        <CourseForm key={course.id} course={course} />
      )}
    </AcademyLayout>
  );
};

export default withAuth(EditCoursePage);
