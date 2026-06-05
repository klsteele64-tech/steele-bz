import type { ContentBundle, LessonMeta } from "./types.js";
// Bundled at build time — run `npm run bundle:api`
import bundle from "../dist/bundled-content.json" with { type: "json" };

const data = bundle as ContentBundle;

export function getCatalog() {
  return data.catalog;
}

export function getLesson(id: string) {
  return data.lessons[id] ?? null;
}

export function getDoc(slug: string) {
  return data.docs[slug] ?? null;
}

export function getOpenApiSpec(baseUrl: string) {
  return {
    openapi: "3.0.3",
    info: {
      title: "Cursor Training API",
      version: "1.0.0",
      description: "Baseline stream — 40 lessons",
    },
    servers: [{ url: baseUrl }],
    paths: {
      "/health": { get: { summary: "Health check" } },
      "/api/v1/catalog": { get: { summary: "Lesson catalog" } },
      "/api/v1/lessons/{id}": { get: { summary: "Lesson payload" } },
      "/api/v1/lessons/{id}/quiz": { post: { summary: "Score quiz" } },
      "/api/v1/lessons/{id}/assist": { get: { summary: "Assist prompt" } },
      "/api/v1/docs/{slug}": { get: { summary: "Offline doc excerpt" } },
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

export { data as bundle };
