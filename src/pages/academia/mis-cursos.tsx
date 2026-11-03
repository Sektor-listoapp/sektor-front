import React, { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Empty, Modal, Progress, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faQrcode, faTowerBroadcast } from "@fortawesome/free-solid-svg-icons";
import QRCode from "react-qr-code";
import withAuth from "@/components/shared/with-auth";
import AcademyLayout, {
  AcademyLoader,
  useAcademyRoleGuard,
} from "@/components/academy/academy-layout";
import {
  LEVEL_LABEL,
  MODALITY_LABEL,
  friendlyError,
  isAcademyStudent,
} from "@/components/academy/constants";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import {
  MY_ACADEMY_ATTENDANCE_QR_QUERY,
  MY_ACADEMY_CALENDAR_ITEMS_QUERY,
  MY_ACADEMY_COURSES_QUERY,
} from "@/lib/sektor-api/queries";
import {
  AcademyCourseModality,
  MyAcademyCalendarItem,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { ButtonTabs, Panel, Pill } from "@/components/academy/ui";

const MyCoursesTab = () => {
  const { data, loading, error } = useQuery<Query>(MY_ACADEMY_COURSES_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const courses = data?.myAcademyCourses ?? [];
  if (loading && !data) return <AcademyLoader />;
  if (error && !data) return <p className="text-red-500">{friendlyError(error)}</p>;
  if (!courses.length)
    return (
      <Empty description="Aún no estás inscrito en ningún curso" className="py-10">
        <Link href={ROUTES.ACADEMY} className="underline">
          Ver catálogo
        </Link>
      </Empty>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((c) => {
        const online = c.modality === AcademyCourseModality.Online;
        const progress = Math.round(c.progress ?? 0);
        return (
          <Link
            key={c.id}
            href={online ? `${ROUTES.ACADEMY_LEARN}/${c.id}` : `${ROUTES.ACADEMY}/${c.id}`}
            className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            {c.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.imageUrl} alt="" className="h-36 w-full object-cover" />
            ) : (
              <div className="h-36 bg-gray-200" />
            )}
            <div className="p-4 flex flex-col gap-2 flex-1 text-blue-500">
              <div className="flex gap-1 flex-wrap">
                {c.modality && <Pill solid>{MODALITY_LABEL[c.modality]}</Pill>}
                {c.level && <Pill>{LEVEL_LABEL[c.level]}</Pill>}
              </div>
              <h3 className="font-bold">{c.title}</h3>
              {online ? (
                <Progress percent={progress} size="small" status={progress >= 100 ? "success" : "active"} />
              ) : (
                c.scheduledAt && (
                  <span className="text-sm text-gray-500">
                    {dayjs(c.scheduledAt).format("DD/MM/YYYY · hh:mm a")}
                  </span>
                )
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const AttendanceQrModal = ({
  item,
  onClose,
}: {
  item: MyAcademyCalendarItem | null;
  onClose: () => void;
}) => {
  const [load, { data, loading, error }] = useLazyQuery<Query>(MY_ACADEMY_ATTENDANCE_QR_QUERY, {
    fetchPolicy: "network-only",
  });
  React.useEffect(() => {
    if (item) load({ variables: { courseId: item.courseId } });
  }, [item, load]);
  const qr = data?.myAcademyAttendanceQr;

  return (
    <Modal open={!!item} onCancel={onClose} footer={null} title="Tu QR de asistencia" destroyOnClose>
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        {loading || !data ? (
          error ? (
            <p className="text-red-500">{friendlyError(error)}</p>
          ) : (
            <Spin />
          )
        ) : qr ? (
          <>
            <div className="bg-white p-4 rounded-xl border">
              <QRCode value={qr.qrPayload} size={220} />
            </div>
            {qr.code && (
              <p className="text-sm">
                Código: <b className="tracking-widest text-lg">{qr.code}</b>
              </p>
            )}
            <p className="text-sm text-gray-500">
              Muéstralo en la entrada de <b>{item?.title}</b>. Sube el brillo de la
              pantalla si no lo leen.
            </p>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

const MyCalendarTab = () => {
  const [qrItem, setQrItem] = useState<MyAcademyCalendarItem | null>(null);
  const { data, loading, error } = useQuery<Query>(MY_ACADEMY_CALENDAR_ITEMS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const items = [...(data?.myAcademyCalendarItems ?? [])]
    .filter((i) => i.isEnrolled)
    .sort((a, b) => dayjs(a.scheduledAt).valueOf() - dayjs(b.scheduledAt).valueOf());

  if (loading && !data) return <AcademyLoader />;
  if (error && !data) return <p className="text-red-500">{friendlyError(error)}</p>;
  if (!items.length) return <Empty description="No tienes clases agendadas" className="py-10" />;

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const date = dayjs(item.scheduledAt);
        const presential = item.modality === AcademyCourseModality.Presential;
        return (
          <div key={item.courseId} className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 text-center bg-blue-500 text-white rounded-lg py-2 shrink-0">
                <div className="text-xl font-bold leading-none">{date.format("DD")}</div>
                <div className="text-xs uppercase">{date.format("MMM")}</div>
              </div>
              <div className="flex flex-col gap-1">
                <Link href={`${ROUTES.ACADEMY}/${item.courseId}`} className="font-bold hover:underline">
                  {item.title}
                </Link>
                <span className="text-sm text-gray-500">
                  {date.format("dddd DD/MM · hh:mm a")} · {MODALITY_LABEL[item.modality]}
                </span>
                {item.location && (
                  <span className="text-sm text-gray-500">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                    {item.location}
                  </span>
                )}
              </div>
            </div>
            {presential ? (
              <Button variant="solid-blue" onClick={() => setQrItem(item)}>
                <FontAwesomeIcon icon={faQrcode} /> Mi QR
              </Button>
            ) : (
              item.streamingUrl && (
                <a href={item.streamingUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="solid-blue">
                    <FontAwesomeIcon icon={faTowerBroadcast} /> Unirme
                  </Button>
                </a>
              )
            )}
          </div>
        );
      })}
      <AttendanceQrModal item={qrItem} onClose={() => setQrItem(null)} />
    </div>
  );
};

const MyCoursesPage = () => {
  const allowed = useAcademyRoleGuard(isAcademyStudent);
  const [tab, setTab] = useState<"cursos" | "calendario">("cursos");
  return (
    <AcademyLayout title="Mis cursos">
      <h1 className="text-2xl font-bold mb-4">Mis cursos</h1>
      {!allowed ? (
        <AcademyLoader />
      ) : (
        <Panel>
          <ButtonTabs
            items={[
              { key: "cursos", label: "Cursos", children: <MyCoursesTab /> },
              { key: "calendario", label: "Calendario", children: <MyCalendarTab /> },
            ]}
            activeKey={tab}
            onChange={setTab}
          />
        </Panel>
      )}
    </AcademyLayout>
  );
};

export default withAuth(MyCoursesPage);
