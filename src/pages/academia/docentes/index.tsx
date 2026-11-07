import React, { useEffect, useMemo, useState } from "react";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useShallow } from "zustand/shallow";
import { Empty } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import AcademyLayout from "@/components/academy/academy-layout";
import { Panel } from "@/components/academy/ui";
import {
  InstructorCard,
  InstructorFormModal,
  instructorHref,
} from "@/components/academy/instructors";
import { ROUTES } from "@/constants/router";
import { PUBLIC_ACADEMY_INSTRUCTORS_QUERY } from "@/lib/sektor-api/queries";
import { getSiteUrl, serverQuery } from "@/lib/sektor-api/conflg/server-query";
import {
  PublicAcademyInstructor,
  Query,
  UserGroups,
} from "@/lib/sektor-api/__generated__/types";
import { useAuthStore } from "@/store/auth";

interface Props {
  instructors: PublicAcademyInstructor[];
  siteUrl: string;
  failed?: boolean;
}

const DESCRIPTION =
  "Conoce a los docentes y expertos de la Academia Sektor: corredores y especialistas en seguros que dictan nuestros cursos.";

const AcademyInstructorsPage = ({ instructors, siteUrl, failed }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  // Only Admin creates instructors; read the group after hydration so the
  // server-rendered (anonymous) markup matches.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const group = useAuthStore(useShallow((state) => state.user?.group));
  const isAdmin = hydrated && group === UserGroups.Admin;
  const [creating, setCreating] = useState(false);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return instructors.filter(
      (i) =>
        !q ||
        i.name.toLowerCase().includes(q) ||
        (i.headline ?? "").toLowerCase().includes(q)
    );
  }, [instructors, search]);

  const url = `${siteUrl}${ROUTES.ACADEMY_INSTRUCTORS}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: instructors.map((i, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}${instructorHref(i)}`,
      name: i.name,
    })),
  };

  return (
    <AcademyLayout title="Docentes y expertos" description={DESCRIPTION}>
      <Head>
        <link rel="canonical" href={url} />
        <meta property="og:url" content={url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <Panel className="mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold">Docentes y expertos</h1>
          <p className="text-gray-600">
            Quienes dictan los cursos de la Academia. Entra a su perfil para ver sus cursos.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <TextInput
            placeholder="Buscar por nombre o especialidad"
            icon={faSearch}
            iconPosition="end"
            wrapperClassName="md:max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isAdmin && (
            <Button
              variant="solid-blue"
              className="md:ml-auto flex items-center gap-2 justify-center"
              onClick={() => setCreating(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Nuevo docente / experto
            </Button>
          )}
        </div>
      </Panel>

      {isAdmin && (
        <InstructorFormModal
          open={creating}
          onClose={() => setCreating(false)}
          onSaved={(instructor) => router.push(instructorHref(instructor))}
        />
      )}

      {failed ? (
        <p className="text-red-500 py-10 text-center">
          No pudimos cargar los docentes. Intenta de nuevo en unos minutos.
        </p>
      ) : filtered.length === 0 ? (
        <Empty
          description={
            instructors.length ? "Ningún docente coincide con tu búsqueda" : "Pronto presentaremos a nuestros docentes"
          }
          className="py-16"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      )}
    </AcademyLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }) => {
  const siteUrl = getSiteUrl(req.headers.host);
  try {
    const data = await serverQuery<Query>(PUBLIC_ACADEMY_INSTRUCTORS_QUERY);
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return { props: { instructors: data.publicAcademyInstructors, siteUrl } };
  } catch {
    return { props: { instructors: [], siteUrl, failed: true } };
  }
};

export default AcademyInstructorsPage;
