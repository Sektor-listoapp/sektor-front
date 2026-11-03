import dayjs, { Dayjs } from "dayjs";
import {
  AcademyCourse,
  AcademyCourseCategory,
  AcademyCourseLevel,
  AcademyCourseModality,
  AcademyCourseModuleInput,
  AcademyCourseModuleType,
  AcademyQuizQuestion,
  AcademyQuizQuestionInput,
  AcademyQuizQuestionType,
  CreateAcademyCourseInput,
} from "@/lib/sektor-api/__generated__/types";

export interface QuizQuestionDraft {
  key: string;
  type: AcademyQuizQuestionType;
  title: string;
  correctBooleanAnswer?: boolean;
  options: string[];
  correctIndex: number;
}

export interface AttachmentDraft {
  key: string;
  name: string;
  url?: string;
  file?: File;
}

export interface LessonDraft {
  key: string;
  type: AcademyCourseModuleType;
  title: string;
  videoUrl?: string;
  videoFile?: File;
  durationSeconds?: number;
  content: string;
  attachments: AttachmentDraft[];
  questions: QuizQuestionDraft[];
}

export interface CourseDraft {
  imageUrl?: string;
  imageFile?: File;
  title: string;
  description: string;
  instructorName: string;
  level?: AcademyCourseLevel;
  courseType?: AcademyCourseCategory;
  priceUsd: number;
  passingScore: number;
  modality: AcademyCourseModality;
  streamingUrl: string;
  location: string;
  scheduledAt?: Dayjs;
  durationMinutes: number;
  maxCapacity?: number;
  lessons: LessonDraft[];
  hasFinalQuiz: boolean;
  finalQuiz: QuizQuestionDraft[];
}

let seq = 0;
export const newKey = () => `k${Date.now().toString(36)}${(seq++).toString(36)}`;

export const emptyQuestion = (
  type: AcademyQuizQuestionType = AcademyQuizQuestionType.TrueFalse
): QuizQuestionDraft => ({
  key: newKey(),
  type,
  title: "",
  correctBooleanAnswer: type === AcademyQuizQuestionType.TrueFalse ? true : undefined,
  options: type === AcademyQuizQuestionType.MultipleChoice ? ["", ""] : [],
  correctIndex: 0,
});

export const emptyLesson = (type: AcademyCourseModuleType): LessonDraft => ({
  key: newKey(),
  type,
  title: "",
  content: "",
  attachments: [],
  questions: type === AcademyCourseModuleType.Quiz ? [emptyQuestion()] : [],
});

export const emptyCourse = (): CourseDraft => ({
  title: "",
  description: "",
  instructorName: "",
  priceUsd: 0,
  passingScore: 70,
  modality: AcademyCourseModality.Online,
  streamingUrl: "",
  location: "",
  durationMinutes: 60,
  lessons: [],
  hasFinalQuiz: false,
  finalQuiz: [],
});

const questionFromApi = (q: AcademyQuizQuestion): QuizQuestionDraft => ({
  key: newKey(),
  type: q.type,
  title: q.title,
  correctBooleanAnswer: q.correctBooleanAnswer ?? undefined,
  options: q.options ?? [],
  correctIndex: Math.max(0, (q.options ?? []).indexOf(q.correctOption ?? "")),
});

export const draftFromCourse = (course: AcademyCourse): CourseDraft => {
  const modality = course.modality ?? AcademyCourseModality.Online;
  // Live courses store their quiz twice (as a Quiz module and as
  // finalQuizQuestions, like the app does); edit it as one "final quiz".
  const liveQuiz =
    modality === AcademyCourseModality.LiveStreaming
      ? (course.finalQuizQuestions ?? []).length
        ? course.finalQuizQuestions ?? []
        : (course.modules ?? []).find((m) => m.type === AcademyCourseModuleType.Quiz)
            ?.quizQuestions ?? []
      : course.finalQuizQuestions ?? [];
  return {
  imageUrl: course.imageUrl ?? undefined,
  title: course.title,
  description: course.description,
  instructorName: course.instructorName ?? "",
  level: course.level ?? undefined,
  courseType: course.courseType ?? undefined,
  priceUsd: course.priceUsd,
  passingScore: course.passingScore ?? 70,
  modality,
  streamingUrl: course.streamingUrl ?? "",
  location: course.location ?? "",
  scheduledAt: course.scheduledAt ? dayjs(course.scheduledAt) : undefined,
  durationMinutes: course.durationMinutes ?? 60,
  maxCapacity: course.maxCapacity ?? undefined,
  lessons: (modality === AcademyCourseModality.Online ? course.modules ?? [] : []).map((m) => ({
    key: newKey(),
    type: m.type,
    title: m.title ?? "",
    videoUrl: m.videoUrl ?? undefined,
    durationSeconds: m.durationSeconds ?? undefined,
    content: m.content ?? "",
    attachments: (m.attachmentUrls ?? []).map((url) => ({
      key: newKey(),
      url,
      name: decodeURIComponent(url.split("/").pop() ?? url),
    })),
    questions: (m.quizQuestions ?? []).map(questionFromApi),
  })),
  hasFinalQuiz: liveQuiz.length > 0,
  finalQuiz: liveQuiz.map(questionFromApi),
  };
};

