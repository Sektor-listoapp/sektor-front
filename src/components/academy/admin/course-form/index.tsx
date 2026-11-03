import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import {
  Alert,
  DatePicker,
  Input,
  InputNumber,
  Progress,
  Select,
  Slider,
  Steps,
  Switch,
  Tag,
  Upload,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faCircleQuestion,
  faFileLines,
  faImage,
  faPaperclip,
  faTrash,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import { ROUTES } from "@/constants/router";
import {
  CREATE_ACADEMY_COURSE,
  UPDATE_ACADEMY_COURSE,
} from "@/lib/sektor-api/mutations";
import { ACADEMY_COURSES_QUERY } from "@/lib/sektor-api/queries";
import {
  AcademyCourse,
  AcademyCourseAssetType,
  AcademyCourseCategory,
  AcademyCourseLevel,
  AcademyCourseModality,
  AcademyCourseModuleType,
} from "@/lib/sektor-api/__generated__/types";
import { cn } from "@/utils/class-name";
import {
  CATEGORY_LABEL,
  LEVEL_LABEL,
  MODALITY_LABEL,
  MODULE_TYPE_LABEL,
  formatDuration,
  formatUsd,
  friendlyError,
} from "../../constants";
import {
  getVideoDuration,
  useAcademyAssetUpload,
} from "../../use-academy-asset-upload";
import QuizEditor from "./quiz-editor";
import {
  CourseDraft,
  LessonDraft,
  draftFromCourse,
  draftToInput,
  emptyCourse,
  emptyLesson,
  newKey,
  validateStep,
} from "./types";

const STEPS = ["Información", "Formato", "Contenido", "Publicar"];

const MODULE_ICON = {
  [AcademyCourseModuleType.Video]: faVideo,
  [AcademyCourseModuleType.Text]: faFileLines,
  [AcademyCourseModuleType.Quiz]: faCircleQuestion,
};

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
    {children}
    {hint && <span className="text-xs text-gray-500">{hint}</span>}
  </label>
);

interface CourseFormProps {
  course?: AcademyCourse & { canEdit?: boolean | null };
}

