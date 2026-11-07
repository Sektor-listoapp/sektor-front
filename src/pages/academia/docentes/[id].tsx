import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useShallow } from "zustand/shallow";
import { Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPen } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/button";
import AcademyLayout from "@/components/academy/academy-layout";
import CourseCard from "@/components/academy/student/course-card";
import {
  InstructorAvatar,
  InstructorFormModal,
} from "@/components/academy/instructors";
import {
  CATEGORY_LABEL,
  MODALITY_LABEL,
  formatUsd,
  isAcademyAdmin,
} from "@/components/academy/constants";
import { Pill } from "@/components/academy/ui";
import { ROUTES } from "@/constants/router";
import {
  ACADEMY_INSTRUCTOR_QUERY,
  PUBLIC_ACADEMY_INSTRUCTOR_QUERY,
} from "@/lib/sektor-api/queries";
import { getSiteUrl, serverQuery } from "@/lib/sektor-api/conflg/server-query";
import {
  PublicAcademyInstructor,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { useAuthStore } from "@/store/auth";

interface Props {
  instructor: PublicAcademyInstructor;
  siteUrl: string;
}

const InstructorPage = ({ instructor, siteUrl }: Props) => {
  const url = `${siteUrl}${ROUTES.ACADEMY_INSTRUCTORS}/${instructor.id}`;
  const description = (instructor.bio || instructor.headline || `Cursos de ${instructor.name} en la Academia Sektor`).slice(0, 300);

  // Admins see every course of the profile (drafts included) and can edit it.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const group = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = hydrated && isAcademyAdmin(group);
  const { data } = useQuery<Query>(ACADEMY_INSTRUCTOR_QUERY, {
    variables: { id: instructor.id },
    skip: !isAdmin,
    fetchPolicy: "cache-and-network",
  });
  const managed = data?.academyInstructor;
  const [editing, setEditing] = useState(false);
  const profile = managed ?? instructor;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: instructor.name,
    url,
    ...(instructor.photoUrl && { image: instructor.photoUrl }),
    ...(instructor.headline && { jobTitle: instructor.headline }),
    ...(instructor.bio && { description: instructor.bio }),
    worksFor: { "@type": "Organization", name: "Sektor", sameAs: siteUrl },
  };

  return (
    <AcademyLayout title={instructor.name} description={description}>
      <Head>
        <link rel="canonical" href={url} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={url} />
        {instructor.photoUrl && <meta property="og:image" content={instructor.photoUrl} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Link
        href={ROUTES.ACADEMY_INSTRUCTORS}
        className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Todos los docentes
      </Link>

      <header className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8">
        <InstructorAvatar instructor={profile} className="w-32 h-32 text-4xl" />
        <div className="flex flex-col gap-2 flex-1 text-center sm:text-left min-w-0">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          {profile.headline && <p className="text-lg text-gray-600">{profile.headline}</p>}
          {managed?.email && <p className="text-sm text-gray-500">{managed.email}</p>}
          {profile.bio && (
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">{profile.bio}</p>
          )}
          {managed?.canEdit && (
            <div className="pt-2">
              <Button
                variant="outline"
                className="inline-flex items-center gap-2 !py-1.5"
                onClick={() => setEditing(true)}
              >
                <FontAwesomeIcon icon={faPen} /> Editar perfil
              </Button>
            </div>
          )}
        </div>
      </header>

      <h2 className="text-xl font-bold mb-4">Cursos</h2>
      {managed ? (
        managed.courses.length === 0 ? (
          <Empty description="Todavía no tiene cursos" className="py-10" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {managed.courses.map((course) => (
              <Link
                key={course.id}
                href={`${ROUTES.ACADEMY_ADMIN_COURSE}/${course.id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow text-blue-500"
              >
                {course.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={course.imageUrl} alt="" className="h-36 w-full object-cover" />
                ) : (
                  <div className="h-36 bg-gray-200" />
                )}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex gap-1 flex-wrap">
                    {course.modality && <Pill solid>{MODALITY_LABEL[course.modality]}</Pill>}
                    {course.courseType && <Pill>{CATEGORY_LABEL[course.courseType]}</Pill>}
                  </div>
                  <h3 className="font-bold">{course.title}</h3>
                  <p className="text-sm text-gray-500">
                    {formatUsd(course.priceUsd)} · {course.enrolledCount} inscritos
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )
      ) : instructor.courses.length === 0 ? (
        <Empty description="Pronto publicará cursos" className="py-10" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {instructor.courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {managed?.canEdit && (
        <InstructorFormModal open={editing} instructor={managed} onClose={() => setEditing(false)} />
      )}
    </AcademyLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, req, res }) => {
  const id = String(params?.id ?? "");
  const siteUrl = getSiteUrl(req.headers.host);
  let instructor: PublicAcademyInstructor | null | undefined;
  try {
    const data = await serverQuery<Query>(PUBLIC_ACADEMY_INSTRUCTOR_QUERY, { id });
    instructor = data.publicAcademyInstructor;
  } catch {
    instructor = null;
  }
  if (!instructor) return { notFound: true };

  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return { props: { instructor, siteUrl } };
};

export default InstructorPage;
