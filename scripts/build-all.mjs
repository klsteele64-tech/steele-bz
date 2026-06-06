import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    cwd: root,
    ...options,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

console.log("Building Astro site...");
run("npm", ["run", "build", "--workspace=site"]);

console.log("Building burger-buds app...");
run("npm", ["run", "build", "--workspace=burger-buds"], {
  env: {
    ...process.env,
    VITE_BASE: "/apps/burger-buds/",
  },
});

const distRoot = join(root, "dist");
const siteDist = join(root, "site", "dist");
const burgerDist = join(root, "apps", "burger-buds", "dist");

console.log("Assembling unified dist/...");
if (existsSync(distRoot)) {
  rmSync(distRoot, { recursive: true, force: true });
}
mkdirSync(distRoot, { recursive: true });

copyDir(siteDist, distRoot);
copyDir(burgerDist, join(distRoot, "apps", "burger-buds"));

console.log("Copying training web apps...");
run("node", ["scripts/build-training-apps.mjs"]);
run("node", ["scripts/copy-training-media.mjs", "superpowers"]);

console.log("Build complete → dist/");
