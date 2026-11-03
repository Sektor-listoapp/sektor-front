import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import withAuth from "@/components/shared/with-auth";
import AcademyLayout, {
  AcademyLoader,
  useAcademyRoleGuard,
} from "@/components/academy/academy-layout";
import { isAcademyAdmin } from "@/components/academy/constants";
import CourseForm from "@/components/academy/admin/course-form";
import { ROUTES } from "@/constants/router";

const NewCoursePage = () => {
  const allowed = useAcademyRoleGuard(isAcademyAdmin);
  return (
    <AcademyLayout title="Nuevo curso" hideTabs>
      <Link
        href={`${ROUTES.ACADEMY_ADMIN}?tab=cursos`}
        className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Volver a cursos
      </Link>
      <h1 className="text-2xl font-bold mb-6">Nuevo curso</h1>
      {allowed ? <CourseForm /> : <AcademyLoader />}
    </AcademyLayout>
  );
};

export default withAuth(NewCoursePage);
