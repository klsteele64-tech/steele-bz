import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types.js";
import {
  getCatalog,
  getDoc,
  getLesson,
  getOpenApiSpec,
  lessonForClient,
  scoreQuiz,
} from "./content.js";

const DEFAULT_ORIGINS = [
  "https://steele-bz.pages.dev",
  "https://steele.bz",
  "http://localhost:8788",
  "http://127.0.0.1:8788",
  "http://localhost:3000",
];

export function createApp(baseUrl = "https://steele-bz.pages.dev") {
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

  app.get("/health", (c) =>
    c.json({ status: "ok", service: "cursor-training-api", stream: "baseline" })
  );

  app.get("/api/v1/openapi.json", (c) => {
    const url = new URL(c.req.url);
    const base = `${url.protocol}//${url.host}`;
    return c.json(getOpenApiSpec(base));
  });

  app.get("/api/v1/catalog", (c) => {
    const catalog = getCatalog();
    return c.json({
      schemaVersion: 1,
      stream: "baseline",
      ...catalog,
    });
  });

  app.get("/api/v1/lessons/:id", (c) => {
    const id = c.req.param("id");
    const lesson = getLesson(id);
    if (!lesson) return c.json({ error: "Lesson not found" }, 404);
    return c.json({
      id,
      ...lessonForClient(lesson.meta),
      demoMarkdown: lesson.demoMarkdown,
      hasAssist: Boolean(lesson.meta.assistMode && lesson.meta.assistMode !== "none"),
    });
  });

  app.get("/api/v1/lessons/:id/assist", (c) => {
    const id = c.req.param("id");
    const lesson = getLesson(id);
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

  app.post("/api/v1/lessons/:id/quiz", async (c) => {
    const id = c.req.param("id");
    const lesson = getLesson(id);
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

  app.get("/api/v1/docs/:slug", (c) => {
    const slug = c.req.param("slug");
    const doc = getDoc(slug);
    if (!doc) return c.json({ error: "Doc slug not found" }, 404);
    return c.json(doc);
  });

  return app;
}

export default createApp;
