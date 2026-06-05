import { handle } from "hono/cloudflare-pages";
import { createTrainingApp } from "../../../training-streams/shared/create-app";
import bundle from "../../../training-streams/baseline/dist/bundled-content.json";

const app = createTrainingApp({
  stream: "baseline",
  basePath: "/api/v1",
  bundle,
});
export const onRequest = handle(app);
