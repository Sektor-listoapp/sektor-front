import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@apollo/client";
import { Input } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import withAuth from "@/components/shared/with-auth";
import AcademyLayout, {
  AcademyLoader,
  useAcademyRoleGuard,
} from "@/components/academy/academy-layout";
import { friendlyError, isAcademyAdmin } from "@/components/academy/constants";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import { ACADEMY_CALENDAR_ITEMS_QUERY } from "@/lib/sektor-api/queries";
import { VALIDATE_ACADEMY_QR } from "@/lib/sektor-api/mutations";
import { Mutation, Query } from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";

const QrScanner = dynamic(() => import("@/components/academy/admin/qr-scanner"), {
  ssr: false,
});

interface ScanResult {
  ok: boolean;
  message: string;
  studentName?: string | null;
  at: Date;
}

const AttendancePage = () => {
  const { query } = useRouter();
  const courseId = query.courseId as string;
  const allowed = useAcademyRoleGuard(isAcademyAdmin);
  const [manualCode, setManualCode] = useState("");
  const [last, setLast] = useState<ScanResult | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);

  const { data } = useQuery<Query>(ACADEMY_CALENDAR_ITEMS_QUERY, {
    skip: !allowed,
  });
  const course = data?.academyCalendarItems.find(
    (item) => item.courseId === courseId
  );

  const [validate, { loading }] = useMutation<Mutation>(VALIDATE_ACADEMY_QR);

  const submit = async (payload: string) => {
    const qrPayload = payload.trim();
    if (!qrPayload || loading) return;
    let result: ScanResult;
    try {
      const res = await validate({
        variables: { input: { courseId, qrPayload } },
      });
      const r = res.data?.validateAcademyQr;
      result = {
        ok: !!r?.success,
        message: r?.success
          ? "Asistencia registrada"
          : r?.message || "QR no válido para este evento",
        studentName: r?.studentName,
        at: new Date(),
      };
    } catch (e) {
      result = { ok: false, message: friendlyError(e), at: new Date() };
    }
    setLast(result);
    setHistory((prev) => [result, ...prev].slice(0, 30));
    if (result.ok) setManualCode("");
  };

  return (
    <AcademyLayout title="Tomar asistencia" hideTabs>
      <Link
        href={`${ROUTES.ACADEMY_ADMIN}?tab=calendario`}
        className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Volver al calendario
      </Link>

      <h1 className="text-2xl font-bold">Tomar asistencia</h1>
      {course && (
        <p className="text-gray-500 mb-6">
          {course.title} · {dayjs(course.scheduledAt).format("DD/MM/YYYY hh:mm a")}
          {course.location ? ` · ${course.location}` : ""}
        </p>
      )}

      {!allowed ? (
        <AcademyLoader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <section className="flex flex-col gap-4">
            <QrScanner onScan={submit} paused={loading} />

            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
              <label htmlFor="manual-code" className="text-sm font-bold">
                ¿No lee la cámara? Ingresa el código
              </label>
              <div className="flex gap-2">
                <Input
                  id="manual-code"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onPressEnter={() => submit(manualCode)}
                  placeholder="Código del estudiante"
                  autoComplete="off"
                />
                <Button
                  variant="solid-blue"
                  disabled={!manualCode.trim() || loading}
                  onClick={() => submit(manualCode)}
                >
                  Validar
                </Button>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            {last ? (
              <div
                role="status"
                className={cn(
                  "rounded-xl p-6 text-white flex flex-col items-center gap-2 text-center",
                  last.ok ? "bg-[#3EA574]" : "bg-[#CF3E3C]"
                )}
              >
                <FontAwesomeIcon
                  icon={last.ok ? faCircleCheck : faCircleXmark}
                  size="3x"
                />
                <span className="text-lg font-bold">{last.message}</span>
                {last.studentName && <span>{last.studentName}</span>}
              </div>
            ) : (
              <div className="rounded-xl p-6 bg-white shadow-sm text-center text-gray-500">
                Apunta la cámara al QR que muestra el estudiante en su app o en la
                web.
              </div>
            )}

            {history.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="font-bold mb-2">Escaneos de esta sesión</h2>
                <ul className="flex flex-col divide-y divide-gray-100">
                  {history.map((item, i) => (
                    <li key={i} className="py-2 flex items-center gap-3 text-sm">
                      <FontAwesomeIcon
                        icon={item.ok ? faCircleCheck : faCircleXmark}
                        className={item.ok ? "text-[#3EA574]" : "text-[#CF3E3C]"}
                      />
                      <span className="flex-1">
                        {item.studentName || item.message}
                      </span>
                      <span className="text-gray-400">
                        {dayjs(item.at).format("hh:mm:ss a")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      )}
    </AcademyLayout>
  );
};

export default withAuth(AttendancePage);
