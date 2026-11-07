import type { GetServerSideProps } from "next";
import { ROUTES } from "@/constants/router";
import { ACADEMY_PUBLIC } from "@/constants/features";
import {
  PUBLIC_ACADEMY_COURSES_QUERY,
  PUBLIC_ACADEMY_INSTRUCTORS_QUERY,
} from "@/lib/sektor-api/queries";
import { getSiteUrl, serverQuery } from "@/lib/sektor-api/conflg/server-query";
import { Query } from "@/lib/sektor-api/__generated__/types";

const STATIC_PATHS = [
  ROUTES.HOME,
  ROUTES.ORGANIZATIONS,
  ROUTES.NOTICIAS,
  ...(ACADEMY_PUBLIC ? [ROUTES.ACADEMY, ROUTES.ACADEMY_INSTRUCTORS] : []),
];

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Dynamic sitemap so every published Academy course gets indexed. */
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const siteUrl = getSiteUrl(req.headers.host);
  let coursePaths: string[] = [];
  if (ACADEMY_PUBLIC) {
    try {
      const data = await serverQuery<Query>(PUBLIC_ACADEMY_COURSES_QUERY);
      coursePaths = data.publicAcademyCourses.map(
        (c) => `${ROUTES.ACADEMY}/${c.slug || c.id}`
      );
      const instructors = await serverQuery<Query>(PUBLIC_ACADEMY_INSTRUCTORS_QUERY);
      coursePaths.push(
        ...instructors.publicAcademyInstructors.map(
          (i) => `${ROUTES.ACADEMY_INSTRUCTORS}/${i.id}`
        )
      );
    } catch {
      // Still serve the static part if the API is down.
    }
  }

  const urls = [...STATIC_PATHS, ...coursePaths]
    .map((path) => `  <url><loc>${escape(`${siteUrl}${path === "/" ? "" : path}`)}</loc></url>`)
    .join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
  res.end();
  return { props: {} };
};

const Sitemap = () => null;
export default Sitemap;
