import React from "react";
import { useRouter } from "next/router";
import withAuth from "@/components/shared/with-auth";
import AcademyLayout, {
  AcademyLoader,
  useAcademyRoleGuard,
} from "@/components/academy/academy-layout";
import { isAcademyAdmin } from "@/components/academy/constants";
import {
  CalendarPanel,
  CoursesPanel,
  DashboardPanel,
  StudentsPanel,
} from "@/components/academy/admin/admin-panels";
import { ButtonTabs, Panel } from "@/components/academy/ui";

const TABS = [
  { key: "cursos", label: "Cursos", children: <CoursesPanel /> },
  { key: "resumen", label: "Resumen", children: <DashboardPanel /> },
  { key: "calendario", label: "Calendario", children: <CalendarPanel /> },
  { key: "estudiantes", label: "Estudiantes", children: <StudentsPanel /> },
];

const AcademyAdminPage = () => {
  const router = useRouter();
  const allowed = useAcademyRoleGuard(isAcademyAdmin);
  const tab = (router.query.tab as string) || "cursos";

  return (
    <AcademyLayout title="Administrar academia">
      <h1 className="text-2xl font-bold mb-4">Administrar academia</h1>
      {!allowed ? (
        <AcademyLoader />
      ) : (
        <Panel>
          <ButtonTabs
            items={TABS}
            activeKey={TABS.some((t) => t.key === tab) ? tab : "cursos"}
            onChange={(key) =>
              router.replace({ query: { tab: key } }, undefined, {
                shallow: true,
              })
            }
          />
        </Panel>
      )}
    </AcademyLayout>
  );
};

export default withAuth(AcademyAdminPage);
