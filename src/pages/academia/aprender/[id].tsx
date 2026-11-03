import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@apollo/client";
import { Alert, Modal, Radio } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faCircleQuestion,
  faFileLines,
  faLock,
  faPaperclip,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import withAuth from "@/components/shared/with-auth";
import AcademyLayout, {
  AcademyLoader,
  useAcademyRoleGuard,
} from "@/components/academy/academy-layout";
import {
  MODULE_TYPE_LABEL,
  VIDEO_REQUIRED_FRACTION,
  formatDuration,
  friendlyError,
  isAcademyStudent,
} from "@/components/academy/constants";
import LessonVideo from "@/components/academy/student/lesson-video";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import { ACADEMY_COURSE_STUDENT_QUERY } from "@/lib/sektor-api/queries";
import {
  COMPLETE_ACADEMY_LESSON,
  REPORT_ACADEMY_VIDEO_PROGRESS,
  SUBMIT_ACADEMY_QUIZ,
} from "@/lib/sektor-api/mutations";
import {
  AcademyCourse,
  AcademyCourseModality,
  AcademyCourseModule,
  AcademyCourseModuleType,
  AcademyEnrollmentStatus,
  AcademyQuizQuestionType,
  Mutation,
  Query,
} from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";

const MODULE_ICON = {
  [AcademyCourseModuleType.Video]: faVideo,
  [AcademyCourseModuleType.Text]: faFileLines,
  [AcademyCourseModuleType.Quiz]: faCircleQuestion,
};

/** Quiz of a live/presential course opens only after the session ends. */
const isQuizPendingLiveSession = (course: AcademyCourse) => {
  if (course.modality === AcademyCourseModality.Online || !course.scheduledAt) return false;
  const end = dayjs(course.scheduledAt).add(course.durationMinutes ?? 0, "minute");
  return dayjs().isBefore(end);
};

