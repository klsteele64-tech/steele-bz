import { handle } from "hono/cloudflare-pages";
import { createTrainingApp } from "../../../../../training-streams/shared/create-app";
import bundle from "../../../../../training-streams/lenstemper/dist/bundled-content.json";

const app = createTrainingApp({
  stream: "lenstemper",
  basePath: "/api/training/lenstemper/v1",
  bundle,
});
export const onRequest = handle(app);
