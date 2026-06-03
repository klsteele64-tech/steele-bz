import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  /** "./" for Capacitor; "/apps/burger-buds/" when built for steele.bz */
  base: process.env.VITE_BASE ?? "./",
  plugins: [react()],
});
