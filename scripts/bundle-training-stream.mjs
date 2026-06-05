#!/usr/bin/env node
/** Bundle one training stream from a sibling repo into training-streams/<name>/dist/ */
import { readFile, mkdir, writeFile, access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const STREAMS = {
  baseline: join(root, "..", "cursor-training-baseline"),
  lenstemper: join(root, "..", "cursor-training-lenstemper"),
  superpowers: join(root, "..", "cursor-training-superpowers"),
};

const stream = process.argv[2];
if (!stream || !STREAMS[stream]) {
  console.error("Usage: node scripts/bundle-training-stream.mjs <baseline|lenstemper|superpowers>");
  process.exit(1);
}

const repoRoot = STREAMS[stream];
const outDir = join(root, "training-streams", stream, "dist");
const lessonsDir = join(repoRoot, "content/lessons");

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const index = JSON.parse(await readFile(join(lessonsDir, "index.json"), "utf8"));

let manifest = { slugs: [] };
const manifestPath = join(repoRoot, "docs-pack/manifest.json");
if (await fileExists(manifestPath)) {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
}

const lessons = {};
for (const lesson of index.lessons) {
  const dir = join(lessonsDir, lesson.path);
  const meta = JSON.parse(await readFile(join(dir, "meta.json"), "utf8"));
  const demoMarkdown = await readFile(join(dir, "DEMO.md"), "utf8");
  let assistMarkdown = null;
  if (meta.assistMode && meta.assistMode !== "none") {
    try {
      assistMarkdown = await readFile(join(dir, "ASSIST.md"), "utf8");
    } catch {
      /* optional */
    }
  }
  lessons[lesson.id] = { meta, demoMarkdown, assistMarkdown };
}

const docs = {};
for (const entry of manifest.slugs || []) {
  const md = await readFile(join(repoRoot, "docs-pack", entry.slug, "index.md"), "utf8");
  docs[entry.slug] = {
    slug: entry.slug,
    title: entry.title,
    canonicalUrl: entry.canonicalUrl,
    lastReviewed: entry.lastReviewed,
    attribution: entry.attribution ?? "Curated training excerpt — see canonical URL.",
    markdown: md,
  };
}

const bundle = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  stream,
  catalog: index,
  lessons,
  docs,
  manifest,
};

await mkdir(outDir, { recursive: true });
await writeFile(join(outDir, "bundled-content.json"), JSON.stringify(bundle));
console.log(`Bundled ${stream}: ${Object.keys(lessons).length} lessons, ${Object.keys(docs).length} docs → training-streams/${stream}/dist/`);
