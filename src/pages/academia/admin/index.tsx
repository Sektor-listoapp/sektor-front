import React from "react";
import { useRouter } from "next/router";
import withAuth from "@/components/shared/with-auth";
import AcademyLayout, {
  AcademyLoader,
  useAcademyRoleGuard,
} from "@/components/academy/academy-layout";
import { isAcademyAdmin } from "@/components/academy/constants";
import {
  InstructorsPanel,
  MyInstructorPanel,
} from "@/components/academy/admin/instructors-panel";
import { UserGroups } from "@/lib/sektor-api/__generated__/types";
import { useAuthStore } from "@/store/auth";
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
// Admin manages every instructor; an AcademyAdmin edits its own profile.
const ADMIN_TABS = [...TABS, { key: "docentes", label: "Docentes", children: <InstructorsPanel /> }];
const ACADEMY_ADMIN_TABS = [
  ...TABS,
  { key: "perfil", label: "Mi perfil", children: <MyInstructorPanel /> },
];

const AcademyAdminPage = () => {
  const router = useRouter();
  const allowed = useAcademyRoleGuard(isAcademyAdmin);
  const group = useAuthStore((state) => state.user?.group);
  const tabs = group === UserGroups.Admin ? ADMIN_TABS : ACADEMY_ADMIN_TABS;
  const tab = (router.query.tab as string) || "cursos";

  return (
    <AcademyLayout title="Administrar academia">
      <h1 className="text-2xl font-bold mb-4">Administrar academia</h1>
      {!allowed ? (
        <AcademyLoader />
      ) : (
        <Panel>
          <ButtonTabs
            items={tabs}
            activeKey={tabs.some((t) => t.key === tab) ? tab : "cursos"}
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
