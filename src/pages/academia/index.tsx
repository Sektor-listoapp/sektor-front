import React, { useMemo, useState } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { Empty, Input, Segmented, Select } from "antd";
import AcademyLayout from "@/components/academy/academy-layout";
import CourseCard, { courseHref } from "@/components/academy/student/course-card";
import { CATEGORY_LABEL, MODALITY_LABEL } from "@/components/academy/constants";
import { PUBLIC_ACADEMY_COURSES_QUERY } from "@/lib/sektor-api/queries";
import { getSiteUrl, serverQuery } from "@/lib/sektor-api/conflg/server-query";
import {
  AcademyCourseCategory,
  AcademyCourseModality,
  PublicAcademyCourse,
  Query,
} from "@/lib/sektor-api/__generated__/types";

interface Props {
  courses: PublicAcademyCourse[];
  siteUrl: string;
  failed?: boolean;
}

const DESCRIPTION =
  "Cursos, talleres y formaciones para corredores y asegurados en Venezuela: online, en vivo y presenciales, con certificado.";

const AcademyCatalogPage = ({ courses, siteUrl, failed }: Props) => {
  const [search, setSearch] = useState("");
  const [modality, setModality] = useState<AcademyCourseModality | "all">("all");
  const [category, setCategory] = useState<AcademyCourseCategory>();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter(
      (c) =>
        (modality === "all" || c.modality === modality) &&
        (!category || c.courseType === category) &&
        (!q ||
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          (c.instructorName ?? "").toLowerCase().includes(q))
    );
  }, [courses, search, modality, category]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}${courseHref(c)}`,
      name: c.title,
    })),
  };

  return (
    <AcademyLayout title="Cursos" description={DESCRIPTION}>
      <Head>
        <link rel="canonical" href={`${siteUrl}/academia`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Academia Sektor</h1>
        <p className="text-gray-600 mt-2 max-w-2xl">{DESCRIPTION}</p>
      </header>

      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
        <Input.Search
          allowClear
          placeholder="Buscar cursos"
          className="md:max-w-xs"
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar cursos"
        />
        <div className="overflow-x-auto">
          <Segmented
            value={modality}
            onChange={(v) => setModality(v as AcademyCourseModality | "all")}
            options={[
              { label: "Todos", value: "all" },
              ...Object.values(AcademyCourseModality).map((m) => ({
                label: MODALITY_LABEL[m],
                value: m,
              })),
            ]}
          />
        </div>
        <Select
          allowClear
          placeholder="Tipo de curso"
          className="md:w-48"
          value={category}
          onChange={setCategory}
          options={Object.values(AcademyCourseCategory).map((c) => ({
            value: c,
            label: CATEGORY_LABEL[c],
          }))}
        />
      </div>

      {failed ? (
        <p className="text-red-500 py-10 text-center">
          No pudimos cargar los cursos. Intenta de nuevo en unos minutos.
        </p>
      ) : filtered.length === 0 ? (
        <Empty
          description={courses.length ? "Ningún curso coincide con tu búsqueda" : "Pronto publicaremos cursos"}
          className="py-16"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </AcademyLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const siteUrl = getSiteUrl(req.headers.host);
  try {
    const data = await serverQuery<Query>(PUBLIC_ACADEMY_COURSES_QUERY);
    // Short CDN cache: catalog changes rarely, but price/enrolled counts move.
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return { props: { courses: data.publicAcademyCourses, siteUrl } };
  } catch {
    return { props: { courses: [], siteUrl, failed: true } };
  }
};

export default AcademyCatalogPage;
