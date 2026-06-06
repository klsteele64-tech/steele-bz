#!/usr/bin/env node
/** Copy lesson demo.mp4 from sibling content repos into apps/training/<stream>/media/ */
import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const STREAMS = {
  superpowers: join(root, "..", "cursor-training-superpowers"),
  baseline: join(root, "..", "cursor-training-baseline"),
  lenstemper: join(root, "..", "cursor-training-lenstemper"),
};

const stream = process.argv[2] || "superpowers";
const repoRoot = STREAMS[stream];
if (!repoRoot || !existsSync(repoRoot)) {
  console.warn(`Skip media copy — repo not found for ${stream}`);
  process.exit(0);
}

const indexPath = join(repoRoot, "content/lessons/index.json");
if (!existsSync(indexPath)) {
  console.warn(`Skip media copy — no index.json for ${stream}`);
  process.exit(0);
}

const index = JSON.parse(readFileSync(indexPath, "utf8"));
const destRoot = join(root, "apps", "training", stream, "media");
let copied = 0;

for (const lesson of index.lessons) {
  const src = join(repoRoot, "content/lessons", lesson.path, "media", "demo.mp4");
  if (!existsSync(src)) continue;
  const destDir = join(destRoot, lesson.id);
  mkdirSync(destDir, { recursive: true });
  cpSync(src, join(destDir, "demo.mp4"));
  copied++;
}

console.log(`Copied ${copied} demo videos → apps/training/${stream}/media/`);
