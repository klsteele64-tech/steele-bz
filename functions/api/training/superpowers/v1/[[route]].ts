import { handle } from "hono/cloudflare-pages";
import { createTrainingApp } from "../../../../../training-streams/shared/create-app";
import bundle from "../../../../../training-streams/superpowers/dist/bundled-content.json";

const app = createTrainingApp({
  stream: "superpowers",
  basePath: "/api/training/superpowers/v1",
  bundle,
});
export const onRequest = handle(app);
