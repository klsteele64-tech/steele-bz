#!/usr/bin/env node
/** Refresh bundled lesson content from cursor-training-baseline when available. */
import { cpSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const baselineRoot = join(root, "..", "cursor-training-baseline");
const outFile = join(root, "training-api", "dist", "bundled-content.json");

if (existsSync(baselineRoot)) {
  console.log("Bundling training API from cursor-training-baseline...");
  const result = spawnSync("npm", ["run", "bundle:api"], {
    cwd: baselineRoot,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  cpSync(join(baselineRoot, "api", "dist", "bundled-content.json"), outFile);
  console.log(`Updated ${outFile}`);
} else if (existsSync(outFile)) {
  console.log("Using committed training-api/dist/bundled-content.json");
} else {
  console.error("Missing bundled content — clone cursor-training-baseline alongside steele-bz");
  process.exit(1);
}