const questionToInput = (q: QuizQuestionDraft): AcademyQuizQuestionInput =>
  q.type === AcademyQuizQuestionType.TrueFalse
    ? { type: q.type, title: q.title.trim(), correctBooleanAnswer: !!q.correctBooleanAnswer }
    : {
        type: q.type,
        title: q.title.trim(),
        options: q.options.map((o) => o.trim()),
        correctOption: q.options[q.correctIndex]?.trim(),
      };

/** Builds the mutation input. Lesson/cover files must already be uploaded. */
export const draftToInput = (d: CourseDraft): CreateAcademyCourseInput => {
  const scheduled = d.modality !== AcademyCourseModality.Online;
  const liveQuiz =
    d.modality === AcademyCourseModality.LiveStreaming && d.hasFinalQuiz
      ? d.finalQuiz.map(questionToInput)
      : [];
  const modules: AcademyCourseModuleInput[] = liveQuiz.length
    ? // Same shape the app saves: students answer it as a module, which
      // unlocks once the live session is over.
      [{ type: AcademyCourseModuleType.Quiz, title: "Quiz final", quizQuestions: liveQuiz }]
    : d.modality === AcademyCourseModality.Online
      ? d.lessons.map((l) => ({
          type: l.type,
          title: l.title.trim() || undefined,
          videoUrl: l.type === AcademyCourseModuleType.Video ? l.videoUrl : undefined,
          durationSeconds:
            l.type === AcademyCourseModuleType.Video ? l.durationSeconds : undefined,
          content: l.type === AcademyCourseModuleType.Text ? l.content : undefined,
          attachmentUrls:
            l.type === AcademyCourseModuleType.Text
              ? l.attachments.map((a) => a.url!).filter(Boolean)
              : undefined,
          quizQuestions:
            l.type === AcademyCourseModuleType.Quiz
              ? l.questions.map(questionToInput)
              : [],
        }))
      : [];

  return {
    title: d.title.trim(),
    description: d.description.trim(),
    imageUrl: d.imageUrl,
    instructorName: d.instructorName.trim() || undefined,
    level: d.level,
    courseType: d.courseType!,
    priceUsd: d.priceUsd,
    passingScore: Math.round(d.passingScore),
    modality: d.modality,
    modules,
    streamingUrl:
      d.modality === AcademyCourseModality.LiveStreaming ? d.streamingUrl.trim() : undefined,
    location:
      d.modality === AcademyCourseModality.Presential ? d.location.trim() : undefined,
    scheduledAt: scheduled ? d.scheduledAt?.toISOString() : undefined,
    durationMinutes: scheduled ? d.durationMinutes : undefined,
    maxCapacity: scheduled ? d.maxCapacity : undefined,
    finalQuizQuestions: liveQuiz,
  };
};

/* ------------------------------- Validation ------------------------------- */

const validateQuestions = (questions: QuizQuestionDraft[], where: string) => {
  const errors: string[] = [];
  if (questions.length === 0) errors.push(`${where}: agrega al menos una pregunta`);
  questions.forEach((q, i) => {
    if (!q.title.trim()) errors.push(`${where}, pregunta ${i + 1}: falta el enunciado`);
    if (q.type === AcademyQuizQuestionType.MultipleChoice) {
      if (q.options.length < 2 || q.options.some((o) => !o.trim()))
        errors.push(`${where}, pregunta ${i + 1}: completa al menos dos opciones`);
      if (new Set(q.options.map((o) => o.trim())).size !== q.options.length)
        errors.push(`${where}, pregunta ${i + 1}: las opciones no pueden repetirse`);
    }
  });
  return errors;
};

export const validateStep = (step: number, d: CourseDraft): string[] => {
  const errors: string[] = [];
  if (step === 0) {
    if (!d.imageUrl && !d.imageFile) errors.push("Agrega una portada");
    if (!d.title.trim()) errors.push("El título es obligatorio");
    if (!d.description.trim()) errors.push("La descripción es obligatoria");
    if (!d.level) errors.push("Selecciona el nivel");
    if (!d.courseType) errors.push("Selecciona el tipo de curso");
  }
  if (step === 1 && d.modality !== AcademyCourseModality.Online) {
    if (!d.scheduledAt) errors.push("Indica la fecha y hora");
    if (d.modality === AcademyCourseModality.LiveStreaming) {
      if (!/^https?:\/\/\S+$/i.test(d.streamingUrl.trim()))
        errors.push("Ingresa un link de transmisión válido");
    }
    if (d.modality === AcademyCourseModality.Presential && !d.location.trim())
      errors.push("Indica la dirección o sede");
  }
  if (step === 2) {
    if (d.modality === AcademyCourseModality.Online) {
      if (d.lessons.length === 0) errors.push("Agrega al menos una lección");
      d.lessons.forEach((l, i) => {
        const where = `Lección ${i + 1}`;
        if (l.type === AcademyCourseModuleType.Video && !l.videoUrl && !l.videoFile)
          errors.push(`${where}: sube el video`);
        if (l.type === AcademyCourseModuleType.Text && !l.content.trim())
          errors.push(`${where}: escribe el contenido`);
        if (l.type === AcademyCourseModuleType.Quiz)
          errors.push(...validateQuestions(l.questions, where));
      });
    }
    if (d.modality === AcademyCourseModality.LiveStreaming && d.hasFinalQuiz)
      errors.push(...validateQuestions(d.finalQuiz, "Quiz final"));
  }
  return errors;
};
