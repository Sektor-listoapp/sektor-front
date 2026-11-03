import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useShallow } from "zustand/shallow";
import Navbar from "@/components/my-account/navbar";
import FullScreenLoaderLogo from "@/components/ui/full-screen-loader-logo";
import { ROUTES } from "@/constants/router";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/utils/class-name";
import { BUTTON_VARIANTS } from "@/components/ui/button/constants";
import { isAcademyAdmin, isAcademyStudent } from "./constants";

interface AcademyLayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  /** Hide the Catálogo / Mis cursos / Administrar sub-navigation. */
  hideTabs?: boolean;
  className?: string;
}

const AcademyLayout = ({
  title,
  description,
  children,
  hideTabs,
  className,
}: AcademyLayoutProps) => {
  const { pathname } = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.getIsAuthenticated)();
  const group = useAuthStore(useShallow((state) => state.user?.group));

  useEffect(() => setHydrated(true), []);

  const tabs = [
    { label: "Catálogo", href: ROUTES.ACADEMY, show: true },
    {
      label: "Mis cursos",
      href: ROUTES.ACADEMY_MY_COURSES,
      show: hydrated && isAuthenticated && isAcademyStudent(group),
    },
    {
      label: "Administrar",
      href: ROUTES.ACADEMY_ADMIN,
      show: hydrated && isAuthenticated && isAcademyAdmin(group),
    },
  ].filter((tab) => tab.show);

  const pageTitle = title ? `${title} | Academia Sektor` : "Academia Sektor";

  return (
    <div className="min-h-svh bg-white w-full flex flex-col items-center">
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={pageTitle} />
        {description && <meta property="og:description" content={description} />}
      </Head>
      <Navbar />

      {!hideTabs && tabs.length > 1 && (
        <nav className="w-11/12 max-w-screen-xl mx-auto flex gap-2 overflow-x-auto pt-6 font-century-gothic">
          {tabs.map((tab) => {
            const active =
              tab.href === ROUTES.ACADEMY
                ? pathname === ROUTES.ACADEMY ||
                  pathname === `${ROUTES.ACADEMY}/[slug]`
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  BUTTON_VARIANTS.base,
                  active ? BUTTON_VARIANTS["solid-blue"] : BUTTON_VARIANTS.outline,
                  "text-sm px-4 py-2 whitespace-nowrap"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      )}

      <main
        className={cn(
          "w-11/12 max-w-screen-xl flex-1 py-8 pb-24 text-blue-500 font-century-gothic",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default AcademyLayout;

export const AcademyLoader = () => (
  <div className="flex justify-center items-center py-32">
    <FullScreenLoaderLogo className="w-24" />
  </div>
);

/**
 * Client-side role guard used inside pages already wrapped with `withAuth`.
 * Returns true once the user is allowed; redirects home otherwise.
 */
export const useAcademyRoleGuard = (
  allowed: (group?: Parameters<typeof isAcademyAdmin>[0]) => boolean
) => {
  const { replace } = useRouter();
  const user = useAuthStore((state) => state.user);
  const group = user?.group;
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (allowed(group)) setOk(true);
    else replace(ROUTES.ACADEMY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, group]);

  return ok;
};