const CourseForm = ({ course }: CourseFormProps) => {
  const router = useRouter();
  const readOnly = !!course && !course.canEdit;
  const [draft, setDraft] = useState<CourseDraft>(() =>
    course ? draftFromCourse(course) : emptyCourse()
  );
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    label: string;
    percent: number;
  } | null>(null);

  const uploadAsset = useAcademyAssetUpload();
  const mutationOptions = {
    refetchQueries: [ACADEMY_COURSES_QUERY],
    awaitRefetchQueries: false,
  };
  const [createCourse] = useMutation(CREATE_ACADEMY_COURSE, mutationOptions);
  const [updateCourse] = useMutation(UPDATE_ACADEMY_COURSE, mutationOptions);

  const set = (patch: Partial<CourseDraft>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const setLesson = (index: number, patch: Partial<LessonDraft>) =>
    setDraft((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    }));

  const moveLesson = (index: number, delta: number) =>
    setDraft((prev) => {
      const lessons = [...prev.lessons];
      const target = index + delta;
      if (target < 0 || target >= lessons.length) return prev;
      [lessons[index], lessons[target]] = [lessons[target], lessons[index]];
      return { ...prev, lessons };
    });

  const coverPreview = useMemo(
    () => (draft.imageFile ? URL.createObjectURL(draft.imageFile) : draft.imageUrl),
    [draft.imageFile, draft.imageUrl]
  );
  useEffect(
    () => () => {
      if (draft.imageFile && coverPreview) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview, draft.imageFile]
  );

  // Warn before closing the tab with unsaved edits (Files serialize as {},
  // so a newly picked file also changes the snapshot via its draft key).
  const [initialSnapshot] = useState(() => JSON.stringify(draft));
  const isDirty = JSON.stringify(draft) !== initialSnapshot;
  useEffect(() => {
    if (readOnly || !isDirty || saving) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [readOnly, isDirty, saving]);

  const goNext = () => {
    if (readOnly) return setStep((s) => Math.min(s + 1, STEPS.length - 1));
    const stepErrors = validateStep(step, draft);
    setErrors(stepErrors);
    if (stepErrors.length === 0) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setErrors([]);
    setStep((s) => Math.max(0, s - 1));
  };

  const publish = async () => {
    const allErrors = [0, 1, 2].flatMap((s) => validateStep(s, draft));
    if (allErrors.length) {
      setErrors(allErrors);
      return;
    }
    setSaving(true);
    setErrors([]);
    try {
      const upload = async (file: File, type: AcademyCourseAssetType, label: string) => {
        setUploadStatus({ label, percent: 0 });
        const url = await uploadAsset(file, type, (percent) =>
          setUploadStatus({ label, percent })
        );
        setUploadStatus(null);
        return url;
      };

      // Upload new files first, then keep the resulting URLs in the draft so a
      // retry after a failure doesn't upload the same file twice.
      const next: CourseDraft = { ...draft, lessons: [...draft.lessons] };
      if (next.imageFile) {
        next.imageUrl = await upload(next.imageFile, AcademyCourseAssetType.CourseCover, "Portada");
        next.imageFile = undefined;
        setDraft({ ...next });
      }
      if (next.modality === AcademyCourseModality.Online) {
        for (let i = 0; i < next.lessons.length; i++) {
          const lesson = { ...next.lessons[i] };
          if (lesson.videoFile) {
            lesson.videoUrl = await upload(
              lesson.videoFile,
              AcademyCourseAssetType.CourseVideo,
              `Video de la lección ${i + 1}`
            );
            lesson.videoFile = undefined;
          }
          const attachments: typeof lesson.attachments = [];
          for (const attachment of lesson.attachments) {
            if (attachment.file) {
              const url = await upload(
                attachment.file,
                AcademyCourseAssetType.CourseAttachment,
                attachment.name
              );
              attachments.push({ ...attachment, url, file: undefined });
            } else attachments.push(attachment);
          }
          lesson.attachments = attachments;
          next.lessons[i] = lesson;
          setDraft({ ...next, lessons: [...next.lessons] });
        }
      }

      const input = draftToInput(next);
      if (course) await updateCourse({ variables: { id: course.id, input } });
      else await createCourse({ variables: { input } });
      toast.success(course ? "Curso actualizado" : "Curso publicado");
      router.push(`${ROUTES.ACADEMY_ADMIN}?tab=cursos`);
    } catch (e) {
      setUploadStatus(null);
      toast.error(friendlyError(e));
    } finally {
      setSaving(false);
    }
  };

  /* --------------------------------- Steps -------------------------------- */

  const infoStep = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Field label="Portada del curso">
          <Upload.Dragger
            disabled={readOnly}
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              set({ imageFile: file });
              return false;
            }}
            className="!p-0"
          >
            {coverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverPreview} alt="Portada" className="max-h-56 mx-auto rounded-md object-cover" />
            ) : (
              <div className="py-8 text-gray-500 flex flex-col items-center gap-2">
                <FontAwesomeIcon icon={faImage} size="2x" />
                Arrastra una imagen o haz clic para elegirla
              </div>
            )}
          </Upload.Dragger>
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Título del curso">
          <Input
            disabled={readOnly}
            value={draft.title}
            placeholder="Ej: Fundamentos del Seguro Patrimonial"
            onChange={(e) => set({ title: e.target.value })}
          />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Descripción">
          <Input.TextArea
            disabled={readOnly}
            rows={5}
            value={draft.description}
            placeholder="¿Qué van a aprender los alumnos?"
            onChange={(e) => set({ description: e.target.value })}
          />
        </Field>
      </div>
      <Field label="Quién dicta el curso" hint="Déjalo vacío si lo dicta Sektor">
        <Input
          disabled={readOnly}
          value={draft.instructorName}
          placeholder="Ej: Adriana Machaca"
          onChange={(e) => set({ instructorName: e.target.value })}
        />
      </Field>
      <Field label="Nivel">
        <Select
          disabled={readOnly}
          value={draft.level}
          placeholder="Selecciona"
          onChange={(level) => set({ level })}
          options={Object.values(AcademyCourseLevel).map((v) => ({
            value: v,
            label: LEVEL_LABEL[v],
          }))}
        />
      </Field>
      <Field label="Tipo de curso">
        <Select
          disabled={readOnly}
          value={draft.courseType}
          placeholder="Selecciona"
          onChange={(courseType) => set({ courseType })}
          options={Object.values(AcademyCourseCategory).map((v) => ({
            value: v,
            label: CATEGORY_LABEL[v],
          }))}
        />
      </Field>
      <Field label="Precio (USD)" hint="0 = gratis">
        <InputNumber
          disabled={readOnly}
          className="!w-full"
          min={0}
          max={5000}
          step={1}
          prefix="$"
          value={draft.priceUsd}
          onChange={(v) => set({ priceUsd: Number(v) || 0 })}
        />
      </Field>
      <div className="md:col-span-2">
        <Field label={`Porcentaje de aprobación — ${draft.passingScore}%`}>
          <Slider
            disabled={readOnly}
            min={10}
            max={100}
            step={5}
            value={draft.passingScore}
            onChange={(passingScore) => set({ passingScore })}
          />
        </Field>
      </div>
    </div>
  );

  const scheduledFields = (
    <>
      <Field label="Fecha y hora">
        <DatePicker
          disabled={readOnly}
          showTime={{ format: "hh:mm a", minuteStep: 5 }}
          format="DD/MM/YYYY hh:mm a"
          value={draft.scheduledAt}
          onChange={(scheduledAt) => set({ scheduledAt: scheduledAt ?? undefined })}
          className="w-full"
        />
      </Field>
      <Field label={`Duración — ${draft.durationMinutes} min`}>
        <Slider
          disabled={readOnly}
          min={15}
          max={240}
          step={15}
          value={draft.durationMinutes}
          onChange={(durationMinutes) => set({ durationMinutes })}
        />
      </Field>
      <Field label="Límite de cupos (opcional)" hint="Déjalo vacío si no hay límite">
        <InputNumber
          disabled={readOnly}
          className="!w-full"
          min={1}
          value={draft.maxCapacity}
          onChange={(v) => set({ maxCapacity: v ? Number(v) : undefined })}
        />
      </Field>
    </>
  );

  const formatStep = (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          {
            value: AcademyCourseModality.Online,
            title: "Online (a tu ritmo)",
            text: "Videos, lecturas y quizzes que el alumno completa cuando quiera.",
          },
          {
            value: AcademyCourseModality.LiveStreaming,
            title: "En vivo (streaming)",
            text: "Una sesión transmitida en una fecha y hora.",
          },
          {
            value: AcademyCourseModality.Presential,
            title: "Presencial",
            text: "Una sesión en sede, con asistencia por QR.",
          },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={readOnly}
            onClick={() =>
              set({
                modality: option.value,
                // Changing format resets content, like the app does.
                ...(option.value !== draft.modality
                  ? { lessons: [], hasFinalQuiz: false, finalQuiz: [] }
                  : {}),
              })
            }
            className={cn(
              "text-left rounded-xl border-2 p-4 bg-white transition-colors",
              draft.modality === option.value
                ? "border-blue-500"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <span className="font-bold block">{option.title}</span>
            <span className="text-sm text-gray-500">{option.text}</span>
          </button>
        ))}
      </div>

      {draft.modality === AcademyCourseModality.LiveStreaming && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Field label="Link de la transmisión" hint="YouTube Live, Zoom, Meet, etc.">
              <Input
                disabled={readOnly}
                value={draft.streamingUrl}
                placeholder="https://"
                onChange={(e) => set({ streamingUrl: e.target.value })}
              />
            </Field>
          </div>
          {scheduledFields}
        </div>
      )}

      {draft.modality === AcademyCourseModality.Presential && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Field label="Dirección / sede">
              <Input
                disabled={readOnly}
                value={draft.location}
                onChange={(e) => set({ location: e.target.value })}
              />
            </Field>
          </div>
          {scheduledFields}
        </div>
      )}
    </div>
  );

  const lessonEditor = (lesson: LessonDraft, index: number) => (
    <div key={lesson.key} className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <FontAwesomeIcon icon={MODULE_ICON[lesson.type]} />
        <span className="font-bold">
          {index + 1}. {MODULE_TYPE_LABEL[lesson.type]}
        </span>
        {!readOnly && (
          <div className="ml-auto flex items-center gap-3 text-gray-500">
            <button type="button" aria-label="Subir" disabled={index === 0} onClick={() => moveLesson(index, -1)} className="disabled:opacity-30">
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
            <button type="button" aria-label="Bajar" disabled={index === draft.lessons.length - 1} onClick={() => moveLesson(index, 1)} className="disabled:opacity-30">
              <FontAwesomeIcon icon={faArrowDown} />
            </button>
            <button
              type="button"
              aria-label="Eliminar lección"
              className="text-red-500"
              onClick={() => set({ lessons: draft.lessons.filter((_, i) => i !== index) })}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      </div>

      <Field label="Título de la lección (opcional)">
        <Input
          disabled={readOnly}
          value={lesson.title}
          onChange={(e) => setLesson(index, { title: e.target.value })}
        />
      </Field>

      {lesson.type === AcademyCourseModuleType.Video && (
        <div className="flex flex-col gap-2">
          {(lesson.videoFile || lesson.videoUrl) && (
            <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-md px-3 py-2">
              <FontAwesomeIcon icon={faVideo} />
              <span className="truncate flex-1">
                {lesson.videoFile?.name ?? decodeURIComponent(lesson.videoUrl!.split("/").pop()!)}
              </span>
              {lesson.durationSeconds ? (
                <Tag>{formatDuration(lesson.durationSeconds)}</Tag>
              ) : null}
            </div>
          )}
          {!readOnly && (
            <Upload
              accept="video/*"
              showUploadList={false}
              beforeUpload={(file) => {
                getVideoDuration(file).then((durationSeconds) =>
                  setLesson(index, { videoFile: file, durationSeconds })
                );
                return false;
              }}
            >
              <Button variant="outline" type="button">
                {lesson.videoFile || lesson.videoUrl ? "Reemplazar video" : "Subir video"}
              </Button>
            </Upload>
          )}
        </div>
      )}

      {lesson.type === AcademyCourseModuleType.Text && (
        <>
          <Field label="Contenido de la lectura">
            <Input.TextArea
              disabled={readOnly}
              rows={6}
              value={lesson.content}
              onChange={(e) => setLesson(index, { content: e.target.value })}
            />
          </Field>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide">
              Archivos adjuntos (opcional)
            </span>
            {lesson.attachments.map((attachment) => (
              <div key={attachment.key} className="flex items-center gap-2 text-sm bg-gray-50 rounded-md px-3 py-2">
                <FontAwesomeIcon icon={faPaperclip} />
                <span className="truncate flex-1">{attachment.name}</span>
                {!readOnly && (
                  <button
                    type="button"
                    aria-label="Quitar adjunto"
                    onClick={() =>
                      setLesson(index, {
                        attachments: lesson.attachments.filter((a) => a.key !== attachment.key),
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>
            ))}
            {!readOnly && (
              <Upload
                multiple
                showUploadList={false}
                beforeUpload={(file) => {
                  setDraft((prev) => ({
                    ...prev,
                    lessons: prev.lessons.map((l) =>
                      l.key === lesson.key
                        ? {
                            ...l,
                            attachments: [
                              ...l.attachments,
                              { key: newKey(), name: file.name, file },
                            ],
                          }
                        : l
                    ),
                  }));
                  return false;
                }}
              >
                <Button variant="outline" type="button">
                  <FontAwesomeIcon icon={faPaperclip} /> Adjuntar archivo
                </Button>
              </Upload>
            )}
          </div>
        </>
      )}

      {lesson.type === AcademyCourseModuleType.Quiz && (
        <QuizEditor
          disabled={readOnly}
          questions={lesson.questions}
          onChange={(questions) => setLesson(index, { questions })}
        />
      )}
    </div>
  );

  const contentStep = (
    <div className="flex flex-col gap-4">
      {draft.modality === AcademyCourseModality.Online && (
        <>
          {draft.lessons.map(lessonEditor)}
          {!readOnly && (
            <div className="flex flex-wrap gap-2">
              {Object.values(AcademyCourseModuleType).map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  type="button"
                  onClick={() => set({ lessons: [...draft.lessons, emptyLesson(type)] })}
                >
                  <FontAwesomeIcon icon={MODULE_ICON[type]} /> Agregar{" "}
                  {MODULE_TYPE_LABEL[type].toLowerCase()}
                </Button>
              ))}
            </div>
          )}
          {draft.lessons.length > 0 && (
            <p className="text-sm text-gray-500">
              Los alumnos completan las lecciones en este orden. En los videos deben
              ver al menos el 90% para continuar.
            </p>
          )}
        </>
      )}

      {draft.modality === AcademyCourseModality.LiveStreaming && (
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4">
          <label className="flex items-center gap-3">
            <Switch
              disabled={readOnly}
              checked={draft.hasFinalQuiz}
              onChange={(hasFinalQuiz) =>
                set({ hasFinalQuiz, finalQuiz: hasFinalQuiz ? draft.finalQuiz : [] })
              }
            />
            <span>Agregar quiz final (disponible al terminar la transmisión)</span>
          </label>
          {draft.hasFinalQuiz && (
            <QuizEditor
              disabled={readOnly}
              questions={draft.finalQuiz}
              onChange={(finalQuiz) => set({ finalQuiz })}
            />
          )}
        </div>
      )}

      {draft.modality === AcademyCourseModality.Presential && (
        <div className="bg-white rounded-xl shadow-sm p-4 text-sm text-gray-600">
          Los cursos presenciales no tienen contenido en línea. Cada alumno inscrito
          tendrá un QR de acreditación en su app o en la web, y lo escaneas desde
          <b> Calendario → Tomar asistencia</b>.
        </div>
      )}
    </div>
  );

  const summaryStep = (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-2xl">
      {coverPreview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverPreview} alt="" className="w-full h-48 object-cover" />
      )}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex gap-1 flex-wrap">
          <Tag color="blue">{MODALITY_LABEL[draft.modality]}</Tag>
          {draft.courseType && <Tag>{CATEGORY_LABEL[draft.courseType]}</Tag>}
          {draft.level && <Tag>{LEVEL_LABEL[draft.level]}</Tag>}
        </div>
        <h2 className="text-xl font-bold">{draft.title}</h2>
        <p className="text-sm text-gray-600 whitespace-pre-line">{draft.description}</p>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Precio</dt>
          <dd>{formatUsd(draft.priceUsd)}</dd>
          <dt className="text-gray-500">Aprobación</dt>
          <dd>{draft.passingScore}%</dd>
          {draft.instructorName && (
            <>
              <dt className="text-gray-500">Dicta</dt>
              <dd>{draft.instructorName}</dd>
            </>
          )}
          {draft.scheduledAt && draft.modality !== AcademyCourseModality.Online && (
            <>
              <dt className="text-gray-500">Fecha</dt>
              <dd>
                {draft.scheduledAt.format("DD/MM/YYYY hh:mm a")} · {draft.durationMinutes} min
              </dd>
            </>
          )}
          {draft.modality === AcademyCourseModality.Online && (
            <>
              <dt className="text-gray-500">Lecciones</dt>
              <dd>{draft.lessons.length}</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );

  const stepContent = [infoStep, formatStep, contentStep, summaryStep][step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="flex flex-col gap-6">
      {readOnly && (
        <Alert
          type="info"
          showIcon
          message="Solo el creador del curso o un administrador puede modificarlo. Lo estás viendo en modo lectura."
        />
      )}

      <Steps
        current={step}
        items={STEPS.map((title) => ({ title }))}
        responsive
        onChange={readOnly || !course ? undefined : (s) => setStep(s)}
      />

      {errors.length > 0 && (
        <Alert
          type="error"
          showIcon
          message="Revisa estos datos"
          description={
            <ul className="list-disc pl-4">
              {errors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          }
        />
      )}

      {stepContent}

      {uploadStatus && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <span className="text-sm">Subiendo {uploadStatus.label}…</span>
          <Progress percent={uploadStatus.percent} />
        </div>
      )}

      <div className="flex gap-3 justify-between">
        <Button variant="outline" type="button" disabled={step === 0 || saving} onClick={goBack}>
          Atrás
        </Button>
        {isLast ? (
          !readOnly && (
            <Button variant="solid-blue" type="button" disabled={saving} onClick={publish}>
              {saving ? "Guardando…" : course ? "Guardar cambios" : "Publicar curso"}
            </Button>
          )
        ) : (
          <Button variant="solid-blue" type="button" onClick={goNext}>
            Siguiente
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseForm;