const LearnPage = () => {
  const router = useRouter();
  const courseId = router.query.id as string;
  const allowed = useAcademyRoleGuard(isAcademyStudent);

  const { data, loading, error, refetch } = useQuery<Query>(ACADEMY_COURSE_STUDENT_QUERY, {
    variables: { id: courseId },
    skip: !allowed || !courseId,
    fetchPolicy: "cache-and-network",
  });
  const course = data?.academyCourse;
  const quote = data?.academyCoursePaymentQuote;
  const [completeLesson, { loading: completing }] = useMutation(COMPLETE_ACADEMY_LESSON);
  const [submitQuiz, { loading: submitting }] = useMutation<Mutation>(SUBMIT_ACADEMY_QUIZ);
  const [reportVideo] = useMutation<Mutation>(REPORT_ACADEMY_VIDEO_PROGRESS);

  // The course's final quiz (live courses) is shown as one more lesson at the
  // end; it is graded with moduleIndex omitted.
  const realModules = useMemo(() => course?.modules ?? [], [course]);
  // Courses created by the app/web already carry the quiz as a Quiz module;
  // only fall back to a virtual final lesson when there is none.
  const hasQuizModule = realModules.some((m) => m.type === AcademyCourseModuleType.Quiz);
  const finalIndex =
    (course?.finalQuizQuestions ?? []).length && !hasQuizModule ? realModules.length : -1;
  const modules: AcademyCourseModule[] = useMemo(
    () =>
      finalIndex >= 0
        ? [
            ...realModules,
            {
              type: AcademyCourseModuleType.Quiz,
              title: "Quiz final",
              quizQuestions: course?.finalQuizQuestions,
            } as AcademyCourseModule,
          ]
        : realModules,
    [realModules, finalIndex, course]
  );
  const finalPassed =
    !!course?.certificate ||
    [AcademyEnrollmentStatus.Approved, AcademyEnrollmentStatus.Completed].includes(
      quote?.enrollment?.status as AcademyEnrollmentStatus
    );
  const completed = useMemo(() => {
    const set = new Set(course?.completedModuleIndexes ?? []);
    if (finalIndex >= 0 && finalPassed) set.add(finalIndex);
    return set;
  }, [course, finalIndex, finalPassed]);
  const firstPending = modules.findIndex((_, i) => !completed.has(i));
  const requested = Number(router.query.leccion);
  const index = Number.isInteger(requested) && requested >= 0 && requested < modules.length
    ? requested
    : Math.max(0, firstPending);
  const lesson = modules[index];

  const [videoFraction, setVideoFraction] = useState(0);
  const [serverVideoOk, setServerVideoOk] = useState(false);
  const [openedAttachment, setOpenedAttachment] = useState(false);
  const [answers, setAnswers] = useState<Record<number, unknown>>({});

  const quizPending = course ? isQuizPendingLiveSession(course) : false;
  const isLocked = (i: number) => {
    if (completed.has(i)) return false;
    if (modules[i]?.type === AcademyCourseModuleType.Quiz && quizPending) return true;
    // Lessons unlock in order.
    return i > 0 && !completed.has(i - 1);
  };

  const savedVideo = course?.videoProgress?.find((v) => v.moduleIndex === index);

  // Server-side tracking: heartbeats while playing, plus one as soon as the
  // student crosses the threshold so "Siguiente" unlocks without waiting.
  const heartbeat = (positionSeconds: number) =>
    reportVideo({ variables: { courseId, moduleIndex: index, positionSeconds } })
      .then((res) => {
        if (res.data?.reportAcademyVideoProgress.canComplete) setServerVideoOk(true);
      })
      .catch(() => undefined);

  const onVideoProgress = (fraction: number, positionSeconds: number) => {
    if (fraction >= VIDEO_REQUIRED_FRACTION && videoFraction < VIDEO_REQUIRED_FRACTION)
      heartbeat(positionSeconds);
    setVideoFraction(fraction);
  };

  const goTo = (i: number) => {
    setVideoFraction(0);
    setServerVideoOk(false);
    setOpenedAttachment(false);
    setAnswers({});
    router.push({ query: { id: courseId, leccion: i } }, undefined, { shallow: true });
    window.scrollTo({ top: 0 });
  };

  const backToCourse = `${ROUTES.ACADEMY}/${courseId}`;
  const notEnrolled = !!data && !quote?.alreadyEnrolled;

  useEffect(() => {
    if (notEnrolled) router.replace(backToCourse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notEnrolled]);

  if (!allowed || (loading && !data)) {
    return (
      <AcademyLayout hideTabs>
        <AcademyLoader />
      </AcademyLayout>
    );
  }
  if (error || !course) {
    return (
      <AcademyLayout hideTabs>
        <p className="text-red-500">{error ? friendlyError(error) : "Curso no encontrado"}</p>
      </AcademyLayout>
    );
  }
  if (notEnrolled) return null;

  const canProceed =
    !lesson ||
    completed.has(index) ||
    (lesson.type === AcademyCourseModuleType.Video &&
      (serverVideoOk || !!savedVideo?.canComplete)) ||
    (lesson.type === AcademyCourseModuleType.Text &&
      (!(lesson.attachmentUrls ?? []).length || openedAttachment)) ||
    (lesson.type === AcademyCourseModuleType.Quiz &&
      (lesson.quizQuestions ?? []).every((_, i) => answers[i] !== undefined));

  const advance = async () => {
    if (!lesson) return;
    try {
      if (lesson.type === AcademyCourseModuleType.Quiz && !completed.has(index)) {
        // Graded on the server; the browser never needs the right answers.
        const res = await submitQuiz({
          variables: {
            input: {
              courseId,
              moduleIndex: index === finalIndex ? null : index,
              answers: (lesson.quizQuestions ?? []).map((q, qi) =>
                q.type === AcademyQuizQuestionType.TrueFalse
                  ? { questionIndex: qi, booleanAnswer: answers[qi] as boolean }
                  : { questionIndex: qi, option: answers[qi] as string }
              ),
            },
          },
        });
        const result = res.data!.submitAcademyQuiz;
        const passed = result.passed;
        await refetch();
        Modal[passed ? "success" : "warning"]({
          title: passed ? "¡Aprobaste!" : "No alcanzaste el puntaje mínimo",
          content: `Obtuviste ${result.score}% (${result.correctCount} de ${result.total}). Se necesita ${result.passingScore}% para aprobar.${
            result.certificateCode ? " ¡Ya tienes tu certificado!" : ""
          }`,
          okText: passed ? "Continuar" : "Intentar de nuevo",
          onOk: () => {
            if (!passed) return setAnswers({});
            if (index < modules.length - 1) goTo(index + 1);
            else router.push(backToCourse);
          },
        });
        return;
      }
      if (!completed.has(index)) {
        await completeLesson({ variables: { courseId, moduleIndex: index } });
        await refetch();
      }
      if (index < modules.length - 1) goTo(index + 1);
      else {
        toast.success("¡Completaste el curso!");
        router.push(backToCourse);
      }
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  const hint =
    lesson?.type === AcademyCourseModuleType.Video && !canProceed
      ? videoFraction >= VIDEO_REQUIRED_FRACTION
        ? "Verificando tu progreso… sigue reproduciendo unos segundos."
        : `Mira al menos el ${VIDEO_REQUIRED_FRACTION * 100}% del video para continuar (${Math.round(
            videoFraction * 100
          )}%).`
      : lesson?.type === AcademyCourseModuleType.Text && !canProceed
      ? "Abre el archivo adjunto para continuar."
      : lesson?.type === AcademyCourseModuleType.Quiz && !canProceed
      ? "Responde todas las preguntas."
      : "";

  return (
    <AcademyLayout title={course.title} hideTabs>
      <Link href={backToCourse} className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-2 mb-4">
        <FontAwesomeIcon icon={faArrowLeft} /> {course.title}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <section className="flex flex-col gap-5 min-w-0">
          {!lesson ? (
            <p>Este curso no tiene lecciones.</p>
          ) : isLocked(index) ? (
            <Alert
              type="info"
              showIcon
              message={
                lesson.type === AcademyCourseModuleType.Quiz && quizPending
                  ? "Disponible al finalizar el curso"
                  : "Completa la lección anterior para desbloquear esta."
              }
            />
          ) : (
            <>
              <header>
                <span className="text-xs text-gray-500 uppercase">
                  Lección {index + 1} de {modules.length} · {MODULE_TYPE_LABEL[lesson.type]}
                </span>
                <h1 className="text-2xl font-bold">
                  {lesson.title || `${MODULE_TYPE_LABEL[lesson.type]} ${index + 1}`}
                </h1>
              </header>

              {lesson.type === AcademyCourseModuleType.Video && lesson.videoUrl && (
                <LessonVideo
                  key={`${courseId}-${index}`}
                  src={lesson.videoUrl}
                  initialWatchedSeconds={savedVideo?.watchedSeconds ?? 0}
                  onProgress={onVideoProgress}
                  onHeartbeat={heartbeat}
                />
              )}

              {lesson.type === AcademyCourseModuleType.Text && (
                <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-4">
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">{lesson.content}</p>
                  {(lesson.attachmentUrls ?? []).map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpenedAttachment(true)}
                      className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50"
                    >
                      <FontAwesomeIcon icon={faPaperclip} />
                      <span className="truncate">{decodeURIComponent(url.split("/").pop() ?? url)}</span>
                    </a>
                  ))}
                </div>
              )}

              {lesson.type === AcademyCourseModuleType.Quiz && (
                <div className="flex flex-col gap-4">
                  {completed.has(index) && (
                    <Alert type="success" showIcon message="Ya aprobaste este quiz." />
                  )}
                  {(lesson.quizQuestions ?? []).map((q, qi) => (
                    <fieldset key={qi} className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3">
                      <legend className="sr-only">Pregunta {qi + 1}</legend>
                      <span className="text-xs text-gray-500">
                        Pregunta {qi + 1} de {lesson.quizQuestions!.length}
                      </span>
                      <span className="font-bold">{q.title}</span>
                      <Radio.Group
                        disabled={completed.has(index)}
                        value={answers[qi]}
                        onChange={(e) => setAnswers((prev) => ({ ...prev, [qi]: e.target.value }))}
                        className="flex flex-col gap-2"
                      >
                        {q.type === AcademyQuizQuestionType.TrueFalse ? (
                          <>
                            <Radio value={true}>Verdadero</Radio>
                            <Radio value={false}>Falso</Radio>
                          </>
                        ) : (
                          (q.options ?? []).map((o) => (
                            <Radio key={o} value={o}>
                              {o}
                            </Radio>
                          ))
                        )}
                      </Radio.Group>
                    </fieldset>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-white rounded-xl shadow-sm p-4">
                <span className="text-sm text-gray-500">{hint}</span>
                <Button variant="solid-blue" disabled={!canProceed || completing || submitting} onClick={advance}>
                  {lesson.type === AcademyCourseModuleType.Quiz && !completed.has(index)
                    ? "Enviar respuestas"
                    : index === modules.length - 1
                    ? "Finalizar"
                    : "Siguiente"}
                </Button>
              </div>
            </>
          )}
        </section>

        <aside className="bg-white rounded-xl shadow-sm p-4 h-fit lg:sticky lg:top-4">
          <h2 className="font-bold mb-3">Contenido del curso</h2>
          <ol className="flex flex-col gap-1">
            {modules.map((m, i) => {
              const locked = isLocked(i);
              const done = completed.has(i);
              return (
                <li key={i}>
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => goTo(i)}
                    className={cn(
                      "w-full text-left flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                      i === index ? "bg-blue-50 font-bold" : "hover:bg-gray-50",
                      locked && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
                        done ? "bg-[#3EA574] text-white" : "bg-gray-100"
                      )}
                    >
                      <FontAwesomeIcon icon={done ? faCheck : locked ? faLock : MODULE_ICON[m.type]} />
                    </span>
                    <span className="flex-1 truncate">
                      {m.title || `${MODULE_TYPE_LABEL[m.type]} ${i + 1}`}
                    </span>
                    {m.durationSeconds ? (
                      <span className="text-xs text-gray-400">{formatDuration(m.durationSeconds)}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>
      </div>
    </AcademyLayout>
  );
};

export default withAuth(LearnPage);
