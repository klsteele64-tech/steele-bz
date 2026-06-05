import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentBundle, Env } from "./types.js";
import {
  createContentStore,
  getOpenApiSpec,
  lessonForClient,
  scoreQuiz,
} from "./content-helpers.js";

const DEFAULT_ORIGINS = [
  "https://steele-bz.pages.dev",
  "https://steele.bz",
  "http://localhost:8788",
  "http://127.0.0.1:8788",
  "http://localhost:3000",
];

export type CreateAppOptions = {
  stream: string;
  basePath: string;
  bundle: ContentBundle;
  siteUrl?: string;
};

export function createTrainingApp({
  stream,
  basePath,
  bundle,
  siteUrl = "https://steele-bz.pages.dev",
}: CreateAppOptions) {
  const store = createContentStore(bundle);
  const app = new Hono<{ Bindings: Env }>();

  app.use("*", async (c, next) => {
    const extra = c.env?.CORS_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
    const origins = [...DEFAULT_ORIGINS, ...extra];
    return cors({
      origin: (origin) => {
        if (!origin) return "*";
        if (origins.includes(origin)) return origin;
        if (origin.endsWith(".pages.dev")) return origin;
        return origins[0];
      },
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"],
    })(c, next);
  });

  const api = new Hono();

  api.get("/openapi.json", (c) => {
    const url = new URL(c.req.url);
    const base = `${url.protocol}//${url.host}${basePath}`;
    return c.json(getOpenApiSpec(base, stream));
  });

  api.get("/catalog", (c) =>
    c.json({
      schemaVersion: 1,
      stream,
      ...store.getCatalog(),
    })
  );

  api.get("/lessons/:id", (c) => {
    const id = c.req.param("id");
    const lesson = store.getLesson(id);
    if (!lesson) return c.json({ error: "Lesson not found" }, 404);
    return c.json({
      id,
      ...lessonForClient(lesson.meta),
      demoMarkdown: lesson.demoMarkdown,
      hasAssist: Boolean(lesson.meta.assistMode && lesson.meta.assistMode !== "none"),
    });
  });

  api.get("/lessons/:id/assist", (c) => {
    const id = c.req.param("id");
    const lesson = store.getLesson(id);
    if (!lesson) return c.json({ error: "Lesson not found" }, 404);
    if (!lesson.meta.assistMode || lesson.meta.assistMode === "none") {
      return c.json({ error: "No assist for this lesson" }, 404);
    }
    if (!lesson.assistMarkdown) {
      return c.json({ error: "Assist content missing" }, 404);
    }
    return c.json({
      id,
      assistMode: lesson.meta.assistMode,
      markdown: lesson.assistMarkdown,
    });
  });

  api.post("/lessons/:id/quiz", async (c) => {
    const id = c.req.param("id");
    const lesson = store.getLesson(id);
    if (!lesson) return c.json({ error: "Lesson not found" }, 404);
    let body: { answers?: number[] };
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }
    const result = scoreQuiz(lesson.meta, body.answers ?? []);
    if ("error" in result && result.status === 400) {
      return c.json({ error: result.error }, 400);
    }
    return c.json({
      id,
      score: result.score,
      passed: result.passed,
      total: result.total,
      feedback: result.feedback,
    });
  });

  api.get("/docs/:slug", (c) => {
    const slug = c.req.param("slug");
    const doc = store.getDoc(slug);
    if (!doc) return c.json({ error: "Doc slug not found" }, 404);
    return c.json(doc);
  });

  app.route(basePath, api);

  app.get("/health", (c) =>
    c.json({ status: "ok", service: "cursor-training-api", stream })
  );

  return app;
}
