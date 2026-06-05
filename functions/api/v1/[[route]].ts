import { handle } from "hono/cloudflare-pages";
import { createApp } from "../../../training-api/src/app";

const app = createApp("https://steele-bz.pages.dev");
export const onRequest = handle(app);
