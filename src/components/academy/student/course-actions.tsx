import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@apollo/client";
import { Progress, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faLocationDot,
  faPen,
  faTowerBroadcast,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useShallow } from "zustand/shallow";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import { useAuthStore } from "@/store/auth";
import { ACADEMY_COURSE_STUDENT_QUERY } from "@/lib/sektor-api/queries";
import { START_ACADEMY_COURSE } from "@/lib/sektor-api/mutations";
import {
  AcademyCourseModality,
  PublicAcademyCourse,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { formatUsd, formatVes, friendlyError, isAcademyAdmin, isAcademyStudent } from "../constants";
import CheckoutModal from "./checkout-modal";

const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-4">{children}</div>
);

/**
 * Right-hand purchase/enroll box. Everything that depends on who is looking
 * is client-only, so the server-rendered page stays cacheable and indexable.
 */
const CourseActions = ({ course }: { course: PublicAcademyCourse }) => {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.getIsAuthenticated)();
  const group = useAuthStore(useShallow((s) => s.user?.group));
  useEffect(() => setHydrated(true), []);

  const student = hydrated && isAuthenticated && isAcademyStudent(group);
  const { data, loading, refetch } = useQuery<Query>(ACADEMY_COURSE_STUDENT_QUERY, {
    variables: { id: course.id },
    skip: !student,
    fetchPolicy: "cache-and-network",
  });
  const [startCourse, { loading: starting }] = useMutation(START_ACADEMY_COURSE);

  const price = (
    <div>
      <span className="text-3xl font-bold">{formatUsd(course.priceUsd)}</span>
      {!!course.priceUsd && course.amountVes != null && (
        <span className="block text-sm text-gray-500">≈ {formatVes(course.amountVes)}</span>
      )}
    </div>
  );
  const adminButton = isAcademyAdmin(group) ? (
    <Button
      variant="outline"
      onClick={() => router.push(`${ROUTES.ACADEMY_ADMIN_COURSE}/${course.id}`)}
    >
      <FontAwesomeIcon icon={faPen} /> Administrar curso
    </Button>
  ) : null;
  const full = !!course.maxCapacity && course.enrolledCount >= course.maxCapacity;
  const scheduled = course.modality !== AcademyCourseModality.Online;

  if (!hydrated) {
    return (
      <Box>
        {price}
        <div className="h-11 rounded-3xl bg-gray-100 animate-pulse" />
      </Box>
    );
  }

  if (!isAuthenticated) {
    const redirectTo = router.asPath;
    return (
      <Box>
        {price}
        <Button
          variant="solid-blue"
          onClick={() => router.push({ pathname: ROUTES.LOGIN, query: { redirectTo } })}
        >
          Inscribirme
        </Button>
        <p className="text-sm text-gray-500 text-center">
          Inicia sesión o{" "}
          <Link href={{ pathname: ROUTES.REGISTER, query: { redirectTo } }} className="underline">
            crea tu cuenta
          </Link>{" "}
          para inscribirte.
        </p>
      </Box>
    );
  }

  if (loading && !data) {
    return (
      <Box>
        <div className="py-6 flex justify-center">
          <Spin />
        </div>
      </Box>
    );
  }

  const detail = data?.academyCourse;
  const quote = data?.academyCoursePaymentQuote;
  const enrolled = !!quote?.alreadyEnrolled;

  const enrollFree = async () => {
    try {
      await startCourse({ variables: { id: course.id } });
      toast.success("¡Te inscribiste!");
      await refetch();
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  if (!enrolled) {
    return (
      <Box>
        {price}
        {full ? (
          <Button variant="solid-blue" disabled>
            Cupos agotados
          </Button>
        ) : quote?.canPurchase === false && course.priceUsd > 0 ? (
          <p className="text-sm text-gray-500">Este curso no está disponible para compra.</p>
        ) : (
          <Button
            variant="solid-blue"
            disabled={starting}
            onClick={() => (course.priceUsd > 0 ? setCheckoutOpen(true) : enrollFree())}
          >
            {course.priceUsd > 0 ? `Comprar por ${formatUsd(course.priceUsd)}` : "Inscribirme gratis"}
          </Button>
        )}
        <CheckoutModal
          open={checkoutOpen}
          courseId={course.id}
          courseTitle={course.title}
          onClose={() => setCheckoutOpen(false)}
          onPaid={() => refetch()}
        />
        {adminButton}
      </Box>
    );
  }

  // Enrolled
  const totalModules = detail?.modules?.length ?? 0;
  const done = detail?.completedModuleIndexes?.length ?? 0;
  const certificate = detail?.certificate;
  const hasFinalQuiz = (detail?.finalQuizQuestions ?? []).length > 0;
  const startsAt = course.scheduledAt ? dayjs(course.scheduledAt) : null;
  const endsAt = startsAt?.add(course.durationMinutes ?? 0, "minute");
  const started = !startsAt || !dayjs().isBefore(startsAt);
  const ended = !!endsAt && dayjs().isAfter(endsAt);

  return (
    <Box>
      <span className="text-sm font-bold text-[#3EA574]">Estás inscrito</span>

      {!scheduled && (
        <>
          <Progress percent={totalModules ? Math.round((done / totalModules) * 100) : 0} />
          <Button variant="solid-blue" onClick={() => router.push(`${ROUTES.ACADEMY_LEARN}/${course.id}`)}>
            {done === 0 ? "Empezar curso" : done >= totalModules ? "Repasar curso" : "Continuar curso"}
          </Button>
        </>
      )}

      {scheduled && !started && startsAt && (
        <Button variant="solid-blue" disabled>
          Comienza el {startsAt.format("DD/MM/YYYY · hh:mm a")}
        </Button>
      )}

      {course.modality === AcademyCourseModality.LiveStreaming && started && !ended && detail?.streamingUrl && (
        <a href={detail.streamingUrl} target="_blank" rel="noopener noreferrer" className="flex">
          <Button variant="solid-blue" className="w-full">
            <FontAwesomeIcon icon={faTowerBroadcast} /> Unirme al en vivo
          </Button>
        </a>
      )}

      {course.modality === AcademyCourseModality.Presential && course.location && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(course.location)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex"
        >
          <Button variant="outline" className="w-full">
            <FontAwesomeIcon icon={faLocationDot} /> Ver ubicación
          </Button>
        </a>
      )}

      {course.modality === AcademyCourseModality.Presential && (
        <Link href={`${ROUTES.ACADEMY_MY_COURSES}`} className="text-sm underline text-center">
          Tu QR de asistencia está en Mis cursos → Calendario
        </Link>
      )}

      {scheduled && hasFinalQuiz && !certificate && (
        <Button
          variant="solid-blue"
          disabled={!ended}
          onClick={() => router.push(`${ROUTES.ACADEMY_LEARN}/${course.id}`)}
        >
          {ended ? "Presentar quiz final" : "Quiz final disponible al terminar"}
        </Button>
      )}

      {certificate && (
        <Link
          href={`${ROUTES.ACADEMY}/certificado/${certificate.certificateCode}`}
          className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
        >
          <FontAwesomeIcon icon={faCertificate} size="2x" />
          <span className="flex flex-col">
            <span className="font-bold">Ver mi certificado</span>
            <span className="text-xs text-gray-500">{certificate.certificateCode}</span>
          </span>
        </Link>
      )}

      {adminButton}
    </Box>
  );
};

export default CourseActions;
