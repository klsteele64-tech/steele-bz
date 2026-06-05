import type { ContentBundle, LessonMeta } from "./types.js";

export function createContentStore(data: ContentBundle) {
  return {
    getCatalog() {
      return data.catalog;
    },
    getLesson(id: string) {
      return data.lessons[id] ?? null;
    },
    getDoc(slug: string) {
      return data.docs[slug] ?? null;
    },
    getManifest() {
      return data.manifest;
    },
    bundle: data,
  };
}

export function getOpenApiSpec(baseUrl: string, stream: string) {
  return {
    openapi: "3.0.3",
    info: {
      title: `Cursor Training API — ${stream}`,
      version: "1.0.0",
      description: `${stream} stream`,
    },
    servers: [{ url: baseUrl }],
    paths: {
      "/catalog": { get: { summary: "Lesson catalog" } },
      "/lessons/{id}": { get: { summary: "Lesson payload" } },
      "/lessons/{id}/quiz": { post: { summary: "Score quiz" } },
      "/lessons/{id}/assist": { get: { summary: "Assist prompt" } },
      "/docs/{slug}": { get: { summary: "Offline doc excerpt" } },
    },
  };
}

export function lessonForClient(meta: LessonMeta) {
  const { quiz, ...rest } = meta;
  return {
    ...rest,
    quiz: quiz.map(({ q, choices }) => ({ q, choices })),
  };
}

export function scoreQuiz(meta: LessonMeta, answers: number[]) {
  if (!Array.isArray(answers) || answers.length !== meta.quiz.length) {
    return { error: "answers must be an array matching quiz length", status: 400 as const };
  }
  let score = 0;
  const feedback = meta.quiz.map((q, i) => {
    const correct = answers[i] === q.answer;
    if (correct) score++;
    return { question: q.q, correct, selected: answers[i] };
  });
  const passed = score >= 2;
  return { score, passed, total: meta.quiz.length, feedback, status: 200 as const };
}
