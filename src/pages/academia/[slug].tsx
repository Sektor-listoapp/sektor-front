import React from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import dayjs from "dayjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faChalkboardUser,
  faCircleQuestion,
  faClock,
  faFileLines,
  faLocationDot,
  faUsers,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import AcademyLayout from "@/components/academy/academy-layout";
import CourseActions from "@/components/academy/student/course-actions";
import { courseHref } from "@/components/academy/student/course-card";
import {
  CATEGORY_LABEL,
  LEVEL_LABEL,
  MODALITY_LABEL,
  MODULE_TYPE_LABEL,
  formatDuration,
} from "@/components/academy/constants";
import { ROUTES } from "@/constants/router";
import { PUBLIC_ACADEMY_COURSE_QUERY } from "@/lib/sektor-api/queries";
import { getSiteUrl, serverQuery } from "@/lib/sektor-api/conflg/server-query";
import {
  AcademyCourseModality,
  AcademyCourseModuleType,
  PublicAcademyCourse,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { Pill } from "@/components/academy/ui";
import { InstructorAvatar, instructorHref } from "@/components/academy/instructors";

interface Props {
  course: PublicAcademyCourse;
  siteUrl: string;
}

const MODULE_ICON = {
  [AcademyCourseModuleType.Video]: faVideo,
  [AcademyCourseModuleType.Text]: faFileLines,
  [AcademyCourseModuleType.Quiz]: faCircleQuestion,
};

const CourseDetailPage = ({ course, siteUrl }: Props) => {
  const url = `${siteUrl}${courseHref(course)}`;
  const description = course.description.slice(0, 300);
  const scheduled = course.modality !== AcademyCourseModality.Online;
  const totalSeconds = course.syllabus.reduce((acc, m) => acc + (m.durationSeconds ?? 0), 0);

  // https://developers.google.com/search/docs/appearance/structured-data/course
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description,
    url,
    image: course.imageUrl || undefined,
    provider: { "@type": "Organization", name: "Sektor", sameAs: siteUrl },
    ...(course.instructor
      ? {
          instructor: {
            "@type": "Person",
            name: course.instructor.name,
            url: `${siteUrl}${instructorHref(course.instructor)}`,
          },
        }
      : course.instructorName && {
          instructor: { "@type": "Person", name: course.instructorName },
        }),
    offers: {
      "@type": "Offer",
      category: course.priceUsd > 0 ? "Paid" : "Free",
      price: course.priceUsd,
      priceCurrency: "USD",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.modality === AcademyCourseModality.Presential ? "Onsite" : "Online",
      ...(course.scheduledAt && { startDate: course.scheduledAt }),
      ...(course.location && { location: course.location }),
    },
  };

  return (
    <AcademyLayout title={course.title} description={description}>
      <Head>
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        {course.imageUrl && <meta property="og:image" content={course.imageUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Link
        href={ROUTES.ACADEMY}
        className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Todos los cursos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <article className="flex flex-col gap-6 min-w-0">
          {course.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full max-h-[420px] object-cover rounded-xl"
            />
          )}
          <header className="flex flex-col gap-3">
            <div className="flex gap-1 flex-wrap">
              {course.modality && <Pill solid>{MODALITY_LABEL[course.modality]}</Pill>}
              {course.courseType && <Pill>{CATEGORY_LABEL[course.courseType]}</Pill>}
              {course.level && <Pill>{LEVEL_LABEL[course.level]}</Pill>}
            </div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              <li>
                <FontAwesomeIcon icon={faChalkboardUser} className="mr-1" />
                {course.instructor ? (
                  <Link
                    href={instructorHref(course.instructor)}
                    className="text-blue-500 underline underline-offset-2 hover:text-blue-400"
                  >
                    {course.instructor.name}
                  </Link>
                ) : (
                  course.instructorName || "Sektor"
                )}
              </li>
              <li>
                <FontAwesomeIcon icon={faUsers} className="mr-1" />
                {course.enrolledCount}
                {course.maxCapacity ? ` / ${course.maxCapacity}` : ""} inscritos
              </li>
              {scheduled && course.scheduledAt && (
                <li>
                  <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
                  {dayjs(course.scheduledAt).format("dddd DD/MM/YYYY · hh:mm a")}
                </li>
              )}
              {scheduled && course.durationMinutes ? (
                <li>
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  {course.durationMinutes} min
                </li>
              ) : totalSeconds ? (
                <li>
                  <FontAwesomeIcon icon={faClock} className="mr-1" />
                  {formatDuration(totalSeconds)} de video
                </li>
              ) : null}
              {course.location && (
                <li>
                  <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                  {course.location}
                </li>
              )}
            </ul>
          </header>

          {course.instructor && (
            <Link
              href={instructorHref(course.instructor)}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow text-blue-500"
            >
              <InstructorAvatar instructor={course.instructor} className="w-14 h-14 text-lg" />
              <span className="flex flex-col min-w-0">
                <span className="text-xs uppercase tracking-wide text-gray-500">Docente / experto</span>
                <span className="font-bold">{course.instructor.name}</span>
                {course.instructor.headline && (
                  <span className="text-sm text-gray-600 truncate">{course.instructor.headline}</span>
                )}
              </span>
              <span className="ml-auto text-sm whitespace-nowrap">Ver perfil</span>
            </Link>
          )}

          <section>
            <h2 className="text-xl font-bold mb-2">Sobre este curso</h2>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">{course.description}</p>
          </section>

          {course.syllabus.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">Contenido del curso</h2>
              <ol className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                {course.syllabus.map((m, i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
                    <FontAwesomeIcon icon={MODULE_ICON[m.type]} className="w-4" />
                    <span className="flex-1">
                      {i + 1}. {m.title || MODULE_TYPE_LABEL[m.type]}
                    </span>
                    {m.durationSeconds ? (
                      <span className="text-gray-400">{formatDuration(m.durationSeconds)}</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>

        <aside className="lg:sticky lg:top-4 h-fit">
          <CourseActions course={course} />
        </aside>
      </div>
    </AcademyLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, req, res }) => {
  const idOrSlug = String(params?.slug ?? "");
  const siteUrl = getSiteUrl(req.headers.host);
  let course: PublicAcademyCourse | null | undefined;
  try {
    const data = await serverQuery<Query>(PUBLIC_ACADEMY_COURSE_QUERY, { idOrSlug });
    course = data.publicAcademyCourse;
  } catch {
    course = null;
  }
  if (!course) return { notFound: true };

  // Old links by id → permanent redirect to the slug URL (one canonical URL).
  if (course.slug && idOrSlug !== course.slug) {
    return { redirect: { destination: courseHref(course), permanent: true } };
  }

  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  return { props: { course, siteUrl } };
};

export default CourseDetailPage;
